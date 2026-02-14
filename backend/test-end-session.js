const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testEndSession() {
  try {
    console.log('===== Testing Session Flow (Without deviceId) =====\n');

    // Step 1: Register
    console.log('📝 Step 1: Registering student...');
    const registerRes = await axios.post(`${BACKEND_URL}/api/auth/register`, {
      firstName: 'EndSessionTest',
      lastName: 'Student',
      email: `test-end-session-${Date.now()}@example.com`,
      password: 'Test@1234',
      userType: 'student',
      phone: '+919876543210',
      grade: '10'
    });

    const token = registerRes.data.token;
    const studentId = registerRes.data.user._id;
    console.log(`✅ Registered: ${registerRes.data.user.email}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   Student ID: ${studentId}\n`);

    // Step 2: Create Session (WITHOUT deviceId)
    console.log('📝 Step 2: Creating session WITHOUT deviceId...');
    const sessionRes = await axios.post(
      `${BACKEND_URL}/api/sessions/start`,
      {
        activity: 'reading',
        sessionType: 'classroom',
        sessionName: 'Test Session'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const sessionId = sessionRes.data.session._id;
    console.log(`✅ Session Created: ${sessionRes.status}`);
    console.log(`   Session ID: ${sessionId}`);
    console.log(`   Activity: ${sessionRes.data.session.activity}`);
    console.log(`   DeviceID: ${sessionRes.data.session.deviceId || 'NOT PROVIDED (OPTIONAL)'}}`);
    console.log(`   IsActive: ${sessionRes.data.session.isActive}\n`);

    // Step 3: End Session
    console.log('📝 Step 3: Ending session...');
    const endRes = await axios.post(
      `${BACKEND_URL}/api/sessions/end/${sessionId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log(`✅ Session Ended: ${endRes.status}`);
    console.log(`   IsActive: ${endRes.data.session.isActive}`);
    console.log(`   EndTime: ${endRes.data.session.endTime}`);
    console.log(`   Metrics:`, endRes.data.session.metrics);
    console.log(`\n✅ ALL TESTS PASSED!\n`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.status, error.response?.data || error.message);
    process.exit(1);
  }
}

testEndSession();
