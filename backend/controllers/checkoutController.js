const { getProductsCollection } = require('../config/database');
const { ObjectId } = require('mongodb');
const cartManager = require('../utils/cartManager');

// Helper functions
const helpers = {
  /**
   * Find product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  findProductById: async (id) => {
    try {
      // Validate ObjectId format
      if (!ObjectId.isValid(id)) {
        return null;
      }
      
      const productsCollection = getProductsCollection();
      return await productsCollection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return null;
    }
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  }
};

/**
 * Process checkout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function processCheckout(req, res) {
  try {
    console.log("Received checkout request with body:", req.body);
    
    // Extract all possible fields from request body
    const { name, email, phone, address, city, state, zip, country, paymentMethod } = req.body;
    
    console.log("Extracted fields:", { name, email, phone, address, city, state, zip, country, paymentMethod });
    
    // Validate required input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate phone if provided (make it optional)
    if (phone && phone.trim() !== '') {
      // Remove any non-digit characters
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
      }
    }
    
    // Validate ZIP code if provided and not empty (make it optional)
    if (zip && zip.trim() !== '') {
      // Remove any non-digit characters
      const cleanZip = zip.replace(/\D/g, '');
      if (cleanZip.length !== 6) {
        return res.status(400).json({ message: 'ZIP code must be 6 digits' });
      }
    }
    
    // Get cart items from cart manager
    const cartItems = cartManager.getCartItems();
    console.log("Cart items before checkout:", cartItems);
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total
    let total = 0;
    const itemsWithProducts = [];
    
    for (const item of cartItems) {
      const product = await helpers.findProductById(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        itemsWithProducts.push({
          product: product.name,
          quantity: item.quantity,
          price: product.price,
          total: parseFloat(itemTotal.toFixed(2))
        });
      }
    }
    
    // Create mock receipt
    const receipt = {
      id: helpers.generateId(),
      name,
      email,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      country: country || '',
      paymentMethod: paymentMethod || 'card',
      items: itemsWithProducts,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString()
    };
    
    console.log("Generated receipt:", receipt);
    
    // Clear cart using cart manager
    console.log("Clearing cart...");
    cartManager.clearCart();
    console.log("Cart cleared. Current cart items:", cartManager.getCartItems());
    
    res.json(receipt);
  } catch (error) {
    console.error("Error processing checkout:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  processCheckout
};