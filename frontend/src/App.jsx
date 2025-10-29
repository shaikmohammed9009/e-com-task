import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import PaymentMethod from "./components/PaymentMethod";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderTracking from "./components/OrderTracking";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [view, setView] = useState("products"); // 'products', 'cart', 'checkout', 'payment', 'confirmation', 'tracking'
  const [receipt, setReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart");
      const data = await response.json();
      console.log("fetchCart called, received data:", data);
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    console.log("addToCart called with:", { productId, quantity });
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      console.log("API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Cart item added:", data);
        toast.success("Item added to cart successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add item to cart:", errorData);
        toast.error(errorData.message || "Failed to add item to cart");
      }

      // Always refresh the cart regardless of the response
      // Add a small delay to ensure the backend has processed the request
      setTimeout(() => {
        fetchCart();
      }, 500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart: " + error.message);
      // Still try to refresh the cart
      setTimeout(() => {
        fetchCart();
      }, 500);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        toast.success("Cart item updated successfully!");
        fetchCart(); // Refresh cart
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update cart item");
      }
    } catch (error) {
      toast.error("Error updating cart item: " + error.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Item removed from cart!");
        fetchCart(); // Refresh cart
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to remove item from cart");
      }
    } catch (error) {
      toast.error("Error removing from cart: " + error.message);
    }
  };

  const handleCheckout = async (data) => {
    setCheckoutData(data);
    setView("payment");
  };

  const handlePaymentMethod = async (paymentData) => {
    try {
      // Combine checkout data and payment method properly
      // Only send the payment method type, not the card details
      const checkoutPayload = {
        name: checkoutData?.name || '',
        email: checkoutData?.email || '',
        phone: checkoutData?.phone || '',
        address: checkoutData?.address || '',
        city: checkoutData?.city || '',
        state: checkoutData?.state || '',
        zip: checkoutData?.zip || '',
        country: checkoutData?.country || 'India',
        paymentMethod: paymentData?.paymentMethod || 'card'
      };
      
      // Remove any undefined, null, or empty string values for optional fields
      Object.keys(checkoutPayload).forEach(key => {
        if (checkoutPayload[key] === undefined || checkoutPayload[key] === null || 
            (typeof checkoutPayload[key] === 'string' && checkoutPayload[key].trim() === '')) {
          delete checkoutPayload[key];
        }
      });
      
      console.log("Sending checkout data to backend:", checkoutPayload);
      
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutPayload),
      });

      console.log("Checkout response status:", response.status);
      
      if (response.ok) {
        const receiptData = await response.json();
        console.log("Checkout successful, receipt:", receiptData);
        setReceipt(receiptData);
        setView("confirmation");
        toast.success("Checkout completed successfully!");
      } else {
        const errorData = await response.json();
        console.error("Checkout failed:", errorData);
        toast.error(errorData.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("An error occurred during checkout: " + error.message);
    }
  };

  const closeConfirmation = () => {
    setReceipt(null);
    setView("products");
    setCheckoutData(null);
    fetchCart(); // Refresh cart
  };

  const handleTrackOrder = () => {
    setView("tracking");
  };

  const handleBackToHome = () => {
    setView("products");
    setReceipt(null);
    setCheckoutData(null);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <ToastContainer />
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo"> VibeCommerce </h1>{" "}
            <div className="tagline"> Premium Shopping Experience </div>{" "}
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-button"> 🔍 </button>{" "}
            </div>
            <nav className="main-nav">
              <button
                className={
                  view === "products" ? "nav-button active" : "nav-button"
                }
                onClick={() => setView("products")}
              >
                <span className="nav-icon"> 🛍️ </span>
                Products{" "}
              </button>{" "}
              <button
                className={view === "cart" ? "nav-button active" : "nav-button"}
                onClick={() => setView("cart")}
              >
                <span className="nav-icon"> 🛒 </span>
                Cart{" "}
                {cart.items.length > 0 && (
                  <span className="cart-count"> {cart.items.length} </span>
                )}{" "}
              </button>{" "}
            </nav>{" "}
          </div>{" "}
        </div>{" "}
      </header>
      <main className="app-main">
        {" "}
        {view === "products" && (
          <ProductList products={filteredProducts} onAddToCart={addToCart} />
        )}
        {view === "cart" && (
          <Cart
            cart={cart}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            onCheckout={() => setView("checkout")}
          />
        )}
        {view === "checkout" && (
          <Checkout
            cart={cart}
            onCheckout={handleCheckout}
            onCancel={() => setView("cart")}
          />
        )}
        {view === "payment" && (
          <PaymentMethod
            cart={cart}
            onPaymentMethodSelect={handlePaymentMethod}
            onBackToCheckout={() => setView("checkout")}
          />
        )}
        {view === "confirmation" && (
          <OrderConfirmation 
            receipt={receipt} 
            onClose={closeConfirmation}
            onTrackOrder={handleTrackOrder}
          />
        )}
        {view === "tracking" && (
          <OrderTracking 
            orderId={receipt?.id}
            onBackToHome={handleBackToHome}
          />
        )}
      </main>{" "}
    </div>
  );
}

export default App;