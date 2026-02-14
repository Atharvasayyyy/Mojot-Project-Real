#!/usr/bin/env node

const http = require('http');

// First register a student and get token
const registerData = JSON.stringify({
  firstName: 'TestSession',
  lastName: 'User',
  email: `session-test-${Date.now()}@example.com`,
  password: 'Test@1234',
  userType: 'student',
  grade: '10'
});

console.log('🔄 Step 1: Registering student...\n');

const registerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const registerReq = http.request(registerOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.success) {
        const token = response.token;
        console.log('✅ Student registered successfully');
        console.log('📧 Email:', response.user.email);
        console.log('👤 User ID:', response.user._id);

        // Now create a session
        console.log('\n🔄 Step 2: Creating session...\n');
        createSession(token);
      } else {
        console.error('❌ Registration failed:', response.message);
      }
    } catch (e) {
      console.error('❌ Error:', e.message);
    }
  });
});

registerReq.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  process.exit(1);
});

registerReq.write(registerData);
registerReq.end();

function createSession(token) {
  const sessionData = JSON.stringify({
    deviceId: 'device001',
    activity: 'reading',
    sessionType: 'classroom',
    sessionName: 'Reading Session'
  });

  const sessionOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/sessions/start',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(sessionData)
    }
  };

  const sessionReq = http.request(sessionOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📦 Response Status:', res.statusCode);
      
      try {
        const response = JSON.parse(data);
        
        if (response.success) {
          console.log('✅ Session created successfully!');
          console.log('📊 Session Details:');
          console.log('   - Session ID:', response.session._id);
          console.log('   - Activity:', response.session.activity);
          console.log('   - Session Type:', response.session.sessionType);
          console.log('   - Session Name:', response.session.sessionName);
          console.log('   - Start Time:', response.session.startTime);
          console.log('   - Is Active:', response.session.isActive);
          
          console.log('\n✅ ALL TESTS PASSED!');
          console.log('\n📝 Next steps in Postman:');
          console.log('   1. Copy Session ID from response');
          console.log('   2. Set SESSION_ID environment variable');
          console.log('   3. Record sensor data with POST /api/sensor-data');
          console.log('   4. Get predictions with POST /api/predictions');
          console.log('   5. End session with POST /api/sessions/{id}/end');
        } else {
          console.error('❌ Session creation failed');
          console.error('Message:', response.message);
        }
      } catch (e) {
        console.error('❌ Error parsing response:', e.message);
        console.error('Response:', data);
      }
    });
  });

  sessionReq.on('error', (error) => {
    console.error('❌ Session Request Error:', error.message);
    process.exit(1);
  });

  sessionReq.write(sessionData);
  sessionReq.end();
}
