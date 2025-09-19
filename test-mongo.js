const mongoose = require('mongoose');

// Test different connection strings
const connections = [
  process.env.MONGO_URL || 'mongodb://localhost:27017/healthbot',
  'mongodb://localhost:27017/healthbot'
];

// Load environment variables
require('dotenv').config();

async function testConnections() {
  for (let i = 0; i < connections.length; i++) {
    console.log(`\nTesting connection ${i + 1}:`);
    console.log(connections[i]);
    
    try {
      await mongoose.connect(connections[i], { 
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000 
      });
      console.log('✅ SUCCESS - MongoDB Connected!');
      console.log('Use this connection string in your .env file');
      await mongoose.disconnect();
      return connections[i];
    } catch (error) {
      console.log('❌ FAILED:', error.message);
      try {
        await mongoose.disconnect();
      } catch (e) {}
    }
  }
  
  console.log('\n❌ All connections failed. You need to:');
  console.log('1. Create new MongoDB Atlas account');
  console.log('2. Or install MongoDB locally');
  console.log('3. Or use the app without MongoDB (it will work with in-memory storage)');
}

testConnections();