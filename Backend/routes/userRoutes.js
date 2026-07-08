const express = require('express');
const Joi = require('joi');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * Joi validation schema for admin updating user accounts.
 */
const adminUpdateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().email().optional(),
  role: Joi.string().valid('user', 'admin').optional().messages({
    'any.only': 'Role must be user or admin.'
  })
});

// Restrict all user management endpoints to administrative accounts
router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .patch(validate(adminUpdateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
