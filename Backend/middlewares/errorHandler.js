const AppError = require('../utils/AppError');

/**
 * Handles MongoDB CastError (invalid ObjectIds)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB Duplicate Key Error (e.g. unique field violations like duplicate email)
 */
const handleDuplicateFieldsDB = (err) => {
  // Attempt to extract the duplicate value from error message
  const errmsg = err.errmsg || '';
  const match = errmsg.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handles Mongoose schema validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles invalid JWT signature
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

/**
 * Handles expired JWTs
 */
const handleJWTExpiredError = () => {
  return new AppError('Your login session has expired. Please log in again.', 401);
};

/**
 * Detailed error response sent during development
 */
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Simplified clean error response sent during production
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send user-friendly message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: log it and send generic message
    console.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end.'
    });
  }
};

/**
 * Centralized Express Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Create a copy of the error and copy non-enumerable properties
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;
  error.path = err.path;
  error.value = err.value;
  error.errors = err.errors;
  error.errmsg = err.errmsg;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
