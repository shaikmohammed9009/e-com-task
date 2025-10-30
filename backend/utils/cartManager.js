/**
 * Cart Manager
 * Manages the in-memory cart storage
 */

// In-memory cart storage
let cartItems = [];

const cartManager = {
  /**
   * Get all cart items
   * @returns {Array} Array of cart items
   */
  getCartItems: () => {
    return cartItems;
  },

  /**
   * Add item to cart or update quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity
   * @returns {Object} Cart item
   */
  addToCart: (productId, quantity) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity = parseInt(quantity);
      return existingItem;
    } else {
      // Create new cart item
      const newItem = {
        id: cartManager.generateId(),
        productId,
        quantity: parseInt(quantity)
      };
      cartItems.push(newItem);
      return newItem;
    }
  },

  /**
   * Update cart item quantity
   * @param {string} id - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Object|null} Updated cart item or null if not found
   */
  updateCartItem: (id, quantity) => {
    const cartItem = cartItems.find(item => item.id === id);
    
    if (cartItem) {
      cartItem.quantity = parseInt(quantity);
      return cartItem;
    }
    
    return null;
  },

  /**
   * Remove item from cart
   * @param {string} id - Cart item ID
   * @returns {boolean} True if item was removed, false if not found
   */
  removeFromCart: (id) => {
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.id !== id);
    return cartItems.length < initialLength;
  },

  /**
   * Clear cart
   */
  clearCart: () => {
    console.log("clearCart called, cart items before clearing:", cartItems);
    cartItems = [];
    console.log("clearCart completed, cart items after clearing:", cartItems);
  },

  /**
   * Get cart item by ID
   * @param {string} id - Cart item ID
   * @returns {Object|null} Cart item or null if not found
   */
  findCartItemById: (id) => {
    return cartItems.find(item => item.id === id);
  },

  /**
   * Get cart item by product ID
   * @param {string} productId - Product ID
   * @returns {Object|null} Cart item or null if not found
   */
  findCartItemByProductId: (productId) => {
    return cartItems.find(item => item.productId === productId);
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  }
};

module.exports = cartManager;