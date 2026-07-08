/**
 * Custom Error Class representing operational errors (handled/expected issues).
 * Extends the native JavaScript Error class to include HTTP status codes.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Flag to mark the error as operational (trusted/handled client/server errors)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
