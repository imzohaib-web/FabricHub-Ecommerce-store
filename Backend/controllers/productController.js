const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../middlewares/upload');

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
  // 1. Parse JSON fields in req.body if they come from FormData as strings
  if (typeof req.body.sizes === 'string') {
    try {
      req.body.sizes = JSON.parse(req.body.sizes);
    } catch (e) {
      req.body.sizes = req.body.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (typeof req.body.colors === 'string') {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (e) {
      req.body.colors = [];
    }
  }
  if (typeof req.body.existingImages === 'string') {
    try {
      req.body.existingImages = JSON.parse(req.body.existingImages);
    } catch (e) {
      req.body.existingImages = [];
    }
  }
  if (typeof req.body.featured === 'string') {
    req.body.featured = req.body.featured === 'true';
  }
  if (typeof req.body.inStock === 'string') {
    req.body.inStock = req.body.inStock === 'true';
  }
  if (req.body.discountPrice === '') {
    delete req.body.discountPrice;
  }

  // 2. Identify if there are uploaded files
  const primaryFile = req.files && req.files.primaryImage ? req.files.primaryImage[0] : null;
  const additionalFiles = req.files && req.files.additionalImages ? req.files.additionalImages : [];

  // If no new files and no existing images are specified (not FormData/empty payload), proceed
  if (!primaryFile && additionalFiles.length === 0 && !req.body.existingImages) {
    return next();
  }

  let newPrimaryImage = null;
  let newAdditionalImages = [];

  try {
    // 3. Upload new primary image if provided
    if (primaryFile) {
      const url = await uploadToCloudinary(primaryFile.buffer, 'products');
      const publicId = getPublicIdFromUrl(url);
      newPrimaryImage = { url, publicId, isPrimary: true };
    }

    // 4. Upload new additional images if provided
    if (additionalFiles.length > 0) {
      newAdditionalImages = await Promise.all(
        additionalFiles.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, 'products');
          const publicId = getPublicIdFromUrl(url);
          return { url, publicId, isPrimary: false };
        })
      );
    }
  } catch (err) {
    return next(new AppError('Failed to upload image(s) to Cloudinary: ' + err.message, 500));
  }

  // 5. Combine existing images and new uploads
  let finalImages = [];
  const existingImages = req.body.existingImages || [];

  // Determine if it is a PATCH (update) operation
  if (req.params.id) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    // Identify images to delete from Cloudinary: those in product.images but not in existingImages
    if (product.images && product.images.length > 0) {
      const imagesToDelete = product.images.filter(
        (img) => !existingImages.some((existing) => existing.publicId === img.publicId)
      );
      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((img) => deleteFromCloudinary(img.url)));
      }
    }

    // If new primary image is uploaded, we replace the primary image
    if (newPrimaryImage) {
      finalImages.push(newPrimaryImage);
      // Ensure existing images are not marked as primary anymore
      existingImages.forEach(img => img.isPrimary = false);
    } else {
      // Otherwise, keep the existing primary image if it still exists
      const existingPrimary = existingImages.find((img) => img.isPrimary);
      if (existingPrimary) {
        finalImages.push(existingPrimary);
      }
    }

    // Add kept existing additional images
    const existingAdditionals = existingImages.filter((img) => !img.isPrimary);
    finalImages.push(...existingAdditionals);

    // Add new additional images
    finalImages.push(...newAdditionalImages);
  } else {
    // POST (create) operation
    if (newPrimaryImage) {
      finalImages.push(newPrimaryImage);
    }
    finalImages.push(...newAdditionalImages);
  }

  // Set the final list of images in req.body to pass Joi validation and save to DB
  req.body.images = finalImages;

  // Clean up existingImages field from req.body so Joi doesn't reject it
  delete req.body.existingImages;

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
    await Promise.all(product.images.map(img => deleteFromCloudinary(img.url)));
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

