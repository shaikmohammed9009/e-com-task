import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { toast } from 'react-toastify';

const Checkout = ({ cart, onCheckout, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  // Prefill some data for demo purposes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001'
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDelivery = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      // More flexible expiration date validation
      if (!cardDetails.expiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else {
        // Allow formats like MM/YY, MM/YYYY, M/YY, M/YYYY
        const expiryRegex = /^(\d{1,2})\/(\d{2,4})$/;
        const match = cardDetails.expiry.match(expiryRegex);
        
        if (!match) {
          newErrors.cardExpiry = 'Valid expiry date required (MM/YY or MM/YYYY)';
        } else {
          const month = parseInt(match[1], 10);
          const year = match[2].length === 2 ? 2000 + parseInt(match[2], 10) : parseInt(match[2], 10);
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          
          if (month < 1 || month > 12) {
            newErrors.cardExpiry = 'Invalid month (1-12)';
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

  const handleContinueDelivery = (e) => {
    e.preventDefault();
    
    if (validateDelivery()) {
      // Call the onCheckout prop to navigate to payment view
      onCheckout(formData);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validatePayment()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onCheckout({...formData, paymentMethod});
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      onCheckout({ name, email, cartItems: cart.items });
      toast.success('Order placed successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  // Calculate values
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.total;
  const shipping = 0;
  const discount = itemCount >= 3 ? subtotal * 0.05 : 0; // 5% discount for 3+ items
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal + shipping + tax - discount;

  // Format card number
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Allow up to 12 digits for 12-digit cards
    const maxLength = Math.min(v.length, 12);
    const trimmedValue = v.substring(0, maxLength);
    
    // Format as XXXX XXXX XXXX for 12 digits
    const parts = [];
    for (let i = 0; i < trimmedValue.length; i += 4) {
      parts.push(trimmedValue.substring(i, Math.min(i + 4, trimmedValue.length)));
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
              <div className={`step ${activeSection === 'delivery' ? 'active' : 'completed'}`}>
                <div className="step-icon">
                  {activeSection === 'delivery' ? '1' : '✓'}
                </div>
                <div className="step-label">Delivery</div>
              </div>
              
              <div className="progress-line"></div>
              
              <div className="step">
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
            {/* Delivery Address Section */}
            <div className="checkout-section animated-section">
              <div className="section-header">
                <h2>
                  <span className="icon">📍</span>
                  Delivery Address
                </h2>
                <p>Where should we deliver your order?</p>
              </div>
              
              <form onSubmit={handleContinueDelivery} className="address-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name *
                      <span 
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip('name')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ⓘ
                      </span>
                      {showTooltip === 'name' && (
                        <div className="tooltip">Enter your full legal name as it appears on your ID</div>
                      )}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number *
                      <span 
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip('phone')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ⓘ
                      </span>
                      {showTooltip === 'phone' && (
                        <div className="tooltip">10-digit mobile number for delivery updates</div>
                      )}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address *
                    <span 
                      className="tooltip-trigger"
                      onMouseEnter={() => setShowTooltip('email')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ⓘ
                    </span>
                    {showTooltip === 'email' && (
                      <div className="tooltip">Order confirmation and updates will be sent here</div>
                    )}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">
                    Address *
                    <span 
                      className="tooltip-trigger"
                      onMouseEnter={() => setShowTooltip('address')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ⓘ
                    </span>
                    {showTooltip === 'address' && (
                      <div className="tooltip">House/Flat number, Building, Street, Area</div>
                    )}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Complete address including landmark"
                    rows="3"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="city">
                      City *
                      <span 
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip('city')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ⓘ
                      </span>
                      {showTooltip === 'city' && (
                        <div className="tooltip">Delivery city</div>
                      )}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Enter your city"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">
                      State *
                      <span 
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip('state')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ⓘ
                      </span>
                      {showTooltip === 'state' && (
                        <div className="tooltip">Delivery state</div>
                      )}
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="Enter your state"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="zip">
                      ZIP Code *
                      <span 
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip('zip')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ⓘ
                      </span>
                      {showTooltip === 'zip' && (
                        <div className="tooltip">6-digit postal code</div>
                      )}
                    </label>
                    <input
                      type="tel"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className={errors.zip ? 'error' : ''}
                      placeholder="6-digit ZIP code"
                      maxLength="6"
                    />
                    {errors.zip && <span className="error-message">{errors.zip}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={onCancel} 
                    className="btn btn-secondary"
                  >
                    ← Back to Cart
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
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

export default Checkout;