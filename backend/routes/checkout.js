const express = require('express');
const { processCheckout } = require('../controllers/checkoutController');

const router = express.Router();

/**
 * @route POST /api/checkout
 * @desc Process checkout
 * @access Public
 */
router.post('/', processCheckout);

module.exports = router;