// Detailed test to mimic frontend behavior
async function testFrontendDetailed() {
  console.log('Testing detailed frontend behavior...');
  
  try {
    // Step 1: Fetch products (like frontend does)
    console.log('\n1. Fetching products...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    console.log('Products fetched:', products.length, 'items');
    
    // Step 2: Simulate adding first product to cart (like frontend does)
    const firstProduct = products[0];
    console.log('\n2. Simulating frontend add to cart for:', firstProduct.name);
    console.log('Product ID being sent:', firstProduct.id);
    
    // This is exactly what the frontend does
    const response = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        productId: firstProduct.id, 
        quantity: 1 
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok?', response.ok);
    
    // Check response headers
    console.log('Response headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success response data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error response:');
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
    
    // Step 3: Fetch cart to verify
    console.log('\n3. Fetching cart to verify...');
    const cartResponse = await fetch('http://localhost:5000/api/cart');
    const cartData = await cartResponse.json();
    console.log('Cart items:', cartData.items.length);
    console.log('Cart total:', cartData.total);
    
  } catch (error) {
    console.error('Detailed test failed:', error);
  }
}

testFrontendDetailed();