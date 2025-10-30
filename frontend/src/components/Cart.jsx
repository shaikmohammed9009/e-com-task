import React, { useState } from 'react';
import './Cart.css';
import { toast } from 'react-toastify';

const Cart = ({ cart, onUpdateItem, onRemoveItem, onCheckout }) => {
  console.log('Cart component received cart data:', cart);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, value) => {
    console.log('handleQuantityChange called with:', { itemId, value });
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const handleUpdateQuantity = (itemId) => {
    console.log('handleUpdateQuantity called with itemId:', itemId);
    console.log('Type of itemId:', typeof itemId);
    const quantity = quantities[itemId] || 1;
    onUpdateItem(itemId, quantity);
    toast.success('Cart item updated!');
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart">
        <div className="cart-container">
          <div className="cart-header">
            <h2>My Cart</h2>
            <p>Review and manage your shopping cart</p>
          </div>
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button onClick={() => window.location.hash = '#products'} className="shop-btn">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total items and subtotal in cart based on current quantities
  let subtotal = 0;
  let totalItems = 0;
  
  const cartItemsWithTotals = cart.items.map(item => {
    const currentQuantity = quantities[item.id] || item.quantity;
    const itemTotal = item.product.price * currentQuantity;
    subtotal += itemTotal;
    totalItems += currentQuantity;
    return {
      ...item,
      currentQuantity,
      itemTotal
    };
  });

  return (
    <div className="cart">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart ({totalItems} items)</h2>
          <p>Review and manage your shopping cart</p>
        </div>
        
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItemsWithTotals.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img 
                      src={item.product.image || 'https://placehold.co/120x120/f8f8f8/999999?text=Product'} 
                      alt={item.product.name} 
                      className="item-image"
                    />
                    {!item.product.image && (
                      <div className="item-image-placeholder">
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <div className="item-price">₹{item.product.price.toFixed(2)} × {item.currentQuantity} = ₹{item.itemTotal.toFixed(2)}</div>
                    <div className="item-quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.currentQuantity - 1)}
                        disabled={item.currentQuantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.currentQuantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.currentQuantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id)}
                        className="update-btn"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Remove button clicked with itemId:', item.id);
                          console.log('Type of item.id:', typeof item.id);
                          onRemoveItem(item.id);
                          toast.success('Item removed from cart!');
                        }}
                        className="remove-btn"
                        >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    {item.itemTotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="cart-summary">
              <div className="summary-title">Order Summary</div>
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span style={{ color: '#388e3c' }}>-₹0.00</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="total-amount">₹{subtotal.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;