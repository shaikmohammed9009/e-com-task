const { ObjectId } = require('mongodb');

/**
 * Cart Model
 * Represents a shopping cart item
 */
class Cart {
  /**
   * Create a new cart item
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity of product
   */
  constructor(productId, quantity) {
    this.productId = productId;
    this.quantity = quantity;
  }

  /**
   * Convert cart item to API response format
   * @param {Object} cartItem - Cart item object
   * @returns {Object} Formatted cart item
   */
  static toResponseObject(cartItem) {
    return {
      id: cartItem._id.toString(),
      productId: cartItem.productId,
      quantity: cartItem.quantity
    };
  }

  /**
   * Convert cart item with product details to API response format
   * @param {Object} cartItem - Cart item object
   * @param {Object} product - Product object
   * @returns {Object} Formatted cart item with product details
   */
  static toDetailedResponseObject(cartItem, product) {
    const itemTotal = product.price * cartItem.quantity;
    return {
      id: cartItem._id.toString(),
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      product: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category
      },
      total: parseFloat(itemTotal.toFixed(2))
    };
  }
}

module.exports = Cart;