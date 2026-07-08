const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Authentication middleware that protects routes.
 * Ensures the request has a valid, unexpired JWT in headers or cookies.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Retrieve token from Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2) Verify if token is present
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to gain access.', 401)
    );
  }

  // 3) Verify JWT signature and expiration
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4) Check if the user still exists in the database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this session no longer exists.', 401)
    );
  }

  // 5) Grant access: store user on request object
  req.user = currentUser;
  next();
});

/**
 * Authorization middleware to restrict route access by role.
 * @param {...string} roles - Permitted user roles (e.g. 'admin', 'user').
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};
