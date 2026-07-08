/**
 * Wrapper utility that catches rejected promises in asynchronous route handlers
 * and forwards them to the next() middleware (Express global error handler).
 * This eliminates the need for try-catch blocks in controller code.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
