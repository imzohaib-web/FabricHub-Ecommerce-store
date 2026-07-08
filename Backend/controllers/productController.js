const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middlewares/upload');

/**
 * Create a new product
 * POST /api/v1/products
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

/**
 * Get all products (with advanced filtering, searching, sorting, and pagination)
 * GET /api/v1/products
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  // 1. Build Query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced Filtering (price ranges etc: { price: { gte: 50 } } -> { price: { $gte: 50 } })
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let filter = JSON.parse(queryStr);

  // Partial Text Search matching title or description (regex case-insensitive)
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Filter by size array if provided (e.g. sizes=S,M)
  if (req.query.sizes) {
    filter.sizes = { $in: req.query.sizes.split(',') };
  }

  // Filter by color name list if provided (e.g. colors=Red,Blue)
  if (req.query.colors) {
    filter['colors.name'] = { $in: req.query.colors.split(',') };
  }

  let query = Product.find(filter).populate('category');

  // 2. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sort: newest first
    query = query.sort('-createdAt');
  }

  // 3. Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    // Exclude internal mongoose version key by default
    query = query.select('-__v');
  }

  // 4. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const products = await query;
  
  // Total document count matching filters (for frontend pagination UI)
  const totalCount = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    totalResults: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
    data: {
      products
    }
  });
});

/**
 * Get product by ID
 * GET /api/v1/products/:id
 */
exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Get product by unique URL slug
 * GET /api/v1/products/slug/:slug
 */
exports.getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');

  if (!product) {
    return next(new AppError('No product found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Update a product
 * PATCH /api/v1/products/:id
 */
/**
 * Middleware to upload product images to Cloudinary.
 * Streams buffers directly.
 */
exports.uploadProductImages = catchAsync(async (req, res, next) => {
  // If no files are attached, proceed
  if (!req.files || req.files.length === 0) return next();

  // Stream upload all images in parallel
  const urls = await Promise.all(
    req.files.map(file => uploadToCloudinary(file.buffer, 'products'))
  );

  // Store lists in req.body so they pass Joi validations
  req.body.images = urls;
  next();
});

/**
 * Update a product
 * PATCH /api/v1/products/:id
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  // Retrieve product first to run pre-save hooks (for title -> slug transformation)
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // If new images are uploaded, delete the ones that are no longer part of the product gallery to free up space
  if (req.body.images && product.images && product.images.length > 0) {
    const imagesToDelete = product.images.filter(img => !req.body.images.includes(img));
    await Promise.all(imagesToDelete.map(url => deleteFromCloudinary(url)));
  }

  // Assign updated fields to the product document instance
  Object.assign(product, req.body);
  await product.save();

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Delete a product
 * DELETE /api/v1/products/:id
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Delete all associated images from Cloudinary before deleting product from MongoDB
  if (product.images && product.images.length > 0) {
    await Promise.all(product.images.map(url => deleteFromCloudinary(url)));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Alias middleware to pre-filter for featured products
 */
exports.aliasFeaturedProducts = (req, res, next) => {
  const newQuery = Object.assign({}, req.query, { featured: 'true' });
  Object.defineProperty(req, 'query', {
    value: newQuery,
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
};

/**
 * Alias middleware to pre-sort and limit for latest products
 */
exports.aliasLatestProducts = (req, res, next) => {
  const newQuery = Object.assign({}, req.query, {
    sort: '-createdAt',
    limit: req.query.limit || '8'
  });
  Object.defineProperty(req, 'query', {
    value: newQuery,
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
};

