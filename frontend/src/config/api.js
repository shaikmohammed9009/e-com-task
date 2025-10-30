// API Configuration
// Use environment variables or fallback to defaults
console.log('window.location.hostname:', window.location.hostname);
console.log('window.location.protocol:', window.location.protocol);

// For Vercel deployments, we can determine the backend URL based on the frontend URL
// Replace the frontend domain with the backend domain
const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For Vercel deployments, use the backend URL
  // If the frontend is at e-com-task-othl.vercel.app, 
  // the backend should be at e-com-task-one.vercel.app
  if (window.location.hostname.includes('e-com-task-othl.vercel.app')) {
    return 'https://e-com-task-one.vercel.app';
  }
  
  // Fallback to environment variable or the same domain
  return import.meta.env.VITE_API_URL || `https://${window.location.hostname}`;
};

export const API_BASE_URL = getBackendUrl();

console.log('API_BASE_URL:', API_BASE_URL);

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  CHECKOUT: `${API_BASE_URL}/api/checkout`
};

console.log('API_ENDPOINTS.CART:', API_ENDPOINTS.CART);