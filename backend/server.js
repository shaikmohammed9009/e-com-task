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

// Configure CORS to allow requests from any origin (for development and testing)
// In production, you might want to restrict this to specific domains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost requests (development)
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    // Allow requests from any vercel.app domain (for flexibility with deployments)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific domains
    const allowedOrigins = [
      'https://e-com-task-5m86m6cw3-shaikmohammed9009-gmailcoms-projects.vercel.app',
      'https://e-com-task-othl.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Block other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Health check endpoint with CORS headers explicitly set
app.get('/api/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    origin: req.get('Origin') || 'No Origin Header'
  });
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