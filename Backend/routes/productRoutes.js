const express = require('express');
const Joi = require('joi');
const productController = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { protect, restrictTo } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

const router = express.Router();

/**
 * Joi Validation Schema for creating a product
 */
const createProductSchema = Joi.object({
  title: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Product title cannot be empty',
    'any.required': 'Product title is required',
    'string.max': 'Product title cannot exceed 100 characters'
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'Product description cannot be empty',
    'any.required': 'Product description is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Product price must be a number',
    'number.min': 'Product price must be greater than or equal to 0',
    'any.required': 'Product price is required'
  }),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Product category must be a valid MongoDB ObjectId hex string',
    'any.required': 'Product category is required'
  }),
  images: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
    'array.min': 'At least one product image path is required',
    'any.required': 'Product images are required'
  }),
  sizes: Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'OS')).optional(),
  colors: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required().messages({
        'string.empty': 'Color name cannot be empty'
      }),
      value: Joi.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required().messages({
        'string.pattern.base': 'Color value must be a valid hex color string (e.g. #FFFFFF)'
      })
    })
  ).optional(),
  stock: Joi.number().integer().min(0).default(0),
  featured: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5).default(0),
  reviewsCount: Joi.number().integer().min(0).default(0)
});

/**
 * Joi Validation Schema for updating a product
 */
const updateProductSchema = Joi.object({
  title: Joi.string().trim().max(100).optional(),
  description: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
    'string.pattern.base': 'Product category must be a valid MongoDB ObjectId hex string'
  }),
  images: Joi.array().items(Joi.string().trim().required()).min(1).optional(),
  sizes: Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'OS')).optional(),
  colors: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      value: Joi.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required().messages({
        'string.pattern.base': 'Color value must be a valid hex color string (e.g. #FFFFFF)'
      })
    })
  ).optional(),
  stock: Joi.number().integer().min(0).optional(),
  featured: Joi.boolean().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  reviewsCount: Joi.number().integer().min(0).optional()
});

// Route mapping
router.route('/')
  .post(
    protect,
    restrictTo('admin'),
    upload.array('images', 5),
    productController.uploadProductImages,
    validate(createProductSchema),
    productController.createProduct
  )
  .get(productController.getAllProducts);

router.route('/featured')
  .get(productController.aliasFeaturedProducts, productController.getAllProducts);

router.route('/latest')
  .get(productController.aliasLatestProducts, productController.getAllProducts);

router.route('/slug/:slug')
  .get(productController.getProductBySlug);

const categoryController = require('../controllers/categoryController');

router.route('/categories')
  .get(categoryController.getAllCategories);

router.route('/:id')
  .get(productController.getProductById)
  .patch(
    protect,
    restrictTo('admin'),
    upload.array('images', 5),
    productController.uploadProductImages,
    validate(updateProductSchema),
    productController.updateProduct
  )
  .delete(protect, restrictTo('admin'), productController.deleteProduct);

module.exports = router;
