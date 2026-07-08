const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Helper to retrieve or create an active cart for a user.
 */
const getOrCreateUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * Retrieve user's cart populated with product details.
 */
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateUserCart(req.user.id);
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Add an item to the user's cart with stock validation.
 */
exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, size, color } = req.body;

  if (!productId || !size) {
    return next(new AppError('Please provide product ID and size.', 400));
  }

  const reqQty = quantity ? Number(quantity) : 1;

  // 1. Verify product exists and check stock limits
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  if (product.stock < reqQty) {
    return next(new AppError(`Only ${product.stock} items left in stock for this product.`, 400));
  }

  // 2. Fetch or create cart
  const cart = await getOrCreateUserCart(req.user.id);

  // 3. Check if matching item configuration exists in cart (same product, size, and color name)
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      (!color?.name || item.color?.name === color.name)
  );

  if (existingItem) {
    const newQty = existingItem.quantity + reqQty;
    if (product.stock < newQty) {
      return next(
        new AppError(
          `Cannot add more items. You already have ${existingItem.quantity} of this product in your cart, and the total exceeds available stock (${product.stock}).`,
          400
        )
      );
    }
    existingItem.quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      quantity: reqQty,
      size,
      color
    });
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Update the quantity of a specific item in the cart.
 */
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, size, colorName, quantity } = req.body;

  if (!productId || !size || quantity === undefined) {
    return next(new AppError('Please provide product ID, size, and new quantity.', 400));
  }

  const targetQty = Number(quantity);
  if (targetQty < 1) {
    return next(new AppError('Quantity must be at least 1.', 400));
  }

  // 1. Verify stock
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  if (product.stock < targetQty) {
    return next(new AppError(`Requested quantity exceeds available stock of ${product.stock}.`, 400));
  }

  // 2. Find cart and update the item
  const cart = await getOrCreateUserCart(req.user.id);
  const targetItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      (!colorName || item.color?.name === colorName)
  );

  if (!targetItem) {
    return next(new AppError('Item not found in your cart.', 404));
  }

  targetItem.quantity = targetQty;
  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Remove an item from the cart.
 */
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId, size, colorName } = req.body;

  if (!productId || !size) {
    return next(new AppError('Please provide product ID and size.', 400));
  }

  const cart = await getOrCreateUserCart(req.user.id);

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.size === size &&
        (!colorName || item.color?.name === colorName)
      )
  );

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Merge guest cart items into the user's database cart upon login.
 * If the sum of quantities exceeds product stock, it caps the item quantity to available stock.
 */
exports.mergeCart = catchAsync(async (req, res, next) => {
  const { items } = req.body; // Expects array of guest cart items: [{ id, quantity, size, color }]

  if (!items || !Array.isArray(items)) {
    return next(new AppError('Please provide an array of items to merge.', 400));
  }

  const cart = await getOrCreateUserCart(req.user.id);

  for (const guestItem of items) {
    const productId = guestItem.id;
    const size = guestItem.size;
    const color = guestItem.color;
    const qty = Number(guestItem.quantity);

    // Skip invalid entries
    if (!productId || !size || isNaN(qty) || qty < 1) continue;

    // Fetch product to validate stock limits
    const product = await Product.findById(productId);
    if (!product) continue; // Skip if product no longer exists in DB

    // Search for matching item in current DB cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        (!color?.name || item.color?.name === color.name)
    );

    if (existingItem) {
      // Merge quantities and cap to product stock limits
      existingItem.quantity = Math.min(existingItem.quantity + qty, product.stock);
    } else {
      // Add new item capped to product stock limits
      cart.items.push({
        product: productId,
        quantity: Math.min(qty, product.stock),
        size,
        color
      });
    }
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Empty all items from the user's cart.
 */
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateUserCart(req.user.id);
  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully.',
    data: {
      cart
    }
  });
});
