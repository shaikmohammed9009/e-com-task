import React, { useState } from 'react';
import './Checkout.css';
import { toast } from 'react-toastify';

const PaymentMethod = ({ cart, onPaymentMethodSelect, onBackToCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for expiry field
    if (name === 'expiry') {
      let formattedValue = value;
      
      // Remove any non-digit characters
      formattedValue = formattedValue.replace(/\D/g, '');
      
      // Limit to 4 digits max (2 for month, 2 for year)
      formattedValue = formattedValue.substring(0, 4);
      
      // Automatically add "/" after month (first 2 digits)
      if (formattedValue.length >= 2) {
        const month = formattedValue.substring(0, 2);
        const year = formattedValue.substring(2, 4);
        
        // Validate month (01-12)
        if (parseInt(month) > 12) {
          formattedValue = '12' + year;
        } else if (parseInt(month) < 1) {
          formattedValue = '01' + year;
        }
        
        // Add slash between month and year
        formattedValue = month + (year ? '/' + year : '');
      }
      
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      const newErrors = {};
      
      // Allow both 12 and 16 digit card numbers
      const cardNumber = cardDetails.number.replace(/\s/g, '');
      if (!cardDetails.number.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.length !== 12 && cardNumber.length !== 16) {
        newErrors.cardNumber = 'Valid card number is required (12 or 16 digits)';
      }
      
      if (!cardDetails.name.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      
      // Validate expiration date with new format (MM/YY)
      if (!cardDetails.expiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else {
        // Check if format is MM/YY
        const expiryRegex = /^(\d{2})\/(\d{2})$/;
        const match = cardDetails.expiry.match(expiryRegex);
        
        if (!match) {
          newErrors.cardExpiry = 'Valid expiry date required (MM/YY)';
        } else {
          const month = parseInt(match[1], 10);
          const year = 2000 + parseInt(match[2], 10); // Convert YY to YYYY
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          
          if (month < 1 || month > 12) {
            newErrors.cardExpiry = 'Invalid month (01-12)';
          } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            newErrors.cardExpiry = 'Card has expired';
          }
        }
      }
      
      if (!cardDetails.cvv.trim() || (cardDetails.cvv.length !== 3 && cardDetails.cvv.length !== 4)) {
        newErrors.cardCvv = 'Valid CVV is required (3 or 4 digits)';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    return true;
  };

  // Format card number
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Allow up to 16 digits (for both 12 and 16 digit cards)
    const maxLength = Math.min(v.length, 16);
    const trimmedValue = v.substring(0, maxLength);
    
    // Format based on card length (12 or 16 digits)
    const parts = [];
    if (trimmedValue.length <= 12) {
      // Format as XXXX XXXX XXXX for 12 digits
      for (let i = 0; i < trimmedValue.length; i += 4) {
        parts.push(trimmedValue.substring(i, Math.min(i + 4, trimmedValue.length)));
      }
    } else {
      // Format as XXXX XXXX XXXX XXXX for 16 digits
      for (let i = 0; i < trimmedValue.length; i += 4) {
        parts.push(trimmedValue.substring(i, Math.min(i + 4, trimmedValue.length)));
      }
    }
    
    return parts.join(' ');
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails(prev => ({
      ...prev,
      number: formatted
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (validatePayment()) {
      onPaymentMethodSelect({ paymentMethod, cardDetails });
    }
  };

  // Calculate values
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.total;
  const shipping = 0;
  const discount = itemCount >= 3 ? subtotal * 0.05 : 0; // 5% discount for 3+ items
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* Header with Progress Indicator */}
        <div className="checkout-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">VibeCommerce</h1>
              <div className="secure-badge">
                <span className="lock-icon">🔒</span>
                <span>100% Secure Checkout</span>
              </div>
            </div>
            
            <div className="progress-indicator">
              <div className="step completed">
                <div className="step-icon">✓</div>
                <div className="step-label">Delivery</div>
              </div>
              
              <div className="progress-line"></div>
              
              <div className="step active">
                <div className="step-icon">2</div>
                <div className="step-label">Payment</div>
              </div>
              
              <div className="progress-line"></div>
              
              <div className="step">
                <div className="step-icon">3</div>
                <div className="step-label">Confirmation</div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            <div className="checkout-section animated-section">
              <div className="section-header">
                <h2>
                  <span className="icon">💳</span>
                  Payment Method
                </h2>
                <p>Choose your preferred payment option</p>
              </div>
              
              <div className="payment-methods">
                <div className="method-selector">
                  <div 
                    className={`method-option ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="method-icon">💳</div>
                    <div className="method-info">
                      <h3>Credit/Debit Card</h3>
                      <p>Pay with Visa, Mastercard, Rupay</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`method-option ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="method-icon">📱</div>
                    <div className="method-info">
                      <h3>UPI</h3>
                      <p>Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`method-option ${paymentMethod === 'wallet' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <div className="method-icon">💼</div>
                    <div className="method-info">
                      <h3>Wallet</h3>
                      <p>Amazon Pay, Paytm Wallet</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`method-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="method-icon">💵</div>
                    <div className="method-info">
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive the product</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="payment-form animated-form">
                    <div className="card-preview">
                      <div className="card-front">
                        <div className="card-logo">VibeCard</div>
                        <div className="card-number">
                          {cardDetails.number || '•••• •••• ••••'}
                        </div>
                        <div className="card-details">
                          <div className="card-holder">
                            <div className="label">Card Holder</div>
                            <div className="value">
                              {cardDetails.name || 'YOUR NAME'}
                            </div>
                          </div>
                          <div className="card-expiry">
                            <div className="label">Expires</div>
                            <div className="value">
                              {cardDetails.expiry || 'MM/YY'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="number"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        className={errors.cardNumber ? 'error' : ''}
                        placeholder="•••• •••• ••••"
                        maxLength="14"
                      />
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardName"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleCardChange}
                        className={errors.cardName ? 'error' : ''}
                        placeholder="Name as it appears on card"
                      />
                      {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">Expiry Date *</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardChange}
                          className={errors.cardExpiry ? 'error' : ''}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cardCvv">
                          CVV *
                          <span 
                            className="tooltip-trigger"
                            onMouseEnter={() => setShowTooltip('cvv')}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === 'cvv' && (
                            <div className="tooltip">3 or 4-digit security code on the back of your card</div>
                          )}
                        </label>
                        <input
                          type="password"
                          id="cardCvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          className={errors.cardCvv ? 'error' : ''}
                          placeholder="123 or 1234"
                          maxLength="4"
                        />
                        {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* UPI Payment Form */}
                {paymentMethod === 'upi' && (
                  <div className="payment-form animated-form">
                    <div className="upi-options">
                      <div className="upi-option">
                        <div className="upi-icon">🟡</div>
                        <div className="upi-name">Google Pay</div>
                      </div>
                      <div className="upi-option">
                        <div className="upi-icon">🔵</div>
                        <div className="upi-name">PhonePe</div>
                      </div>
                      <div className="upi-option">
                        <div className="upi-icon">🟢</div>
                        <div className="upi-name">Paytm</div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="upiId">UPI ID</label>
                      <input
                        type="text"
                        id="upiId"
                        placeholder="yourname@upi"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={onBackToCheckout}
                >
                  ← Back to Delivery
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              
              <div className="summary-row">
                <span>
                  Discount
                  {discount > 0 && (
                    <span className="discount-badge">5% OFF</span>
                  )}
                </span>
                <span className={discount > 0 ? 'discount' : ''}>
                  {discount > 0 ? `-₹${discount.toFixed(2)}` : '₹0.00'}
                </span>
              </div>
              
              <div className="summary-row">
                <span>
                  Tax (GST 18%)
                  <span className="tax-info">ⓘ</span>
                </span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <strong>Order Total</strong>
                <strong className="total-amount">₹{total.toFixed(2)}</strong>
              </div>
              
              {discount > 0 && (
                <div className="savings-banner">
                  🎉 You saved ₹{discount.toFixed(2)} on this order!
                </div>
              )}
            </div>
            
            <div className="cart-items-summary">
              <h3>Items in your order</h3>
              <div className="cart-items-list">
                {cart.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image-container">
                      <img 
                        src={item.product.image || 'https://placehold.co/60x60/f5f5f5/999999?text=IMG'} 
                        alt={item.product.name} 
                        className="item-image"
                      />
                      <div className="item-quantity">{item.quantity}</div>
                    </div>
                    <div className="item-info">
                      <h4 className="item-name">{item.product.name}</h4>
                      <p className="item-price">₹{item.product.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      ₹{item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="badge-icon">🛡️</span>
                <span>Secure Payment</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;