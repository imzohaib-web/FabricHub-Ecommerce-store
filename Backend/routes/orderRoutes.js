const express = require('express');
const Joi = require('joi');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Joi validation schema for creating a new order (Checkout).
 */
const createOrderSchema = Joi.object({
  customerName: Joi.string().trim().required().messages({
    'any.required': 'Customer name is required.'
  }),
  customerEmail: Joi.string().trim().email().required().messages({
    'any.required': 'Customer email is required.',
    'string.email': 'Please provide a valid email address.'
  }),
  shippingDetails: Joi.object({
    address: Joi.string().trim().required().messages({
      'any.required': 'Shipping address is required.'
    }),
    city: Joi.string().trim().required().messages({
      'any.required': 'Shipping city is required.'
    }),
    postal: Joi.string().trim().required().messages({
      'any.required': 'Postal code is required.'
    })
  }).required()
});

/**
 * Joi validation schema for updating order status (Admin).
 */
const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').optional().messages({
    'any.only': 'Invalid order status. Permitted: Pending, Processing, Shipped, Delivered, Cancelled.'
  }),
  paymentStatus: Joi.string().valid('Unpaid', 'Paid').optional().messages({
    'any.only': 'Invalid payment status. Permitted: Unpaid, Paid.'
  })
});

// Protect all order routes
router.use(protect);

// Customer endpoints
router.post('/', validate(createOrderSchema), orderController.createOrder); // Checkout
router.get('/my-orders', orderController.getMyOrders); // Order history
router.get('/:id', orderController.getOrder); // Get single order details (owner or admin check)

// Admin-only endpoints
router.get('/', restrictTo('admin'), orderController.getAllOrders); // Fetch all platform orders
router.patch('/:id/status', restrictTo('admin'), validate(updateOrderStatusSchema), orderController.updateOrderStatus); // Update status

module.exports = router;
