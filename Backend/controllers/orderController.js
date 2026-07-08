const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Generate a unique Order ID in the format FHxxxxxx (6 random digits).
 */
const generateUniqueOrderId = async () => {
  let orderId;
  let exists = true;
  while (exists) {
    orderId = 'FH' + Math.floor(100000 + Math.random() * 900000);
    const found = await Order.findOne({ orderId });
    if (!found) exists = false;
  }
  return orderId;
};

/**
 * Checkout: Create an Order from the user's current Cart.
 * Performs stock checks, decreases inventory levels, and clears the cart.
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { customerName, customerEmail, shippingDetails } = req.body;

  if (!customerName || !customerEmail || !shippingDetails) {
    return next(new AppError('Please provide customer details and shipping address.', 400));
  }

  // 1. Fetch user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty. Cannot place an order.', 400));
  }

  // 2. Perform Stock Validation for all items
  for (const item of cart.items) {
    if (!item.product) {
      return next(new AppError('One of the products in your cart is no longer available.', 400));
    }
    if (item.product.stock < item.quantity) {
      return next(
        new AppError(
          `Insufficient stock for "${item.product.title}". Requested: ${item.quantity}, Available: ${item.product.stock}.`,
          400
        )
      );
    }
  }

  // 3. Create items snapshot and compute total amount
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const itemPrice = item.product.price;
    const itemSubtotal = itemPrice * item.quantity;
    totalAmount += itemSubtotal;

    orderItems.push({
      product: item.product._id,
      quantity: item.quantity,
      price: itemPrice, // Historical snapshot price
      size: item.size,
      color: item.color
    });
  }

  // 4. Generate unique order ID
  const orderId = await generateUniqueOrderId();

  // 5. Create Order document
  const order = await Order.create({
    orderId,
    user: req.user.id,
    customerName,
    customerEmail,
    shippingDetails,
    items: orderItems,
    totalAmount,
    status: 'Pending',
    paymentStatus: 'Paid' // Simulated instant payment
  });

  // 6. Decrement Product Stock levels
  for (const item of cart.items) {
    const product = item.product;
    product.stock -= item.quantity;
    await product.save();
  }

  // 7. Clear User's Cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Retrieve the purchase history of the current logged-in user.
 */
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('items.product');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

/**
 * Retrieve details for a single Order.
 * Restricts access to the order owner or admin users.
 */
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    // Attempt lookup by orderId string (e.g. FH123456)
    const orderStr = await Order.findOne({ orderId: req.params.id }).populate('items.product');
    if (!orderStr) {
      return next(new AppError('No order found with that ID.', 404));
    }
    
    // Auth check for orderId lookup
    if (orderStr.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to view this order.', 403));
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        order: orderStr
      }
    });
  }

  // Auth check for _id lookup
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this order.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Admin: Get all orders across the platform.
 */
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('items.product');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

/**
 * Admin: Update the fulfillment or payment status of an order.
 * If status changes to 'Cancelled', corresponding product stocks are restored.
 */
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  const previousStatus = order.status;

  // 1. Perform cancellation stock restoration logic
  if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  // 2. Set new fields
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  await order.populate('items.product');

  res.status(200).json({
    status: 'success',
    message: 'Order updated successfully.',
    data: {
      order
    }
  });
});
