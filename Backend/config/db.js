const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI or MONGO_URI from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables. Please set MONGODB_URI or MONGO_URI in your .env file');
    }

    const conn = await mongoose.connect(mongoURI, {
      // These options are recommended for Mongoose 6+
      // Remove useNewUrlParser and useUnifiedTopology as they're no longer needed in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

