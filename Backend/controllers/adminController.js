const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

/**
 * Retrieve database metrics and aggregates for the admin dashboard.
 */
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // 1. Fetch document counts across collections
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments({ role: 'user' });
  const ordersCount = await Order.countDocuments();
  const pendingOrdersCount = await Order.countDocuments({ status: 'Pending' });

  // 2. Aggregate gross sales (excluding cancelled orders)
  const salesStats = await Order.aggregate([
    {
      $match: { status: { $ne: 'Cancelled' } }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalAmount' }
      }
    }
  ]);

  const totalSales = salesStats.length > 0 ? salesStats[0].totalSales : 0;

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalSales,
        ordersCount,
        pendingOrdersCount,
        productsCount,
        usersCount
      }
    }
  });
});
