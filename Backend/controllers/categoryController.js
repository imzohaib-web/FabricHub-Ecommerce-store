const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Create a new category
 * POST /api/v1/categories
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory
    }
  });
});

/**
 * Get all categories
 * GET /api/v1/categories
 */
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

/**
 * Get single category by ID
 * GET /api/v1/categories/:id
 */
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Get single category by slug
 * GET /api/v1/categories/slug/:slug
 */
exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new AppError('No category found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Update category details
 * PATCH /api/v1/categories/:id
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Assign updated fields to document and save (which triggers pre-save slug hooks)
  Object.assign(category, req.body);
  await category.save();

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Delete category (prevents deletion if products are linked)
 * DELETE /api/v1/categories/:id
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  // Check if any products are referencing this category to maintain database referential integrity
  const linkedProductsCount = await Product.countDocuments({ category: req.params.id });

  if (linkedProductsCount > 0) {
    return next(
      new AppError(
        `Cannot delete category. There are ${linkedProductsCount} product(s) associated with it. Please reassign or delete the products first.`,
        400
      )
    );
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
