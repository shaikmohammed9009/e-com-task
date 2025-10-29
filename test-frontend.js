// Test script to verify frontend functionality
// Using built-in fetch in Node.js

async function testFrontendFunctionality() {
  console.log('Testing frontend functionality...');
  
  try {
    // Test 1: Fetch products
    console.log('\n1. Fetching products...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    console.log('Products fetched successfully:', products.length, 'products');
    
    // Test 2: Add first product to cart
    console.log('\n2. Adding product to cart...');
    const firstProduct = products[0];
    console.log('Adding product:', firstProduct.name);
    
    const addToCartResponse = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        productId: firstProduct.id, 
        quantity: 1 
      }),
    });
    
    console.log('Add to cart response status:', addToCartResponse.status);
    
    if (addToCartResponse.ok) {
      const cartItem = await addToCartResponse.json();
      console.log('Product added to cart successfully:', cartItem);
    } else {
      console.log('Failed to add product to cart');
      const error = await addToCartResponse.json();
      console.log('Error:', error);
    }
    
    // Test 3: Fetch cart
    console.log('\n3. Fetching cart...');
    const cartResponse = await fetch('http://localhost:5000/api/cart');
    const cart = await cartResponse.json();
    console.log('Cart fetched successfully:');
    console.log('Items in cart:', cart.items.length);
    console.log('Total:', cart.total);
    
    if (cart.items.length > 0) {
      console.log('First item in cart:', cart.items[0].product.name);
    }
    
    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFrontendFunctionality();