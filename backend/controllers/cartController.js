const Cart = require('../models/Cart');
const { getProductsCollection } = require('../config/database');
const { ObjectId } = require('mongodb');
const cartManager = require('../utils/cartManager');

// Fallback products (same as in productController)
const fallbackProducts = [
  { 
    id: '1', 
    name: 'Wireless Headphones', 
    price: 99.99, 
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
    category: 'Electronics'
  },
  { 
    id: '2', 
    name: 'Smart Watch', 
    price: 199.99, 
    description: 'Feature-rich smartwatch with health monitoring',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
    category: 'Electronics'
  },
  { 
    id: '3', 
    name: 'Bluetooth Speaker', 
    price: 79.99, 
    description: 'Portable Bluetooth speaker with excellent sound',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&h=600',
    category: 'Electronics'
  },
  { 
    id: '4', 
    name: 'Gaming Mouse', 
    price: 49.99, 
    description: 'Ergonomic gaming mouse with customizable buttons',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&h=600',
    category: 'Accessories'
  },
  { 
    id: '5', 
    name: 'Mechanical Keyboard', 
    price: 129.99, 
    description: 'RGB mechanical keyboard with tactile switches',
    image: 'https://images.unsplash.com/photo-1595225476202-1e6433f609d5?auto=format&fit=crop&w=600&h=600',
    category: 'Accessories'
  },
  { 
    id: '6', 
    name: 'USB-C Hub', 
    price: 39.99, 
    description: 'Multi-port USB-C hub for laptops',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&h=600',
    category: 'Accessories'
  },
  { 
    id: '7', 
    name: 'Wireless Charger', 
    price: 29.99, 
    description: 'Fast wireless charging pad for all devices',
    image: 'https://images.unsplash.com/photo-1606220588911-4a0f7f8e0d3f?auto=format&fit=crop&w=600&h=600',
    category: 'Accessories'
  },
  { 
    id: '8', 
    name: 'Noise Cancelling Earbuds', 
    price: 149.99, 
    description: 'True wireless earbuds with active noise cancellation',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&h=600',
    category: 'Electronics'
  }
];

// Helper functions
const helpers = {
  /**
   * Find product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  findProductById: async (id) => {
    try {
      console.log("findProductById called with ID:", id);
      const productsCollection = getProductsCollection();
      
      // If no MongoDB connection, use fallback products
      if (!productsCollection) {
        console.log("No MongoDB connection, using fallback products for cart");
        const product = fallbackProducts.find(p => p.id === id);
        console.log("Fallback product found:", product);
        return product || null;
      }
      
      console.log("Searching for product in MongoDB");
      
      // When MongoDB is available, look for products by their _id field
      // First try to find by ObjectId (MongoDB format)
      if (ObjectId.isValid(id)) {
        console.log("Trying to find product by ObjectId:", id);
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (product) {
          console.log("Found product by ObjectId");
          return product;
        }
      }
      
      // If that fails, try to find by string ID (fallback for compatibility)
      // In MongoDB, we need to look for products by their _id field
      console.log("Trying to find product by string _id:", id);
      const product = await productsCollection.findOne({ _id: id });
      if (product) {
        console.log("Found product by string _id");
        return product;
      }
      
      // Also try to find by ObjectId if the id is a string representation
      try {
        console.log("Trying to find product by converting string to ObjectId:", id);
        const productByObjectId = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (productByObjectId) {
          console.log("Found product by converted ObjectId");
          return productByObjectId;
        }
      } catch (e) {
        // If ObjectId conversion fails, that's okay
        console.log("ObjectId conversion failed:", e.message);
      }
      
      console.log("Product not found in MongoDB");
      return null;
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
    
    // Log the request for debugging
    console.log("addToCart request:", { productId, quantity });
    console.log("Request origin:", req.get('Origin'));
    
    // Validate input
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    
    // Check if product exists
    const product = await helpers.findProductById(productId);
    if (!product) {
      console.log("Product not found for ID:", productId);
      // Log all available products for debugging
      try {
        const productsCollection = getProductsCollection();
        if (productsCollection) {
          const allProducts = await productsCollection.find({}).toArray();
          console.log("Available products in DB:", allProducts.map(p => ({
            id: p._id?.toString(),
            name: p.name
          })));
        } else {
          console.log("No MongoDB connection, fallback products would be used");
        }
      } catch (err) {
        console.log("Error fetching products for debugging:", err.message);
      }
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log("Found product:", {
      id: product._id ? product._id.toString() : product.id,
      name: product.name
    });
    
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