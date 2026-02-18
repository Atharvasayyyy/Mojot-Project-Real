/**
 * 🧠 ML Predictions Route - Fetch from DB and Predict
 * Integrates database sensor data with ML model predictions
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const SensorData = require('../models/SensorData');
const Session = require('../models/Session');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

const ML_API_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// ==================== PREDICT FROM DATABASE ====================

/**
 * POST /api/ml/predict/session/:sessionId
 * Fetch sensor data from database and get ML predictions
 */
router.post('/predict/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 100, analyzeSession = false } = req.body;

    // Validate sessionId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid session ID format' 
      });
    }

    // Check session authorization
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access to session' 
      });
    }

    // Fetch sensor data from database
    console.log(`📊 Fetching sensor data for session ${sessionId}...`);
    const sensorDataList = await SensorData.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    if (sensorDataList.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data found for this session'
      });
    }

    console.log(`✅ Found ${sensorDataList.length} sensor readings`);

    // Transform to ML model format
    const mlInputs = sensorDataList.map(data => ({
      heart_rate: data.heartRate?.value || data.heartRate || 0,
      hrv_rmssd: data.hrv?.rmssd || data.hrvRmssd || 0,
      blood_oxygen: data.bloodOxygen?.value || data.spo2 || 0,
      motion_level: data.motionLevel || 0,
      restlessness_index: data.restlessnessIndex || 0
    }));

    // Filter out invalid readings (all zeros)
    const validInputs = mlInputs.filter(input => 
      input.heart_rate > 0 && input.hrv_rmssd > 0
    );

    if (validInputs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid sensor data found (all readings are zero or invalid)'
      });
    }

    console.log(`🧠 Sending ${validInputs.length} valid readings to ML model...`);

    // Send to ML model
    let mlResponse;
    if (analyzeSession) {
      // Get full session analysis
      mlResponse = await axios.post(
        `${ML_API_URL}/analyze-session`,
        { sensor_data: validInputs },
        { timeout: 15000 }
      );
    } else {
      // Get individual predictions
      mlResponse = await axios.post(
        `${ML_API_URL}/predict-batch`,
        { readings: validInputs },
        { timeout: 15000 }
      );
    }

    console.log('✅ ML predictions received');

    // Save predictions to database
    if (analyzeSession) {
      const analysis = mlResponse.data;
      
      // Create prediction record for session summary
      const predictionRecord = new Prediction({
        userId: session.userId,
        sessionId: session._id,
        timestamp: new Date(),
        engagementLevel: analysis.dominant_state,
        confidence: analysis.session_score / 100,
        rawPredictions: analysis.state_percentages,
        recommendations: analysis.recommendations
      });

      await predictionRecord.save();

      return res.json({
        success: true,
        message: 'Session analyzed successfully',
        sessionId,
        totalReadings: sensorDataList.length,
        validReadings: validInputs.length,
        analysis: {
          dominantState: analysis.dominant_state,
          sessionScore: analysis.session_score,
          statePercentages: analysis.state_percentages,
          stateCounts: analysis.state_counts,
          recommendations: analysis.recommendations
        },
        predictionId: predictionRecord._id
      });
    } else {
      // Individual predictions
      const predictions = mlResponse.data;

      // Calculate summary statistics
      const stateCounts = { Relaxed: 0, Engaged: 0, Stressed: 0, Bored: 0 };
      let totalConfidence = 0;

      predictions.forEach(pred => {
        if (stateCounts.hasOwnProperty(pred.state)) {
          stateCounts[pred.state]++;
        }
        totalConfidence += pred.confidence;
      });

      const avgConfidence = totalConfidence / predictions.length;
      const dominantState = Object.keys(stateCounts).reduce((a, b) => 
        stateCounts[a] > stateCounts[b] ? a : b
      );

      return res.json({
        success: true,
        message: 'Predictions generated successfully',
        sessionId,
        totalReadings: sensorDataList.length,
        validReadings: validInputs.length,
        summary: {
          dominantState,
          averageConfidence: avgConfidence,
          stateCounts,
          statePercentages: {
            Relaxed: (stateCounts.Relaxed / predictions.length * 100).toFixed(1),
            Engaged: (stateCounts.Engaged / predictions.length * 100).toFixed(1),
            Stressed: (stateCounts.Stressed / predictions.length * 100).toFixed(1),
            Bored: (stateCounts.Bored / predictions.length * 100).toFixed(1)
          }
        },
        predictions: predictions.slice(0, 10) // Return first 10 for preview
      });
    }

  } catch (error) {
    console.error('❌ ML Prediction Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML service is not available. Please ensure the ML model server is running on port 8000.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Prediction failed',
      error: error.message
    });
  }
});

// ==================== ANALYZE SESSION ====================

/**
 * POST /api/ml/analyze/session/:sessionId
 * Fetch sensor data and provide detailed session analysis
 */
