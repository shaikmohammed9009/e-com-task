const { getProductsCollection } = require('../config/database');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'No Origin Header',
    // Add MongoDB connection status for debugging
    mongoDB: {
      username: process.env.DB_USERNAME || 'Not set',
      cluster: process.env.DB_CLUSTER || 'Not set',
      dbName: process.env.DB_NAME || 'Not set',
      password: process.env.DB_PASSWORD ? 'Set' : 'Not set'
    },
    vercel: process.env.VERCEL ? 'Yes' : 'No',
    nodeEnv: process.env.NODE_ENV || 'Not set'
  });
};