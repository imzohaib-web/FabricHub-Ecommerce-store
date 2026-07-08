const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connect to MongoDB database.
 * The connection uses the URI retrieved from validated configuration.
 */
const connectDB = async () => {
  const conn = await mongoose.connect(config.mongoose.url);
  console.log(`MongoDB Connected: ${conn.connection.host}`);

  // Register connection lifecycle event listeners for logging/observability
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

module.exports = connectDB;