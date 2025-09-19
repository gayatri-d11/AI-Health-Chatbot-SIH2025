const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const admins = await User.find({ role: 'admin' });
    console.log('\n📋 Existing Admin Accounts:');
    
    if (admins.length === 0) {
      console.log('❌ No admin accounts found');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   ID: ${admin._id}`);
        console.log('');
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAdmins();