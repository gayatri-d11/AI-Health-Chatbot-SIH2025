const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB connection...');
  console.log('Connection string:', process.env.MONGO_URL);
  
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Check if we can create a test document
    const TestSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', TestSchema);
    
    const testDoc = await TestModel.create({ test: 'MongoDB is working!' });
    console.log('✅ Test document created:', testDoc._id);
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

checkMongoDB();