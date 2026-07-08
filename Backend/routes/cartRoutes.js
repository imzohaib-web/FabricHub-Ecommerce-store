const express = require('express');
const Joi = require('joi');
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Joi Hex string pattern checker
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Validation schema for adding items to cart.
 */
const addToCartSchema = Joi.object({
  productId: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid product ID format.',
    'any.required': 'Product ID is required.'
  }),
  quantity: Joi.number().integer().min(1).optional().default(1),
  size: Joi.string().required().messages({
    'any.required': 'Size is required.'
  }),
  color: Joi.object({
    name: Joi.string().optional(),
    value: Joi.string().optional()
  }).optional()
});

/**
 * Validation schema for updating item quantities.
 */
const updateCartItemSchema = Joi.object({
  productId: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid product ID format.',
    'any.required': 'Product ID is required.'
  }),
  size: Joi.string().required(),
  colorName: Joi.string().allow('').optional(),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'New quantity is required.',
    'number.min': 'Quantity must be at least 1.'
  })
});

/**
 * Validation schema for removing items.
 */
const removeFromCartSchema = Joi.object({
  productId: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid product ID format.',
    'any.required': 'Product ID is required.'
  }),
  size: Joi.string().required(),
  colorName: Joi.string().allow('').optional()
});

/**
 * Validation schema for merging guest carts.
 */
const mergeCartSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().regex(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid guest item product ID format.'
      }),
      quantity: Joi.number().integer().min(1).required(),
      size: Joi.string().required(),
      color: Joi.object({
        name: Joi.string().optional(),
        value: Joi.string().optional()
      }).optional()
    })
  ).required()
});

// Protect all cart routes
router.use(protect);

router.route('/')
  .get(cartController.getCart)
  .post(validate(addToCartSchema), cartController.addToCart)
  .delete(cartController.clearCart);

router.put('/item', validate(updateCartItemSchema), cartController.updateCartItem);
router.post('/item/remove', validate(removeFromCartSchema), cartController.removeFromCart); // using POST to easily support body parameters on delete actions
router.post('/merge', validate(mergeCartSchema), cartController.mergeCart);

module.exports = router;
