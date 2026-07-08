const Review = require('../models/Review');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Submit a product review.
 * Restricts submissions to verified buyers who have not reviewed the product yet.
 */
exports.createReview = catchAsync(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    return next(new AppError('Please provide product ID, rating, and comment text.', 400));
  }

  // 1. Verify that the user has actually purchased and received this product
  const purchaseRecord = await Order.findOne({
    user: req.user.id,
    status: 'Delivered',
    'items.product': productId
  });

  if (!purchaseRecord) {
    return next(new AppError('You can only review products from orders that have been successfully delivered.', 400));
  }

  // 2. Create the review. Compound unique index on schema handles single-review enforcement.
  const review = await Review.create({
    user: req.user.id,
    product: productId,
    rating,
    comment
  });

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

/**
 * Retrieve all reviews submitted for a specific product.
 */
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

/**
 * Delete a product review.
 * Restricts operations to the reviewer themselves or administrative accounts.
 */
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID.', 404));
  }

  // Authorize: Owner or Admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this review.', 403));
  }

  // Use findOneAndDelete to trigger Mongoose findOneAnd query middlewares
  await Review.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: 'success',
    message: 'Review successfully deleted.'
  });
});
