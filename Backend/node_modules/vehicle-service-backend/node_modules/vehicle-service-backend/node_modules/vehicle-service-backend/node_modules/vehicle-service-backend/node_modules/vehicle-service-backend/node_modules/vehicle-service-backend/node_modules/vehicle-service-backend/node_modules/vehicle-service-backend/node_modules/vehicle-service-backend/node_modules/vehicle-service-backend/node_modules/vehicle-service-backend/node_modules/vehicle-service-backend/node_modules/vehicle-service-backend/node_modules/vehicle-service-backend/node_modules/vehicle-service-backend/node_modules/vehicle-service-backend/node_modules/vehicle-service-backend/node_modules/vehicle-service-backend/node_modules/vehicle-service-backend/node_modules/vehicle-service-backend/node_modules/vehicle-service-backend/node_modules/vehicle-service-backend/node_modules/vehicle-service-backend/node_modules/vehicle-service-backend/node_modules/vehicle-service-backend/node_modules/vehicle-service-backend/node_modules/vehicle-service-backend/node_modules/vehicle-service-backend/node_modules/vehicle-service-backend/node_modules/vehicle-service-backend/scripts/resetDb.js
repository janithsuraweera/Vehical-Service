const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Drop the users collection
      await mongoose.connection.collection('users').drop();
      console.log('Users collection dropped successfully');
      
      // Create a new admin user
      const User = require('../models/User');
      const bcrypt = require('bcryptjs');
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '1234567890',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
      
      console.log('Database reset completed');
      process.exit(0);
    } catch (error) {
      console.error('Error resetting database:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 