const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const config = {
  username: process.env.DB_USERNAME || 'shaik9009',
  password: encodeURIComponent(process.env.DB_PASSWORD || 'shaik9009'),
  cluster: process.env.DB_CLUSTER || 'cluster0.2bjejjw.mongodb.net',
  dbName: process.env.DB_NAME || 'MyApiOFProduct'
};

// Build MongoDB connection URI
const uri = `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.dbName}?retryWrites=true&w=majority`;

// MongoDB client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database collections
let db;
let productsCollection;
let cartCollection;

/**
 * Connect to MongoDB database
 * @returns {Promise<Object>} Database connection objects
 */
async function connectDB() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("URI:", uri.replace(process.env.DB_PASSWORD, '****')); // Hide password in logs
    
    await client.connect();
    console.log("✓ Connected to MongoDB");
    
    // Initialize database and collections
    db = client.db(config.dbName);
    productsCollection = db.collection('products');
    cartCollection = db.collection('cart');
    
    return { db, productsCollection, cartCollection };
  } catch (error) {
    console.error("✗ Error connecting to MongoDB:", error.message);
    console.error("Error code:", error.code);
    console.error("Error name:", error.name);
    throw error;
  }
}

/**
 * Initialize default products if collection is empty
 * @param {Collection} collection - Products collection
 */
async function initializeDefaultProducts(collection) {
  try {
    const productCount = await collection.countDocuments();
    if (productCount === 0) {
      const defaultProducts = [
        {
          name: 'Wireless Headphones',
          price: 99.99,
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
          category: 'Electronics'
        },
        {
          name: 'Smart Watch',
          price: 199.99,
          description: 'Feature-rich smartwatch with health monitoring',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
          category: 'Electronics'
        },
        {
          name: 'Bluetooth Speaker',
          price: 79.99,
          description: 'Portable Bluetooth speaker with excellent sound',
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&h=600',
          category: 'Electronics'
        },
        {
          name: 'Gaming Mouse',
          price: 49.99,
          description: 'Ergonomic gaming mouse with customizable buttons',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&h=600',
          category: 'Accessories'
        },
        {
          name: 'Mechanical Keyboard',
          price: 129.99,
          description: 'RGB mechanical keyboard with tactile switches',
          image: 'https://images.unsplash.com/photo-1595225476202-1e6433f609d5?auto=format&fit=crop&w=600&h=600',
          category: 'Accessories'
        },
        {
          name: 'USB-C Hub',
          price: 39.99,
          description: 'Multi-port USB-C hub for laptops',
          image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&h=600',
          category: 'Accessories'
        },
        {
          name: 'Wireless Charger',
          price: 29.99,
          description: 'Fast wireless charging pad for all devices',
          image: 'https://images.unsplash.com/photo-1606220588911-4a0f7f8e0d3f?auto=format&fit=crop&w=600&h=600',
          category: 'Accessories'
        },
        {
          name: 'Noise Cancelling Earbuds',
          price: 149.99,
          description: 'True wireless earbuds with active noise cancellation',
          image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&h=600',
          category: 'Electronics'
        }
      ];

      await collection.insertMany(defaultProducts);
      console.log("✓ Initialized default products");
    }
  } catch (error) {
    console.error("✗ Error initializing default products:", error.message);
  }
}

module.exports = {
  connectDB,
  initializeDefaultProducts,
  getClient: () => client,
  getDB: () => db,
  getProductsCollection: () => productsCollection,
  getCartCollection: () => cartCollection
};