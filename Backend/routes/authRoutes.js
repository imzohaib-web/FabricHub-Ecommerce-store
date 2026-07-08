const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Joi Validation Schema for registration input validation
 */
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name cannot be empty.',
    'any.required': 'Name is required.',
    'string.min': 'Name must be at least 2 characters.',
    'string.max': 'Name cannot exceed 50 characters.'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.',
    'string.email': 'Please provide a valid email address.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.'
  })
});

/**
 * Joi Validation Schema for login credentials
 */
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.',
    'string.email': 'Please provide a valid email address.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.'
  })
});

/**
 * Joi Validation Schema for requesting password reset links
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.',
    'string.email': 'Please provide a valid email address.'
  })
});

/**
 * Joi Validation Schema for setting new password
 */
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.'
  })
});

// Public Authentication endpoints
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes (require valid JWT)
router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
