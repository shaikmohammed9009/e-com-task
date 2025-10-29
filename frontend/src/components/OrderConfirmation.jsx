import React from 'react';
import './OrderConfirmation.css';

const OrderConfirmation = ({ receipt, onClose, onTrackOrder }) => {
  if (!receipt) return null;

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="confirmation-icon">✓</div>
          <h1>Order Placed Successfully</h1>
          <p>Thank you for your purchase!</p>
        </div>

        <div className="confirmation-content">
          <div className="order-summary-section">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <div className="order-id">Order ID: {receipt.id}</div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Order Date</span>
                <span>{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Total Amount</span>
                <span className="amount">₹{receipt.total.toFixed(2)}</span>
              </div>
              
              {receipt.paymentMethod && (
                <div className="summary-row">
                  <span>Payment Method</span>
                  <span>{receipt.paymentMethod}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Delivery Address</span>
                <span className="address">
                  {receipt.name}<br />
                  {receipt.address}<br />
                  {receipt.city}, {receipt.state} {receipt.zip}<br />
                  {receipt.country}
                  {receipt.phone && <><br />Phone: {receipt.phone}</>}
                </span>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {receipt.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <div className="item-name">{item.product}</div>
                    <div className="item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  <div className="item-price">₹{item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="next-steps">
            <h3>Next Steps</h3>
            <div className="steps-container">
              <div className="step">
                <div className="step-icon">1</div>
                <div className="step-text">Order Confirmation</div>
              </div>
              <div className="step">
                <div className="step-icon">2</div>
                <div className="step-text">Processing</div>
              </div>
              <div className="step">
                <div className="step-icon">3</div>
                <div className="step-text">Shipped</div>
              </div>
              <div className="step">
                <div className="step-icon">4</div>
                <div className="step-text">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={onTrackOrder} className="track-btn">
            Track Your Order
          </button>
          <button onClick={onClose} className="continue-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;