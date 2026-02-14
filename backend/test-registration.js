#!/usr/bin/env node

const http = require('http');

const postData = JSON.stringify({
  firstName: 'TestUser',
  lastName: 'Registration',
  email: `test-${Date.now()}@example.com`,
  password: 'Test@1234',
  userType: 'student',
  grade: '10'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📝 Testing Registration API...\n');
console.log('Request:', {
  url: `http://${options.hostname}:${options.port}${options.path}`,
  method: options.method,
  body: JSON.parse(postData)
});
console.log('\n⏳ Waiting for response...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📦 Response Status:', res.statusCode);
    console.log('📦 Response Headers:', res.headers);
    console.log('\n✅ Response Body:\n');
    
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        console.log('\n✅ SUCCESS! Registration works!');
        console.log('📊 Token:', parsed.token.substring(0, 50) + '...');
        console.log('👤 User ID:', parsed.user._id);
        console.log('📧 Email:', parsed.user.email);
      } else {
        console.log('\n❌ Registration failed');
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.error('\n🔍 Make sure:');
  console.error('  1. Backend is running on port 5000');
  console.error('  2. MongoDB is connected');
  process.exit(1);
});

req.write(postData);
req.end();
