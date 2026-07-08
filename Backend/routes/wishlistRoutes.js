const express = require('express');
const Joi = require('joi');
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Joi validation schema for the toggle request payload.
 * Verifies that the productId is a valid MongoDB 24-character hexadecimal ObjectId.
 */
const toggleWishlistSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid product ID format.',
    'any.required': 'Product ID is required.'
  })
});

// Protect all routes in this router
router.use(protect);

// GET /api/v1/wishlist - Retrieve wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/v1/wishlist/toggle - Toggle wishlist item
router.post('/toggle', validate(toggleWishlistSchema), wishlistController.toggleWishlist);

module.exports = router;
