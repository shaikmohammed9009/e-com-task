# MyApiOFProduct - Full Stack Shopping Cart Application

A complete e-commerce shopping cart application built with React (frontend), Node/Express (backend), and MongoDB for product data with in-memory storage for cart data.

## Features

- Product listing with beautiful UI from MongoDB
- Add/remove items from cart
- Update item quantities
- Checkout process with form validation
- Order confirmation receipt
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, CSS3
- **Backend**: Node.js, Express
- **Database**: MongoDB (for products), In-memory storage (for cart)
- **API**: RESTful APIs

## Project Structure

```
├── backend/
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Main application entry point
│   ├── package.json       # Backend dependencies
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (ProductList, Cart, Checkout)
│   │   ├── App.jsx        # Main application component
│   │   └── ...
│   ├── package.json       # Frontend dependencies
│   └── ...
│
└── README.md              # This file
```

## API Endpoints

### Products
- `GET /api/products` - Get all products from MongoDB

### Cart
- `GET /api/cart` - Get cart items and total
- `POST /api/cart` - Add item to cart `{productId, quantity}`
- `PUT /api/cart/:id` - Update item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process checkout `{name, email}`

### Health
- `GET /api/health` - Check server status

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MyApiOFProduct
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **MongoDB Setup:**
   - Create a MongoDB Atlas account
   - Create a cluster and database named `MyApiOFProduct`
   - Update the MongoDB credentials in `backend/.env`:
     ```
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_CLUSTER=your_cluster_url
     DB_NAME=MyApiOFProduct
     PORT=5000
     ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on http://localhost:5173

3. **Open your browser** and navigate to http://localhost:5173

## Usage

1. Browse products on the homepage
2. Add items to cart using the quantity selector
3. View and manage your cart
4. Proceed to checkout with your details
5. Receive order confirmation

## Development

### Backend Architecture
The backend follows a clean, modular architecture:

- **Config**: Database connection and configuration
- **Controllers**: Business logic for handling requests
- **Models**: Data models and database interactions
- **Routes**: API endpoint definitions
- **Utils**: Helper functions

### Frontend
The frontend is built with React and includes:
- Product listing with beautiful cards
- Shopping cart management
- Multi-step checkout process
- Order confirmation

## Deployment

To deploy this application to GitHub:
1. Create a new repository on GitHub
2. Push the code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

## Bonus Features Implemented

- ✅ Clean, modular backend architecture
- ✅ Responsive design for all screen sizes
- ✅ Form validation for checkout
- ✅ Error handling
- ✅ Beautiful UI/UX with animations
- ✅ Product categorization
- ✅ Wishlist functionality
- ✅ Search functionality
- ✅ Visual feedback for user actions

## Future Enhancements

- Full MongoDB persistence for cart data
- User authentication
- Product reviews and ratings
- Payment gateway integration
- Order history
- Admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Product images from Unsplash
- Icons from Emoji
- Inspired by modern e-commerce platforms