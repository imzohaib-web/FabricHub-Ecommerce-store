const AppError = require('../utils/AppError');

/**
 * Express middleware to validate request body against a Joi schema.
 * Replaces req.body with validated/sanitized inputs, removing unknown properties.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // Return all validation errors, not just the first one
      allowUnknown: true, // Allow fields not defined in the schema (e.g. metadata)
      stripUnknown: true, // Strip out fields not defined in the schema for safety
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    // Assign sanitized/validated values back to req.body
    req.body = value;
    next();
  };
};

module.exports = validate;
