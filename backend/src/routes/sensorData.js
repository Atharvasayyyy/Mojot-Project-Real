const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const axios = require('axios');

// POST - Receive sensor data from device (Standard format)
router.post('/', auth, async (req, res) => {
  try {
    const { deviceId, heartRate, hrv, bloodOxygen, acceleration, gyroscope, sessionId } = req.body;

    // Calculate motion level
    const motionLevel = Math.min(100, Math.sqrt(
      Math.pow(acceleration?.x || 0, 2) +
      Math.pow(acceleration?.y || 0, 2) +
      Math.pow(acceleration?.z || 0, 2)
    ) * 10);

    const sensorData = new SensorData({
      userId: req.userId,
      deviceId,
      sessionId,
      heartRate: {
        value: heartRate,
        unit: 'bpm',
        confidence: 0.95
      },
      hrv,
      bloodOxygen: {
        value: bloodOxygen,
        unit: '%',
        confidence: 0.90
      },
      acceleration,
      gyroscope,
      motionLevel,
      restlessnessIndex: calculateRestlessness(acceleration, gyroscope),
      dataQuality: {
        signalStrength: 85,
        dataComplete: true,
        anomalyDetected: false
      }
    });

    await sensorData.save();

    // Trigger ML prediction if session active
    if (sessionId && process.env.ENABLE_ML_PREDICTIONS === 'true') {
      try {
        await predictEngagement(sensorData);
      } catch (mlError) {
        console.log('ML prediction error:', mlError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Sensor data recorded',
      data: sensorData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Receive sensor data from Arduino IDE (Direct format)
// Format: {"sessionId":"S001","timestamp":25041,"heartRate":0,"hrvRmssd":0,"spo2":0,"motionLevel":10.23088,"restlessnessIndex":0.009722}
router.post('/arduino/data', async (req, res) => {
  try {
    const { sessionId, timestamp, heartRate, hrvRmssd, spo2, motionLevel, restlessnessIndex, userId, deviceId } = req.body;

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    // Find session to get userId if not provided
    let actualUserId = userId;
    if (!actualUserId) {
      const session = await Session.findOne({ _id: sessionId });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }
      actualUserId = session.userId;
    }

    const sensorData = new SensorData({
      userId: actualUserId,
      deviceId: deviceId || 'ESP32-' + sessionId,
      sessionId,
      timestamp: timestamp || Date.now(),
      heartRate: {
        value: heartRate || 0,
        unit: 'bpm',
        confidence: heartRate > 0 ? 0.95 : 0.0
      },
      hrv: {
        rmssd: hrvRmssd || 0,
        unit: 'ms',
        confidence: hrvRmssd > 0 ? 0.90 : 0.0
      },
      bloodOxygen: {
        value: spo2 || 0,
        unit: '%',
        confidence: spo2 > 0 ? 0.90 : 0.0
      },
      motionLevel: motionLevel || 0,
      restlessnessIndex: restlessnessIndex || 0,
      dataQuality: {
        signalStrength: calculateSignalQuality({ heartRate, hrvRmssd, spo2 }),
        dataComplete: !!(heartRate || hrvRmssd || spo2 || motionLevel),
        anomalyDetected: detectAnomalies({ heartRate, hrvRmssd, spo2, motionLevel, restlessnessIndex })
      }
    });

    await sensorData.save();

    // Trigger ML prediction if enough data collected
    if (sessionId && process.env.ENABLE_ML_PREDICTIONS === 'true') {
      try {
        const result = await predictEngagement(sensorData);
        return res.status(201).json({
          success: true,
          message: 'Sensor data recorded and analyzed',
          data: sensorData,
          prediction: result
        });
      } catch (mlError) {
        console.log('ML prediction error:', mlError.message);
        return res.status(201).json({
          success: true,
          message: 'Sensor data recorded (prediction pending)',
          data: sensorData
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Sensor data recorded from Arduino',
      data: sensorData
    });
  } catch (error) {
    console.error('Arduino data error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve sensor data
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const data = await SensorData.find({
      sessionId: req.params.sessionId,
      userId: req.userId
    }).sort({ timestamp: -1 }).limit(100);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Session statistics
router.get('/stats/:sessionId', auth, async (req, res) => {
  try {
    const stats = await SensorData.getSessionStats(req.params.sessionId);
    res.json({ success: true, stats: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function - Calculate motion level from acceleration
function calculateRestlessness(acceleration, gyroscope) {
  const accSum = Math.abs(acceleration?.x || 0) + Math.abs(acceleration?.y || 0) + Math.abs(acceleration?.z || 0);
  const gyroSum = Math.abs(gyroscope?.x || 0) + Math.abs(gyroscope?.y || 0) + Math.abs(gyroscope?.z || 0);
  return Math.min(100, (accSum + gyroSum) * 5);
}

// Helper function - Calculate signal quality based on available data
function calculateSignalQuality(data) {
  let quality = 50; // Base quality
  if (data.heartRate > 0 && data.heartRate < 250) quality += 20;
  if (data.hrvRmssd > 0 && data.hrvRmssd < 200) quality += 20;
  if (data.spo2 > 0 && data.spo2 <= 100) quality += 20;
  if (data.motionLevel >= 0) quality += 10;
  return Math.min(100, quality);
}

// Helper function - Detect anomalies in sensor readings
function detectAnomalies(data) {
  const anomalies = [];
  
  // Heart rate anomalies
  if (data.heartRate > 200 || data.heartRate < 30 && data.heartRate > 0) anomalies.push('HR');
  
  // SpO2 anomalies
  if (data.spo2 > 100 || data.spo2 < 70 && data.spo2 > 0) anomalies.push('SpO2');
  
  // HRV anomalies
  if (data.hrvRmssd > 200) anomalies.push('HRV');
  
  // Motion anomalies
  if (data.motionLevel > 100 || data.motionLevel < 0) anomalies.push('Motion');
  
  return anomalies.length > 0;
}

// Call ML service for prediction and hobby analysis
async function predictEngagement(sensorData) {
  try {
    const features = {
      heartRate: sensorData.heartRate.value || 0,
      hrv_rmssd: sensorData.hrv?.rmssd || 0,
      bloodOxygen: sensorData.bloodOxygen.value || 0,
      motionLevel: sensorData.motionLevel || 0,
      restlessnessIndex: sensorData.restlessnessIndex || 0
    };

    // Call ML service for prediction
    const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, { features }, { timeout: 5000 });

    if (response.data.success) {
      sensorData.processedFeatures = response.data.predictions;
      sensorData.processed = true;
      
      // Update hobby prediction in database
      if (response.data.predictions.hobby) {
        const Prediction = require('../models/Prediction');
        await Prediction.create({
          userId: sensorData.userId,
          sessionId: sensorData.sessionId,
          sensorDataId: sensorData._id,
          engagementLevel: response.data.predictions.engagement,
          stressLevel: response.data.predictions.stress,
          predictedHobby: response.data.predictions.hobby,
          confidence: response.data.predictions.confidence,
          features: features
        });
      }
      
      await sensorData.save();
      return response.data.predictions;
    }
  } catch (error) {
    console.error('ML service error:', error.message);
    throw error;
  }
}

module.exports = router;
