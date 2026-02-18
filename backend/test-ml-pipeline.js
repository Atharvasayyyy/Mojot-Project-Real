/**
 * 🧪 Test Complete ML Pipeline
 * Tests: Database → Backend → ML Model → Predictions
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BACKEND_URL = 'http://localhost:5000';
const ML_API_URL = 'http://localhost:8000';

// Test user credentials from seed
const TEST_EMAIL = 'testuser@engage.dev';
const TEST_PASSWORD = 'password123';
const TEST_SESSION_ID = '6995e222b6522e5dc25a5817';

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TESTING COMPLETE ML PIPELINE');
  console.log('='.repeat(70));

  try {
    // ==================== TEST 1: ML API Health ====================
    console.log('\n📝 TEST 1: ML API Health Check');
    console.log('─'.repeat(70));
    
    const mlHealth = await axios.get(`${ML_API_URL}/health`);
    console.log('✅ ML API is healthy');
    console.log(`   Service: ${mlHealth.data.service}`);
    console.log(`   Version: ${mlHealth.data.version}`);
    console.log(`   States: ${mlHealth.data.states.join(', ')}`);
    console.log(`   Model Loaded: ${mlHealth.data.model_loaded}`);

    // ==================== TEST 2: Backend Health ====================
    console.log('\n📝 TEST 2: Backend Health Check');
    console.log('─'.repeat(70));
    
    const backendHealth = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Backend is healthy');
    console.log(`   Database: ${backendHealth.data.database}`);

    // ==================== TEST 3: Login & Get Token ====================
    console.log('\n📝 TEST 3: User Authentication');
    console.log('─'.repeat(70));
    
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log(`   User: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`);
    console.log(`   Email: ${loginResponse.data.user.email}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // ==================== TEST 4: Check ML Service from Backend ====================
    console.log('\n📝 TEST 4: Backend → ML Service Connection');
    console.log('─'.repeat(70));
    
    const mlStatus = await axios.get(`${BACKEND_URL}/api/ml/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Backend can reach ML service');
    console.log(`   ML Service: ${mlStatus.data.mlService}`);
    console.log(`   Service URL: ${mlStatus.data.serviceUrl}`);

    // ==================== TEST 5: Single Prediction ====================
    console.log('\n📝 TEST 5: Single Prediction (Manual Input)');
    console.log('─'.repeat(70));
    
    const testData = {
      heart_rate: 75,
      hrv_rmssd: 45,
      blood_oxygen: 97,
      motion_level: 8,
      restlessness_index: 0.12
    };

    console.log(`   Input: HR=${testData.heart_rate}, HRV=${testData.hrv_rmssd}, `
      + `SpO2=${testData.blood_oxygen}, Motion=${testData.motion_level}, `
      + `Rest=${testData.restlessness_index}`);

    const singlePred = await axios.post(`${BACKEND_URL}/api/ml/predict/single`, testData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Prediction successful');
    console.log(`   State: ${singlePred.data.prediction.state}`);
    console.log(`   Confidence: ${(singlePred.data.prediction.confidence * 100).toFixed(1)}%`);
    console.log(`   Probabilities:`);
    Object.entries(singlePred.data.prediction.probabilities).forEach(([state, prob]) => {
      const bar = '█'.repeat(Math.round(prob * 20));
      console.log(`      ${state.padEnd(12)}: ${(prob * 100).toFixed(1).padStart(5)}% ${bar}`);
    });

    // ==================== TEST 6: Database Predictions ====================
    console.log('\n📝 TEST 6: Predictions from Database (Session Analysis)');
    console.log('─'.repeat(70));
    console.log(`   Session ID: ${TEST_SESSION_ID}`);
    
    const sessionPred = await axios.post(
      `${BACKEND_URL}/api/ml/predict/session/${TEST_SESSION_ID}`,
      { analyzeSession: false, limit: 29 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ Session predictions generated');
    console.log(`   Total Readings: ${sessionPred.data.totalReadings}`);
    console.log(`   Valid Readings: ${sessionPred.data.validReadings}`);
    console.log(`   Dominant State: ${sessionPred.data.summary.dominantState}`);
    console.log(`   Avg Confidence: ${(sessionPred.data.summary.averageConfidence * 100).toFixed(1)}%`);
    console.log(`\n   State Distribution:`);
    Object.entries(sessionPred.data.summary.statePercentages).forEach(([state, percent]) => {
      const bar = '█'.repeat(Math.round(parseFloat(percent) / 5));
      console.log(`      ${state.padEnd(12)}: ${String(percent).padStart(5)}% ${bar}`);
    });

    console.log(`\n   First 5 Predictions:`);
    sessionPred.data.predictions.slice(0, 5).forEach((pred, i) => {
      console.log(`      ${i + 1}. State: ${pred.state}, Confidence: ${(pred.confidence * 100).toFixed(1)}%`);
    });

    // ==================== TEST 7: Session Analysis (Full) ====================
    console.log('\n📝 TEST 7: Full Session Analysis with Recommendations');
    console.log('─'.repeat(70));
    
    const sessionAnalysis = await axios.post(
      `${BACKEND_URL}/api/ml/predict/session/${TEST_SESSION_ID}`,
      { analyzeSession: true, limit: 29 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ Session analysis complete');
    console.log(`   Total Readings: ${sessionAnalysis.data.totalReadings}`);
    console.log(`   Valid Readings: ${sessionAnalysis.data.validReadings}`);
    console.log(`   Dominant State: ${sessionAnalysis.data.analysis.dominantState}`);
    console.log(`   Session Score: ${sessionAnalysis.data.analysis.sessionScore}/100`);
    
    console.log(`\n   State Distribution:`);
    Object.entries(sessionAnalysis.data.analysis.statePercentages).forEach(([state, percent]) => {
      const bar = '█'.repeat(Math.round(percent / 5));
      console.log(`      ${state.padEnd(12)}: ${percent.toFixed(1)}% ${bar}`);
    });

    console.log(`\n   📋 Recommendations:`);
    sessionAnalysis.data.analysis.recommendations.forEach((rec, i) => {
      console.log(`      ${i + 1}. ${rec}`);
    });

    // ==================== TEST 8: Model Info ====================
    console.log('\n📝 TEST 8: ML Model Information');
    console.log('─'.repeat(70));
    
    const modelInfo = await axios.get(`${BACKEND_URL}/api/ml/model-info`);
    
    console.log('✅ Model information retrieved');
    console.log(`   Model Type: ${modelInfo.data.modelInfo.model_type}`);
    console.log(`   Accuracy: ${(modelInfo.data.modelInfo.accuracy * 100).toFixed(2)}%`);
    console.log(`   States: ${modelInfo.data.modelInfo.states.join(', ')}`);
    console.log(`   Feature Engineering: ${modelInfo.data.modelInfo.feature_engineering}`);
    console.log(`   Trained At: ${new Date(modelInfo.data.modelInfo.trained_at).toLocaleString()}`);

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(70));
    console.log('\n📊 PIPELINE VERIFICATION:');
    console.log('   ✅ ML API Server (Port 8000) - Running');
    console.log('   ✅ Backend Server (Port 5000) - Running');
    console.log('   ✅ MongoDB Database - Connected');
    console.log('   ✅ User Authentication - Working');
    console.log('   ✅ Backend → ML Communication - Working');
    console.log('   ✅ Database → Predictions - Working');
    console.log('   ✅ Session Analysis - Working');
    console.log('   ✅ Recommendations Engine - Working');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Connect Arduino hardware to collect real sensor data');
    console.log('   2. Start Frontend (npm start in frontend directory)');
    console.log('   3. View real-time predictions in dashboard');
    console.log('   4. Use Postman collection for API testing');
    
    console.log('\n📚 API ENDPOINTS AVAILABLE:');
    console.log('   POST /api/ml/predict/single - Manual prediction');
    console.log('   POST /api/ml/predict/session/:sessionId - Analyze session data');
    console.log('   GET  /api/ml/status - Check ML service status');
    console.log('   GET  /api/ml/model-info - Get model details');
    console.log('   GET  /api/ml/predictions/:sessionId - View saved predictions');
    
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('─'.repeat(70));
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`   Error: Connection refused`);
      console.error(`   Make sure both Backend (5000) and ML API (8000) are running`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    
    console.error('\n' + '='.repeat(70) + '\n');
    process.exit(1);
  }
}

// Run tests
runTests();
