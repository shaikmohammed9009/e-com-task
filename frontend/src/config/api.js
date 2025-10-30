// API Configuration
// Use environment variables or fallback to defaults
console.log('window.location.hostname:', window.location.hostname);
console.log('window.location.protocol:', window.location.protocol);

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' 
    : 'https://e-com-task-othl.vercel.app');

console.log('API_BASE_URL:', API_BASE_URL);

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  CHECKOUT: `${API_BASE_URL}/api/checkout`
};

console.log('API_ENDPOINTS.CART:', API_ENDPOINTS.CART);