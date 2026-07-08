const express = require('express');
const Joi = require('joi');
const categoryController = require('../controllers/categoryController');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Joi Validation Schema for category creation
 */
const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    'string.empty': 'Category name cannot be empty',
    'any.required': 'Category name is required',
    'string.max': 'Category name cannot exceed 50 characters'
  }),
  image: Joi.string().trim().required().messages({
    'string.empty': 'Category image path/URL cannot be empty',
    'any.required': 'Category image path/URL is required'
  }),
  description: Joi.string().trim().allow('').optional()
});

/**
 * Joi Validation Schema for category updates
 */
const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).optional(),
  image: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('').optional()
});

// Route mapping
router.route('/')
  .post(validate(createCategorySchema), categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.route('/slug/:slug')
  .get(categoryController.getCategoryBySlug);

router.route('/:id')
  .get(categoryController.getCategoryById)
  .patch(validate(updateCategorySchema), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
