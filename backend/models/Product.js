const { ObjectId } = require('mongodb');

/**
 * Product Model
 * Represents a product in the e-commerce system
 */
class Product {
  /**
   * Create a new product
   * @param {string} name - Product name
   * @param {number} price - Product price
   * @param {string} description - Product description
   * @param {string} image - Product image URL
   * @param {string} category - Product category
   */
  constructor(name, price, description, image, category) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.category = category;
  }

  /**
   * Initialize default products if collection is empty
   * @param {Collection} productsCollection - MongoDB products collection
   */
  static async initializeDefaultProducts(productsCollection) {
    try {
      const productCount = await productsCollection.countDocuments();
      if (productCount === 0) {
        const initialProducts = [
          {
            name: 'Wireless Headphones', 
            price: 99.99, 
            description: 'High-quality wireless headphones with noise cancellation',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
            category: 'Electronics'
          },
          {
            name: 'Smart Watch', 
            price: 199.99, 
            description: 'Feature-rich smartwatch with health monitoring',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
            category: 'Electronics'
          },
          {
            name: 'Bluetooth Speaker', 
            price: 79.99, 
            description: 'Portable Bluetooth speaker with excellent sound',
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&h=600',
            category: 'Electronics'
          },
          {
            name: 'Gaming Mouse', 
            price: 49.99, 
            description: 'Ergonomic gaming mouse with customizable buttons',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&h=600',
            category: 'Accessories'
          },
          {
            name: 'Mechanical Keyboard', 
            price: 129.99, 
            description: 'RGB mechanical keyboard with tactile switches',
            image: 'https://images.unsplash.com/photo-1595225476202-1e6433f609d5?auto=format&fit=crop&w=600&h=600',
            category: 'Accessories'
          },
          {
            name: 'USB-C Hub', 
            price: 39.99, 
            description: 'Multi-port USB-C hub for laptops',
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&h=600',
            category: 'Accessories'
          },
          {
            name: 'Wireless Charger', 
            price: 29.99, 
            description: 'Fast wireless charging pad for all devices',
            image: 'https://images.unsplash.com/photo-1606220588911-4a0f7f8e0d3f?auto=format&fit=crop&w=600&h=600',
            category: 'Accessories'
          },
          {
            name: 'Noise Cancelling Earbuds', 
            price: 149.99, 
            description: 'True wireless earbuds with active noise cancellation',
            image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&h=600',
            category: 'Electronics'
          }
        ];

        await productsCollection.insertMany(initialProducts);
        console.log("✓ Initialized products collection");
      }
    } catch (error) {
      console.error("✗ Error initializing products:", error.message);
    }
  }

  /**
   * Convert MongoDB product object to API response format
   * @param {Object} product - MongoDB product object
   * @returns {Object} Formatted product object
   */
  static toResponseObject(product) {
    return {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category
    };
  }
}

module.exports = Product;