const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

// Import database configuration
const { connectDB, initializeDefaultProducts, getProductsCollection } = require('./config/database');
const Product = require('./models/Product');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * Start the server and connect to database
 */
async function startServer() {
  try {
    // Log environment variables for debugging (remove in production)
    console.log("DB Configuration:");
    console.log("- Username:", process.env.DB_USERNAME);
    console.log("- Cluster:", process.env.DB_CLUSTER);
    console.log("- Database:", process.env.DB_NAME);
    
    // Connect to MongoDB
    const { productsCollection } = await connectDB();
    
    // Initialize default products
    await Product.initializeDefaultProducts(productsCollection);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("✗ Error starting server:", error.message);
    console.log("Continuing with application startup...");
    
    // Start server even if database connection fails
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} (database fallback active)`);
    });
  }
}

// Start the server
startServer();

module.exports = app;