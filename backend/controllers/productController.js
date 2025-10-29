const Product = require('../models/Product');
const { getProductsCollection } = require('../config/database');

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getProducts(req, res) {
  try {
    const productsCollection = getProductsCollection();
    
    // Check if we have a valid MongoDB connection
    if (!productsCollection) {
      console.log("No MongoDB connection, using fallback products");
      // Fallback to in-memory products if MongoDB fails
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
      
      res.json(fallbackProducts);
      return;
    }
    
    console.log("Fetching products from MongoDB");
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products in MongoDB`);
    
    // Convert ObjectId to string for frontend
    const productsWithId = products.map(product => Product.toResponseObject(product));
    
    res.json(productsWithId);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    console.error("Error stack:", error.stack);
    
    // Fallback to in-memory products if MongoDB fails
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
    
    res.json(fallbackProducts);
  }
}

module.exports = {
  getProducts
};