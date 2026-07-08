const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Admin: Retrieve list of all registered users, sorted by registration date.
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * Admin: Retrieve single user profile details.
 */
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Admin: Update user registration details or access roles.
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  // Update fields if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) {
    if (!['user', 'admin'].includes(role)) {
      return next(new AppError('Invalid role value. Allowed: user, admin.', 400));
    }
    user.role = role;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: {
      user
    }
  });
});

/**
 * Admin: Terminate/Delete user accounts.
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User account successfully deleted.'
  });
});
