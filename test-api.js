async function testAPIs() {
  try {
    // Test GET /api/products
    console.log('Testing GET /api/products...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    console.log('Products:', products);

    // Test POST /api/cart
    console.log('\nTesting POST /api/cart...');
    const addToCartResponse = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: products[0].id,
        quantity: 2
      })
    });
    const addToCartResult = await addToCartResponse.json();
    console.log('Add to cart result:', addToCartResult);

    // Test GET /api/cart
    console.log('\nTesting GET /api/cart...');
    const cartResponse = await fetch('http://localhost:5000/api/cart');
    const cart = await cartResponse.json();
    console.log('Cart:', cart);

    // Test PUT /api/cart/:id
    console.log('\nTesting PUT /api/cart/:id...');
    const updateCartResponse = await fetch(`http://localhost:5000/api/cart/${cart.items[0].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: 3
      })
    });
    const updateCartResult = await updateCartResponse.json();
    console.log('Update cart result:', updateCartResult);

    // Test GET /api/cart again
    console.log('\nTesting GET /api/cart after update...');
    const cartResponse2 = await fetch('http://localhost:5000/api/cart');
    const cart2 = await cartResponse2.json();
    console.log('Cart after update:', cart2);

    // Test POST /api/checkout
    console.log('\nTesting POST /api/checkout...');
    const checkoutResponse = await fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com'
      })
    });
    const checkoutResult = await checkoutResponse.json();
    console.log('Checkout result:', checkoutResult);

    // Test GET /api/cart after checkout (should be empty)
    console.log('\nTesting GET /api/cart after checkout...');
    const cartResponse3 = await fetch('http://localhost:5000/api/cart');
    const cart3 = await cartResponse3.json();
    console.log('Cart after checkout:', cart3);

  } catch (error) {
    console.error('Error testing APIs:', error);
  }
}

testAPIs();