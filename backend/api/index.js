// Import the Express app
const app = require('../server');

// Export a Vercel-compatible handler function
module.exports = (req, res) => {
  // Pass the request to the Express app
  return app(req, res);
};