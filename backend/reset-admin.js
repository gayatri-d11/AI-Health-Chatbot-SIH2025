const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const result = await User.deleteMany({ role: 'admin' });
    console.log(`✅ Deleted ${result.deletedCount} admin account(s)`);
    console.log('🎯 You can now create a new admin account at /admin-setup');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetAdmin();