const mongoose = require('mongoose');

/**
 * Wishlist Mongoose Schema
 * Maps a single user to a list of product references.
 */
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A wishlist must belong to a user.'],
    unique: true,
    index: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
