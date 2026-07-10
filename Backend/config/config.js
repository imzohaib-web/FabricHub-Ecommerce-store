const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the .env file in the parent folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

// Ensure critical environment variables exist to fail fast during startup
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`CRITICAL CONFIG ERROR: Missing required environment variable ${envVar}`);
  }
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoose: {
    url: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationDays: process.env.JWT_EXPIRE || '7d',
  },
  google: {
    clientId: (process.env.GOOGLE_CLIENT_ID || '').trim(),
    clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
  }
};
