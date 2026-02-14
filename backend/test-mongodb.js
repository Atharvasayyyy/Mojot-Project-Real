// MongoDB Connection Test Script
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
console.log('Attempting to connect...\n');

const startTime = Date.now();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 second timeout
  socketTimeoutMS: 45000,
})
  .then(() => {
    const duration = Date.now() - startTime;
    console.log('✅ SUCCESS! MongoDB Connected');
    console.log(`⏱️  Connection time: ${duration}ms`);
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.db.databaseName);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Ready State:', mongoose.connection.readyState);
    
    // Test a simple query
    mongoose.connection.db.admin().ping()
      .then(() => {
        console.log('\n✅ Ping successful!');
        process.exit(0);
      })
      .catch(err => {
        console.error('\n❌ Ping failed:', err.message);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('\n❌ CONNECTION FAILED!');
    console.error('Error Type:', err.name);
    console.error('Error Message:', err.message);
    console.error('\n🔧 Common Solutions:');
    console.error('   1. Whitelist your IP in MongoDB Atlas (0.0.0.0/0 for all IPs)');
    console.error('   2. Check username/password in connection string');
    console.error('   3. Verify cluster is running and not paused');
    console.error('   4. Check if firewall is blocking port 27017');
    console.error('   5. Try using a different network (mobile hotspot)');
    process.exit(1);
  });

// Handle timeout
setTimeout(() => {
  if (mongoose.connection.readyState !== 1) {
    console.error('\n❌ CONNECTION TIMEOUT after 10 seconds');
    console.error('\n🔧 This usually means:');
    console.error('   → Your IP is NOT whitelisted in MongoDB Atlas');
    console.error('   → Network/firewall is blocking MongoDB connections');
    console.error('\n👉 Solution: Go to MongoDB Atlas → Network Access → Add IP Address → Add 0.0.0.0/0');
    process.exit(1);
  }
}, 10000);
