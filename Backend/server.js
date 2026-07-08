const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db');

// Handle uncaught exceptions globally (synchronous errors) to prevent silent failures
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  if (err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});

let server;

// Connect to the database first, then start listening to incoming network requests
connectDB()
  .then(() => {
    server = app.listen(config.port, () => {
      console.log(`Server is running in ${config.env} mode on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed. Server not started.', err);
    process.exit(1);
  });

// Handle unhandled promise rejections globally (asynchronous errors)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  if (err.stack) {
    console.error(err.stack);
  }

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on receiving termination signals (like Docker/Kubernetes/PM2 SIGTERM)
process.on('SIGTERM', () => {
  console.info('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed. Process terminated.');
    });
  }
});
