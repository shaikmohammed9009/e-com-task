const express = require('express');
const { getProducts } = require('../controllers/productController');

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get('/', getProducts);

module.exports = router;