router.post('/analyze/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { save = false } = req.body;

    // Validate sessionId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid session ID format' 
      });
    }

    // Check session authorization
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access to session' 
      });
    }

    // Fetch sensor data from database
    console.log(`📊 Analyzing session ${sessionId}...`);
    const sensorDataList = await SensorData.find({ sessionId })
      .sort({ timestamp: -1 });

    if (sensorDataList.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data found for this session'
      });
    }

    console.log(`✅ Found ${sensorDataList.length} sensor readings`);

    // Transform to ML model format
    const mlInputs = sensorDataList.map(data => ({
      heart_rate: data.heartRate?.value || data.heartRate || 0,
      hrv_rmssd: data.hrv?.rmssd || data.hrvRmssd || 0,
      blood_oxygen: data.bloodOxygen?.value || data.spo2 || 0,
      motion_level: data.motionLevel || 0,
      restlessness_index: data.restlessnessIndex || 0
    }));

    // Filter out invalid readings
    const validInputs = mlInputs.filter(input => 
      input.heart_rate > 0 && input.hrv_rmssd > 0
    );

    if (validInputs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid sensor data found'
      });
    }

    console.log(`🧠 Analyzing ${validInputs.length} readings...`);

    // Call ML API for session analysis
    const mlResponse = await axios.post(
      `${ML_API_URL}/analyze-session`,
      { sensor_data: validInputs },
      { timeout: 15000 }
    );

    const analysis = mlResponse.data;

    // Save analysis to database if requested
    if (save) {
      const analysisRecord = new Prediction({
        sessionId,
        userId: req.userId,
        predictions: analysis.predictions || [],
        analysis: {
          totalReadings: sensorDataList.length,
          validReadings: validInputs.length,
          domainentState: analysis.dominant_state,
          stateDistribution: analysis.state_percentages,
          sessionScore: analysis.session_score,
          recommendations: analysis.recommendations
        }
      });

      await analysisRecord.save();
      console.log(`✅ Analysis saved to database`);
    }

    res.json({
      success: true,
      message: 'Session analysis completed',
      sessionId,
      totalReadings: sensorDataList.length,
      validReadings: validInputs.length,
      session_score: analysis.session_score,
      dominant_state: analysis.dominant_state,
      state_percentages: analysis.state_percentages,
      state_counts: analysis.state_counts,
      recommendations: analysis.recommendations,
      predictions_preview: analysis.predictions ? analysis.predictions.slice(0, 5) : []
    });

  } catch (error) {
    console.error('❌ Session Analysis Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML service is not available'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Session analysis failed',
      error: error.message
    });
  }
});


// ==================== PREDICT SINGLE READING ====================

/**
 * POST /api/ml/predict/single
 * Predict state from manual sensor input
 */
router.post('/predict/single', auth, async (req, res) => {
  try {
    const { heart_rate, hrv_rmssd, blood_oxygen, motion_level, restlessness_index } = req.body;

    // Validate inputs
    if (!heart_rate || !hrv_rmssd || !blood_oxygen || motion_level === undefined || restlessness_index === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required sensor data fields'
      });
    }

    const sensorInput = {
      heart_rate: parseFloat(heart_rate),
      hrv_rmssd: parseFloat(hrv_rmssd),
      blood_oxygen: parseFloat(blood_oxygen),
      motion_level: parseFloat(motion_level),
      restlessness_index: parseFloat(restlessness_index)
    };

    console.log('🧠 Sending single prediction to ML model...');

    // Call ML API
    const mlResponse = await axios.post(
      `${ML_API_URL}/predict`,
      sensorInput,
      { timeout: 5000 }
    );

    const prediction = mlResponse.data;

    res.json({
      success: true,
      message: 'Prediction successful',
      input: sensorInput,
      prediction: {
        state: prediction.state,
        confidence: prediction.confidence,
        probabilities: prediction.probabilities,
        timestamp: prediction.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Prediction Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML service unavailable'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Prediction failed',
      error: error.message
    });
  }
});


// ==================== GET LATEST PREDICTIONS ====================

/**
 * GET /api/ml/predictions/:sessionId
 * Get saved predictions for a session
 */
router.get('/predictions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ success: false, message: 'Invalid session ID' });
    }

    const predictions = await Prediction.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      count: predictions.length,
      predictions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==================== ML MODEL STATUS ====================

/**
 * GET /api/ml/status
 * Check if ML service is available
 */
router.get('/status', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 3000 });
    
    res.json({
      success: true,
      mlService: 'available',
      serviceUrl: ML_API_URL,
      modelInfo: response.data
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      mlService: 'unavailable',
      serviceUrl: ML_API_URL,
      message: 'ML model service is not responding'
    });
  }
});


// ==================== GET MODEL INFO ====================

/**
 * GET /api/ml/model-info
 * Get information about the ML model
 */
router.get('/model-info', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/model-info`, { timeout: 3000 });
    
    res.json({
      success: true,
      modelInfo: response.data
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Could not fetch model information'
    });
  }
});


module.exports = router;
