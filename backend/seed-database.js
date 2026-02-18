/**
 * Data Seeding Script
 * Creates test user, session, and sensor data for testing
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const Session = require('./src/models/Session');
const SensorData = require('./src/models/SensorData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-engagement';

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting Database Seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // ==================== CREATE TEST USER ====================
    console.log('📝 Creating test user...');
    
    const existingUser = await User.findOne({ email: 'testuser@engage.dev' });
    let userId;

    if (existingUser) {
      console.log('ℹ️  User already exists, skipping...');
      userId = existingUser._id;
    } else {
      const user = new User({
        firstName: 'Test',
        lastName: 'Student',
        email: 'testuser@engage.dev',
        password: 'password123',
        userType: 'student',
        grade: '10',
        school: 'Test Academy'
      });

      const savedUser = await user.save();
      userId = savedUser._id;
      console.log(`✅ User created: ${savedUser._id}`);
    }

    // ==================== CREATE TEST SESSION ====================
    console.log('\n📋 Creating test session...');
    
    const session = new Session({
      userId,
      sessionName: 'ML Model Testing Session',
      description: 'Session for testing ML model predictions',
      sessionType: 'classroom',
      activity: 'coding',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      isActive: true,
      metrics: {
        totalDataPoints: 0,
        avgHeartRate: 0,
        avgEngagementScore: 0,
        avgStressLevel: 0
      }
    });

    const savedSession = await session.save();
    const sessionId = savedSession._id;
    console.log(`✅ Session created: ${sessionId}`);

    // ==================== INSERT SENSOR DATA ====================
    console.log('\n📊 Inserting sensor data...');

    // Test data scenarios
    const scenarios = [
      {
        name: 'Normal Engaged Student (10 data points)',
        count: 10,
        template: {
          heartRate: { value: () => 72 + Math.random() * 5, unit: 'bpm', confidence: 0.95 },
          hrv: { rmssd: () => 45 + Math.random() * 10, sdnn: () => 50 + Math.random() * 10, confidence: 0.90 },
          bloodOxygen: { value: () => 97 + Math.random() * 2, unit: '%', confidence: 0.90 },
          motionLevel: () => 5 + Math.random() * 3,
          restlessnessIndex: () => 0.08 + Math.random() * 0.04
        }
      },
      {
        name: 'Stressed Student (5 data points)',
        count: 5,
        template: {
          heartRate: { value: () => 105 + Math.random() * 10, unit: 'bpm', confidence: 0.95 },
          hrv: { rmssd: () => 18 + Math.random() * 8, sdnn: () => 20 + Math.random() * 8, confidence: 0.90 },
          bloodOxygen: { value: () => 94 + Math.random() * 2, unit: '%', confidence: 0.90 },
          motionLevel: () => 12 + Math.random() * 5,
          restlessnessIndex: () => 0.45 + Math.random() * 0.15
        }
      },
      {
        name: 'Disengaged/Relaxed Student (8 data points)',
        count: 8,
        template: {
          heartRate: { value: () => 58 + Math.random() * 5, unit: 'bpm', confidence: 0.95 },
          hrv: { rmssd: () => 62 + Math.random() * 10, sdnn: () => 65 + Math.random() * 10, confidence: 0.90 },
          bloodOxygen: { value: () => 98 + Math.random() * 1, unit: '%', confidence: 0.90 },
          motionLevel: () => 1 + Math.random() * 2,
          restlessnessIndex: () => 0.02 + Math.random() * 0.02
        }
      },
      {
        name: 'Hyperactive Student (6 data points)',
        count: 6,
        template: {
          heartRate: { value: () => 95 + Math.random() * 10, unit: 'bpm', confidence: 0.95 },
          hrv: { rmssd: () => 35 + Math.random() * 8, sdnn: () => 40 + Math.random() * 8, confidence: 0.90 },
          bloodOxygen: { value: () => 96 + Math.random() * 2, unit: '%', confidence: 0.90 },
          motionLevel: () => 45 + Math.random() * 10,
          restlessnessIndex: () => 2.1 + Math.random() * 0.5
        }
      }
    ];

    let totalDataPoints = 0;

    for (const scenario of scenarios) {
      console.log(`\n   📌 ${scenario.name}`);
      
      for (let i = 0; i < scenario.count; i++) {
        const sensorData = new SensorData({
          userId,
          deviceId: 'ARDUINO-TEST-001',
          sessionId,
          recordedAt: new Date(Date.now() - (scenario.count - i) * 5000), // Stagger timestamps
          heartRate: {
            value: scenario.template.heartRate.value(),
            unit: scenario.template.heartRate.unit,
            confidence: scenario.template.heartRate.confidence
          },
          hrv: {
            rmssd: scenario.template.hrv.rmssd(),
            sdnn: scenario.template.hrv.sdnn(),
            confidence: scenario.template.hrv.confidence
          },
          bloodOxygen: {
            value: scenario.template.bloodOxygen.value(),
            unit: scenario.template.bloodOxygen.unit,
            confidence: scenario.template.bloodOxygen.confidence
          },
          motionLevel: scenario.template.motionLevel(),
          restlessnessIndex: scenario.template.restlessnessIndex(),
          dataQuality: {
            signalStrength: 85 + Math.random() * 10,
            dataComplete: true,
            anomalyDetected: false
          }
        });

        await sensorData.save();
        totalDataPoints++;
      }
      
      console.log(`      ✅ Inserted ${scenario.count} sensor data points`);
    }

    // ==================== UPDATE SESSION METRICS ====================
    console.log('\n📈 Updating session metrics...');
    
    const allSensorData = await SensorData.find({ sessionId });
    
    if (allSensorData.length > 0) {
      const avgHeartRate = allSensorData.reduce((sum, d) => sum + d.heartRate.value, 0) / allSensorData.length;
      const avgHRV = allSensorData.reduce((sum, d) => sum + d.hrv.rmssd, 0) / allSensorData.length;
      const avgMotion = allSensorData.reduce((sum, d) => sum + d.motionLevel, 0) / allSensorData.length;
      const avgRestlessness = allSensorData.reduce((sum, d) => sum + d.restlessnessIndex, 0) / allSensorData.length;

      await Session.updateOne(
        { _id: sessionId },
        {
          'metrics.totalDataPoints': allSensorData.length,
          'metrics.avgHeartRate': avgHeartRate,
          'metrics.avgHRV': avgHRV
        }
      );

      console.log(`✅ Session metrics updated`);
      console.log(`   Total data points: ${allSensorData.length}`);
      console.log(`   Avg Heart Rate: ${avgHeartRate.toFixed(2)} bpm`);
      console.log(`   Avg HRV RMSSD: ${avgHRV.toFixed(2)} ms`);
      console.log(`   Avg Motion: ${avgMotion.toFixed(2)}`);
      console.log(`   Avg Restlessness: ${avgRestlessness.toFixed(3)}`);
    }

    // ==================== DISPLAY SUMMARY ====================
    console.log('\n' + '='.repeat(65));
    console.log('✅ DATABASE SEEDING COMPLETED!');
    console.log('='.repeat(65) + '\n');
    
    console.log('📊 CREATED DATA:');
    console.log(`   User ID:        ${userId}`);
    console.log(`   Session ID:     ${sessionId}`);
    console.log(`   Total Sensor Data Points: ${totalDataPoints}`);
    
    console.log('\n🧪 READY FOR TESTING:');
    console.log(`   Use Session ID in ML predictions: ${sessionId}`);
    console.log(`   Use User ID for queries: ${userId}`);
    
    console.log('\n📝 QUERIES TO TEST:\n');
    console.log('1. Get all sensor data for session:');
    console.log(`   GET /api/sensor-data/${sessionId}`);
    console.log('   (Add Authorization header with token)\n');
    
    console.log('2. Get session details:');
    console.log(`   GET /api/sessions/${sessionId}`);
    console.log('   (Add Authorization header with token)\n');
    
    console.log('3. Get user details:');
    console.log(`   GET /api/users/${userId}`);
    console.log('   (Add Authorization header with token)\n');

    console.log('\n🤖 ML MODEL TESTING:');
    console.log('   Use sensor data from database in ML predictions');
    console.log('   ML Model should recognize patterns and predict engagement/stress levels\n');

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    if (error.message.includes('Email already exists')) {
      console.log('\n💡 Tip: Email already exists. The script will use existing user.');
    }
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();
