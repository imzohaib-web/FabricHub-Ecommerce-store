const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Email = require('../utils/email');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Sign an Access Token (15-minute expiration)
 */
const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

/**
 * Sign a Refresh Token (7-day expiration)
 */
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Helper to set cookies and send tokens in the response.
 */
const sendTokensResponse = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Save refresh token to user's list in the database (supports concurrency)
  // Fetch user with select('+refreshTokens') first, or update directly
  await User.findByIdAndUpdate(user._id, {
    $push: { refreshTokens: refreshToken }
  });

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || reqSecure(res),
    sameSite: 'strict'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from output JSON
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user
    }
  });
};

// Helper function to check if connection is secure
const reqSecure = (res) => {
  if (!res.req) return false;
  return res.req.secure || res.req.headers['x-forwarded-proto'] === 'https';
};

/**
 * Register a new user, send verification email, and login.
 */
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1) Create user
  const newUser = await User.create({
    name,
    email,
    password
  });

  // 2) Generate email verification token
  const verificationToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // 3) Send verification link via mock email utility
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  try {
    await new Email(newUser, verifyUrl).sendVerification();
  } catch (err) {
    // If email sending fails, clear verification details and continue (do not block user registration in dev)
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationExpires = undefined;
    await newUser.save({ validateBeforeSave: false });
    console.error('Email send failed during registration:', err.message);
  }

  // 4) Return JWT pair
  await sendTokensResponse(newUser, 201, res);
});

/**
 * Login user and issue tokens.
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2) Find user & explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // 3) Issue tokens
  await sendTokensResponse(user, 200, res);
});

/**
 * Refresh Access Token using Refresh Token Rotation.
 */
exports.refreshToken = catchAsync(async (req, res, next) => {
  let refreshToken = req.cookies ? req.cookies.refreshToken : null;

  // Fallback to body or authorization header if needed
  if (!refreshToken && req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    return next(new AppError('No refresh token provided.', 401));
  }

  // 1) Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }

  // 2) Find user with the refreshTokens array
  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 3) Check if refresh token is in user's token list
  const tokenIndex = user.refreshTokens.indexOf(refreshToken);
  if (tokenIndex === -1) {
    // SECURITY RISK: Token reuse. Invalidate all sessions for safety.
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    res.clearCookie('refreshToken');
    return next(new AppError('Refresh token compromised. All sessions revoked.', 401));
  }

  // 4) Rotate token: remove old one, generate new one
  user.refreshTokens.splice(tokenIndex, 1);
  
  const newAccessToken = signAccessToken(user._id);
  const newRefreshToken = signRefreshToken(user._id);
  
  user.refreshTokens.push(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  // 5) Set cookie and send response
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || reqSecure(res),
    sameSite: 'strict'
  };

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  res.status(200).json({
    status: 'success',
    accessToken: newAccessToken
  });
});

/**
 * Log out user by clearing the cookie and removing active refresh token.
 */
exports.logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (refreshToken) {
    // Remove the current refresh token from the database
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: refreshToken }
    });
  }

  // Clear cookie on client
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
});

/**
 * Verify user email via token.
 */
exports.verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Hash token from parameter
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Find user by token and verify expiry
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Verification link is invalid or has expired.', 400));
  }

  // 3) Mark user as verified
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Your email has been successfully verified! You may close this tab.'
  });
});

/**
 * Request password reset token.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Dispatch email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
  
  try {
    await new Email(user, resetUrl).sendPasswordReset();
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email address.'
    });
  } catch (err) {
    // Clean reset fields on failure
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

/**
 * Reset password using token.
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  // 1) Hash token parameter to find matching user
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Find user and ensure token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Password reset link is invalid or has expired.', 400));
  }

  // 3) Update password and clear reset attributes
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  // Also clear all existing sessions/refresh tokens to force re-auth everywhere on password change
  user.refreshTokens = [];
  
  await user.save(); // pre-save hook hashes password

  // 4) Log user in (send tokens response)
  await sendTokensResponse(user, 200, res);
});

/**
 * Get current user profile.
 */
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

/**
 * Get Google client ID config
 */
exports.getGoogleConfig = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : null
  });
});

/**
 * Handle Google sign in and registration
 */
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return next(new AppError('Google access token is required.', 400));
  }

  // 1) Verify Google access token and retrieve user info from Google APIs
  const googleUserRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!googleUserRes.ok) {
    return next(new AppError('Invalid Google access token.', 401));
  }

  const googleUser = await googleUserRes.json();
  const { email, name, email_verified } = googleUser;

  if (!email_verified) {
    return next(new AppError('Google account email is not verified.', 400));
  }

  // 2) Find user in database or create new user
  let user = await User.findOne({ email });

  if (!user) {
    // Generate secure random password for Google-signed up users
    const tempPassword = crypto.randomBytes(16).toString('hex');
    user = await User.create({
      name,
      email,
      password: tempPassword,
      isVerified: true
    });
  } else {
    // If user exists, ensure they are verified since they verified via Google
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }
  }

  // 3) Send tokens response
  await sendTokensResponse(user, 200, res);
});
