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
      const { getProductsCollection } = require('../config/database');
      const { ObjectId } = require('mongodb');
      
      const productsCollection = getProductsCollection();
      if (!productsCollection) {
        return null;
      }
      
      // Try multiple approaches to find the product
      let product = null;
      
      // Approach 1: Try to find by ObjectId (MongoDB format)
      if (ObjectId.isValid(id)) {
        product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (product) {
          return product;
        }
      }
      
      // Approach 2: Try to find by string ID in _id field
      product = await productsCollection.findOne({ _id: id });
      if (product) {
        return product;
      }
      
      // Approach 3: Try to find by id field (in case of fallback products structure)
      product = await productsCollection.findOne({ id: id });
      if (product) {
        return product;
      }
      
      // Approach 4: Try to convert string to ObjectId if it's a valid format
      try {
        const productByObjectId = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (productByObjectId) {
          return productByObjectId;
        }
      } catch (e) {
        // If ObjectId conversion fails, that's okay
      }
      
      return null;
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
    const { name, email, phone, address, city, state, zip, country, paymentMethod, cartItems: frontendCartItems } = req.body;
    
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
    let cartItems = cartManager.getCartItems();
    console.log("Cart items from backend storage:", cartItems);
    
    // Log additional debugging info
    console.log("Backend cart items count:", cartItems.length);
    if (cartItems.length > 0) {
      console.log("First backend cart item:", cartItems[0]);
    }
    
    // If backend cart is empty, check if frontend sent cart items
    if (cartItems.length === 0 && frontendCartItems && Array.isArray(frontendCartItems) && frontendCartItems.length > 0) {
      console.log("Backend cart is empty, using frontend cart items:", frontendCartItems);
      cartItems = frontendCartItems.map(item => ({
        id: item.id || item.productId,
        productId: item.productId,
        quantity: item.quantity
      }));
      console.log("Mapped frontend cart items:", cartItems);
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      console.log("Cart is empty, sending error response");
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    console.log("Processing cart items:", cartItems);
    
    // Calculate total
    let total = 0;
    const itemsWithProducts = [];
    
    for (const item of cartItems) {
      console.log("Processing cart item:", item);
      const product = await helpers.findProductById(item.productId);
      if (product) {
        console.log("Found product for cart item:", {
          productName: product.name,
          productPrice: product.price
        });
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        itemsWithProducts.push({
          product: product.name,
          quantity: item.quantity,
          price: product.price,
          total: parseFloat(itemTotal.toFixed(2))
        });
      } else {
        console.log("Product not found for cart item:", item);
      }
    }
    
    console.log("Items with products:", itemsWithProducts);
    console.log("Total calculated:", total);

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