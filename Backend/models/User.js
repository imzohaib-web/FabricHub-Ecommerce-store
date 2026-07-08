const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * User schema definition mapping profile details and authorization rules.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
    select: false // Hides password field from query results by default
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin.'
    },
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  refreshTokens: {
    type: [String],
    select: false
  }
}, {
  timestamps: true
});

/**
 * Pre-save Mongoose hook to hash user password.
 * Only runs if the password field is modified.
 */
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  // Hash password with a cost factor of 12
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Instance method to verify if candidate password matches stored hash.
 */
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Instance method to generate and save a secure, hashed password reset token.
 * Returns the unhashed token (sent to the user via email).
 */
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store hashed version of token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Instance method to generate and save a secure, hashed email verification token.
 * Returns the unhashed token (sent to the user).
 */
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Store hashed version of token
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Token expires in 24 hours
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

module.exports = mongoose.model('User', userSchema);
