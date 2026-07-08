const mongoose = require('mongoose');
const slugify = require('slugify');
require('./Category');

/**
 * Color sub-schema for options
 */
const colorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Color name is required'] 
  },
  value: { 
    type: String, 
    required: [true, 'Color hex value is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code']
  }
}, { _id: false });

/**
 * Main Product schema
 */
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Product title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Product price must be a non-negative number']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category'],
    index: true
  },
  images: {
    type: [String],
    required: [true, 'A product must have at least one image'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Product must have at least one image'
    }
  },
  sizes: {
    type: [String],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'OS'],
      message: 'Size must be one of: XS, S, M, L, XL, OS'
    },
    default: []
  },
  colors: {
    type: [colorSchema],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'A product must have a stock quantity'],
    min: [0, 'Product stock cannot be negative'],
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviewsCount: {
    type: Number,
    min: [0, 'Reviews count cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for optimal category-price filtering
productSchema.index({ category: 1, price: 1 });

// Text index to enable full-text searches on title and description fields
productSchema.index({ title: 'text', description: 'text' });

// Auto-derive URL slug from title and update inStock status before saving
productSchema.pre('save', function() {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('stock')) {
    this.inStock = this.stock > 0;
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
