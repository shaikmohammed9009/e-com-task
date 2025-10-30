import React, { useState, useEffect } from 'react';
import './OrderTracking.css';

const OrderTracking = ({ receipt, onBackToHome }) => {
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [trackingInfo, setTrackingInfo] = useState(null);

  // Use actual receipt data instead of mock data
  useEffect(() => {
    if (receipt) {
      // Create tracking data based on actual receipt
      const trackingData = {
        orderId: receipt.id || 'VIBE-123456789',
        status: 'shipped',
        estimatedDelivery: 'Oct 31, 2025',
        shippedDate: new Date(receipt.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        carrier: 'VibeExpress',
        trackingNumber: `VE${receipt.id?.substring(0, 10) || '123456789'}IN`,
        items: receipt.items || [],
        timeline: [
          { 
            status: 'confirmed', 
            title: 'Order Confirmed', 
            description: 'Your order has been confirmed', 
            date: new Date(receipt.timestamp).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            completed: true
          },
          { 
            status: 'processing', 
            title: 'Processing', 
            description: 'We are preparing your order for shipment', 
            date: new Date(new Date(receipt.timestamp).getTime() + 4 * 60 * 60 * 1000).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            completed: true
          },
          { 
            status: 'shipped', 
            title: 'Shipped', 
            description: 'Your order has been shipped', 
            date: new Date(new Date(receipt.timestamp).getTime() + 24 * 60 * 60 * 1000).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            completed: true
          },
          { 
            status: 'in_transit', 
            title: 'In Transit', 
            description: 'Your order is on the way', 
            date: 'Expected by Oct 31, 2025',
            completed: false
          },
          { 
            status: 'delivered', 
            title: 'Delivered', 
            description: 'Your order has been delivered', 
            date: '',
            completed: false
          }
        ]
      };
      
      setTrackingInfo(trackingData);
    }
    
    // Simulate order status updates
    const statusInterval = setInterval(() => {
      const statuses = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'];
      const currentIndex = statuses.indexOf(orderStatus);
      if (currentIndex < statuses.length - 1) {
        setOrderStatus(statuses[currentIndex + 1]);
      }
    }, 10000);
    
    return () => clearInterval(statusInterval);
  }, [receipt, orderStatus]);

  const getStatusIndex = (status) => {
    const statuses = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'];
    return statuses.indexOf(status);
  };

  if (!trackingInfo) {
    return (
      <div className="order-tracking">
        <div className="tracking-container">
          <div className="loading">Loading tracking information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="tracking-container">
        <div className="tracking-header">
          <h1>Track Your Order</h1>
          <p>Order ID: {trackingInfo.orderId}</p>
        </div>

        <div className="tracking-content">
          <div className="order-info-section">
            <div className="info-card">
              <h3>Order Status</h3>
              <div className="status-badge">{trackingInfo.status.replace('_', ' ').toUpperCase()}</div>
            </div>
            
            <div className="info-card">
              <h3>Estimated Delivery</h3>
              <div className="delivery-date">{trackingInfo.estimatedDelivery}</div>
            </div>
            
            <div className="info-card">
              <h3>Carrier</h3>
              <div className="carrier-info">
                <div>{trackingInfo.carrier}</div>
                <div className="tracking-number">Tracking #: {trackingInfo.trackingNumber}</div>
              </div>
            </div>
          </div>

          <div className="tracking-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline-container">
              {trackingInfo.timeline.map((event, index) => (
                <div 
                  key={index} 
                  className={`timeline-item ${event.completed ? 'completed' : ''}`}
                >
                  <div className="timeline-marker">
                    <div className="marker-inner"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.description}</div>
                    <div className="timeline-date">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {trackingInfo.items.map((item, index) => (
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
        </div>

        <div className="tracking-actions">
          <button onClick={onBackToHome} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;