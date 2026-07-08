const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Minimal Category model schema to prevent MissingSchemaError on Product population.
 * Follows the layout specified in the database design.
 */
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'], 
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  image: { 
    type: String, 
    required: [true, 'Category image path is required'] 
  },
  description: { 
    type: String 
  }
}, {
  timestamps: true
});

// Auto-derive URL slug from name before saving
categorySchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Category', categorySchema);
