const Wishlist = require('../models/Wishlist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Retrieve the current logged-in user's wishlist.
 * Automatically creates an empty wishlist document if none exists.
 */
exports.getWishlist = catchAsync(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.status(200).json({
    status: 'success',
    data: {
      wishlist
    }
  });
});

/**
 * Add or remove a product from the user's wishlist (Toggles state).
 * Expects { productId } in req.body.
 */
exports.toggleWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new AppError('Please provide a product ID to toggle.', 400));
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  const index = wishlist.products.findIndex(id => id.toString() === productId.toString());
  let action;

  if (index > -1) {
    // Product already in wishlist, remove it
    wishlist.products.splice(index, 1);
    action = 'removed';
  } else {
    // Product not in wishlist, add it
    wishlist.products.push(productId);
    action = 'added';
  }

  await wishlist.save();

  // Populate products to return fully formed product detail arrays
  await wishlist.populate('products');

  res.status(200).json({
    status: 'success',
    message: `Product successfully ${action} from wishlist.`,
    action,
    data: {
      wishlist
    }
  });
});
