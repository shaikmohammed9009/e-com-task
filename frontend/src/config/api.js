// API Configuration
// Use Vercel URL for production, fallback to localhost for development
export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000' 
  : 'https://e-com-task-othl.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  CHECKOUT: `${API_BASE_URL}/api/checkout`
};