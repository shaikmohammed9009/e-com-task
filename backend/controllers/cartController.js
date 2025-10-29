const Cart = require('../models/Cart');
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
      const productsCollection = getProductsCollection();
      
      // First try to find by ObjectId (MongoDB format)
      if (ObjectId.isValid(id)) {
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (product) return product;
      }
      
      // If that fails, try to find by string ID (fallback for compatibility)
      const product = await productsCollection.findOne({ id: id });
      if (product) return product;
      
      // If both fail, try to find by _id as string
      const productByStringId = await productsCollection.findOne({ _id: id });
      return productByStringId;
    } catch (error) {
      console.error("Error finding product by ID:", error.message);
      return null;
    }
  }
};

/**
 * Get cart items with product details and total
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getCart(req, res) {
  try {
    const cartItems = cartManager.getCartItems();
    let total = 0;
    const itemsWithProducts = [];
    
    for (const item of cartItems) {
      const product = await helpers.findProductById(item.productId);
      if (product) {
        // Create a cart item object that matches the expected format
        const cartItemWithDetails = {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: product._id ? product._id.toString() : product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category
          },
          total: parseFloat((product.price * item.quantity).toFixed(2))
        };
        total += cartItemWithDetails.total;
        itemsWithProducts.push(cartItemWithDetails);
      }
    }
    
    res.json({
      items: itemsWithProducts,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Add item to cart or update quantity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    
    // Check if product exists
    const product = await helpers.findProductById(productId);
    if (!product) {
      console.log("Product not found for ID:", productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add to cart using cart manager
    const cartItem = cartManager.addToCart(productId, quantity);
    
    // Return the cart item with product details
    const cartItemWithProduct = {
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      product: {
        id: product._id ? product._id.toString() : product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category
      },
      total: parseFloat((product.price * cartItem.quantity).toFixed(2))
    };
    
    res.status(201).json(cartItemWithProduct);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(400).json({ message: 'Bad request' });
  }
}

/**
 * Update cart item quantity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateCartItem(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    // Validate input
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    
    // Update cart item using cart manager
    const cartItem = cartManager.updateCartItem(id, quantity);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Return updated cart item
    res.json({
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity
    });
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Remove item from cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function removeFromCart(req, res) {
  try {
    const { id } = req.params;
    
    // Remove from cart using cart manager
    const removed = cartManager.removeFromCart(id);
    
    if (!removed) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};