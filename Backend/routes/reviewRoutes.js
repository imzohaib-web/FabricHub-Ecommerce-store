const express = require('express');
const Joi = require('joi');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a review.
 */
const createReviewSchema = Joi.object({
  productId: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid product ID format.',
    'any.required': 'Product ID is required.'
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number.',
    'number.min': 'Rating must be at least 1.',
    'number.max': 'Rating cannot exceed 5.',
    'any.required': 'Rating is required.'
  }),
  comment: Joi.string().trim().min(3).max(1000).required().messages({
    'string.min': 'Comment must contain at least 3 characters.',
    'string.max': 'Comment cannot exceed 1000 characters.',
    'any.required': 'Comment body is required.'
  })
});

// Public endpoints
router.get('/product/:productId', reviewController.getProductReviews);

// Protected endpoints
router.use(protect);

router.post('/', validate(createReviewSchema), reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
