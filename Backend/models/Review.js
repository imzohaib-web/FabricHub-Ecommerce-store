const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must refer to a product.']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1.0.'],
    max: [5, 'Rating cannot exceed 5.0.'],
    required: [true, 'Review must contain a rating.']
  },
  comment: {
    type: String,
    trim: true,
    minlength: [3, 'Comment must contain at least 3 characters.'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters.'],
    required: [true, 'Review must contain a comment.']
  }
}, {
  timestamps: true
});

// Enforce one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

/**
 * Static method to calculate rating average and count.
 * Updates matching Product in database catalog.
 */
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    // Round to 1 decimal place (e.g. 4.3)
    const roundedAvg = Math.round(stats[0].avgRating * 10) / 10;
    await Product.findByIdAndUpdate(productId, {
      rating: roundedAvg,
      reviewsCount: stats[0].nRating
    });
  } else {
    // Reset aggregates to initial state if all reviews are deleted
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewsCount: 0
    });
  }
};

// Recalculate average on new reviews
reviewSchema.post('save', function() {
  // 'this' points to the current review document
  this.constructor.calcAverageRatings(this.product);
});

// Recalculate average on review updates or deletions
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
