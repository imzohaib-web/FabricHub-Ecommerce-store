const mongoose = require('mongoose');

const shippingDetailsSchema = new mongoose.Schema({
  address: { type: String, required: [true, 'Shipping address is required.'] },
  city: { type: String, required: [true, 'Shipping city is required.'] },
  postal: { type: String, required: [true, 'Postal code is required.'] }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Order item must refer to a product.']
  },
  quantity: {
    type: Number,
    required: [true, 'Order item must specify quantity.'],
    min: [1, 'Quantity must be at least 1.']
  },
  price: {
    type: Number,
    required: [true, 'Order item must capture the historical snapshot price.']
  },
  size: {
    type: String,
    required: [true, 'Order item must specify a size.']
  },
  color: {
    name: { type: String },
    value: { type: String }
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^FH\d{6}$/, 'Order ID must follow the FHxxxxxx format.']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An order must belong to a user.'],
    index: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required.']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required.']
  },
  shippingDetails: {
    type: shippingDetailsSchema,
    required: [true, 'Shipping details are required.']
  },
  items: {
    type: [orderItemSchema],
    validate: [val => val.length > 0, 'Order must contain at least one item.']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Order total is required.']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      message: 'Status must be Pending, Processing, Shipped, Delivered, or Cancelled.'
    },
    default: 'Pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['Unpaid', 'Paid'],
      message: 'Payment status must be Unpaid or Paid.'
    },
    default: 'Paid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
