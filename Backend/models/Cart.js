const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Cart item must have a product reference.']
  },
  quantity: {
    type: Number,
    required: [true, 'Cart item must have a quantity.'],
    min: [1, 'Quantity cannot be less than 1.'],
    default: 1
  },
  size: {
    type: String,
    required: [true, 'Cart item must have a size.']
  },
  color: {
    name: { type: String },
    value: { type: String }
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A cart must belong to a user.'],
    unique: true,
    index: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
