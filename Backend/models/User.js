const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Drop the existing index if it exists
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
    console.log('Dropped username index');
  } catch (error) {
    // Index might not exist, which is fine
    console.log('No username index to drop');
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
     // trim: true,
    // lowercase: true
  },
  password: {
    type: String,
    required: true,
        minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 