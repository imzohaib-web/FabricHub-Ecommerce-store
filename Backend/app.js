const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const authRouter = require('./routes/authRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) with support for credentials and specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Parse cookies from headers
app.use(cookieParser());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Host static assets (such as product images) uploaded to the server
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint to verify server is active and responding
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Mount Auth API routes
app.use('/api/v1/auth', authRouter);

// Mount Wishlist API routes
app.use('/api/v1/wishlist', wishlistRouter);

// Mount Cart API routes
app.use('/api/v1/cart', cartRouter);

// Mount Order API routes
app.use('/api/v1/orders', orderRouter);

// Mount Review API routes
app.use('/api/v1/reviews', reviewRouter);

// Mount User Management API routes
app.use('/api/v1/users', userRouter);

// Mount Admin Dashboard API routes
app.use('/api/v1/admin', adminRouter);

// Mount Product API routes
app.use('/api/v1/products', productRouter);

// Mount Category API routes (both standard and frontend compatibility endpoints)
app.use('/api/v1/categories', categoryRouter);

// Handle undefined routes (404 Page Not Found)
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found on this server`);
  error.statusCode = 404;
  error.status = 'fail';
  next(error);
});

// Centralized Global Error Handling Middleware
app.use(errorHandler);

module.exports = app;
