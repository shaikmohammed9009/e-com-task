import React, { useState } from 'react';
import './ProductList.css';
import { toast } from 'react-toastify';

const ProductList = ({ products, onAddToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [wishlisted, setWishlisted] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState(''); // Add search term state

  // Get unique categories
  const categories = ['All', ...new Set(products.map(product => product.category || 'Uncategorized'))];

  // Filter products by category and search term
  let filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Apply search filter (case-insensitive)
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // Keep original order for 'featured'
    }
  });

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const handleAddProductToCart = (product) => {
    console.log('handleAddProductToCart called with product:', product);
    const quantity = quantities[product.id] || 1;
    console.log('Quantity:', quantity);
    onAddToCart(product.id, quantity);
    
    // Show visual feedback
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const toggleWishlist = (productId) => {
    const newWishlistedState = !wishlisted[productId];
    setWishlisted(prev => ({
      ...prev,
      [productId]: newWishlistedState
    }));
    
    // Show toast notification
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.info(
        newWishlistedState 
          ? `${product.name} added to wishlist` 
          : `${product.name} removed from wishlist`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
      );
    }
  };

  return (
    <div className="product-list-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Amazon Style Collection</h1>
          <p className="hero-subtitle">Discover our wide selection of quality products with fast delivery and great prices</p>
          <button className="hero-button">Shop Now</button>
        </div>
      </div>

      <div className="product-list-header">
        <div className="header-content-wrapper">
          <h2 className="section-title">
            <span className="title-icon">🔥</span>
            Featured Products
          </h2>
          <p className="section-subtitle">Handpicked selection of premium items with exclusive deals and offers</p>
        </div>
      </div>
      
      {/* Filters and Sorting */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Add Search Input */}
          <div className="filter-group">
            <label htmlFor="search-filter">Search:</label>
            <input
              type="text"
              id="search-filter"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-select"
              style={{ padding: '8px 12px' }}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select 
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="products-grid">
        {sortedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={{...product, inStock: true}} // Force inStock to true
            quantity={quantities[product.id] || 1}
            isAddedToCart={addedToCart[product.id]}
            isWishlisted={wishlisted[product.id]}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddProductToCart}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
      
      {sortedProducts.length === 0 && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try selecting a different category or filter</p>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, quantity, isAddedToCart, isWishlisted, onQuantityChange, onAddToCart, onToggleWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img 
          src={product.image || 'https://placehold.co/300x300/f8f8f8/999999?text=Product'} 
          alt={product.name} 
          className="product-image"
        />
        {discountPercentage > 0 && (
          <div className="discount-badge">-{discountPercentage}%</div>
        )}
        <button 
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          style={{ color: isWishlisted ? '#ff6161' : '#878787' }}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-category-tag">
          {product.category || 'General'}
        </div>
        
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        
        <div className="product-rating">
          <div className="stars">★★★★★</div>
          <a href="#" className="reviews">(128)</a>
        </div>
        
        <p className="product-description" title={product.description}>
          {product.description || 'Quality product with excellent features and durability.'}
        </p>
        
        <div className="product-price-container">
          <div className="product-price">₹{product.price?.toFixed(2)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="original-price">₹{product.originalPrice?.toFixed(2)}</div>
          )}
        </div>
        
        <div className="product-meta">
          <div className="availability in-stock">
            <span className="stock-indicator"></span>
            In Stock
          </div>
          <div className="delivery-info">
            FREE Delivery
          </div>
        </div>
        
        <div className="product-actions">
          <div className="quantity-selector">
            <button 
              className="quantity-btn"
              onClick={() => onQuantityChange(product.id, quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => onQuantityChange(product.id, e.target.value)}
              className="quantity-input"
            />
            <button 
              className="quantity-btn"
              onClick={() => onQuantityChange(product.id, quantity + 1)}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            className={`add-to-cart-btn ${isAddedToCart ? 'added' : ''}`}
          >
            {isAddedToCart ? (
              <>
                <span className="check-icon">✓ Added</span>
              </>
            ) : (
              <>
                <span className="cart-icon">🛒 Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductList;