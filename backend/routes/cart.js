const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');

const router = express.Router();

/**
 * @route GET /api/cart
 * @desc Get cart items and total
 * @access Public
 */
router.get('/', getCart);

/**
 * @route POST /api/cart
 * @desc Add item to cart
 * @access Public
 */
router.post('/', addToCart);

/**
 * @route PUT /api/cart/:id
 * @desc Update item quantity
 * @access Public
 */
router.put('/:id', updateCartItem);

/**
 * @route DELETE /api/cart/:id
 * @desc Remove item from cart
 * @access Public
 */
router.delete('/:id', removeFromCart);

module.exports = router;