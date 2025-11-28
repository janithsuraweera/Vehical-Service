const mongoose = require('mongoose');

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Reuse existing connection in serverless environments
    if (cachedConnection && mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return cachedConnection;
    }

    // Use MONGODB_URI or MONGO_URI from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables. Please set MONGODB_URI or MONGO_URI in your .env file');
    }

    const conn = await mongoose.connect(mongoURI, {
      // These options are recommended for Mongoose 6+
      // Remove useNewUrlParser and useUnifiedTopology as they're no longer needed in Mongoose 6+
    });

    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in serverless environments
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

