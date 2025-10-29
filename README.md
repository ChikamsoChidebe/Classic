# Classic Wardrobe - E-commerce Platform

A full-stack e-commerce platform built with React.js frontend and Node.js backend, featuring multi-role authentication (Customer, Vendor, Admin) and comprehensive product management.

## Features

### Customer Features
- User registration and authentication
- Browse products with filtering and search
- Product detail pages with image gallery
- Shopping cart management
- Secure checkout process
- Order tracking and history
- User profile management

### Vendor Features
- Vendor dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates
- Sales tracking and reporting
- Inventory management

### Admin Features
- Admin dashboard with platform statistics
- User management (activate/deactivate)
- Vendor management and approval
- Product oversight and moderation
- Order monitoring across all vendors
- Platform analytics

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

## Project Structure

```
Classic/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── vendor/
│   │   │   │   ├── VendorDashboard.jsx
│   │   │   │   ├── VendorProducts.jsx
│   │   │   │   ├── VendorOrders.jsx
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   └── EditProduct.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminUsers.jsx
│   │   │   │   ├── AdminVendors.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminOrders.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── orderSlice.js
│   │   │   │   ├── categorySlice.js
│   │   │   │   ├── vendorSlice.js
│   │   │   │   └── adminSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   ├── Cart.js
    │   ├── Category.js
    │   └── Vendor.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── cart.js
    │   ├── categories.js
    │   ├── vendors.js
    │   ├── admin.js
    │   ├── users.js
    │   └── upload.js
    ├── middleware/
    │   └── auth.js
    ├── config/
    ├── controllers/
    ├── utils/
    │   ├── cloudinary.js
    │   └── generateToken.js
    ├── server.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Vendor only)
- `PUT /api/products/:id` - Update product (Vendor only)
- `DELETE /api/products/:id` - Delete product (Vendor only)

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item

### Admin Routes
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/vendors` - Get all vendors
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders

## User Roles

### Customer
- Browse and purchase products
- Manage cart and orders
- Update profile information

### Vendor
- Manage product inventory
- Process orders
- View sales analytics
- Update order status

### Admin
- Oversee entire platform
- Manage users and vendors
- Monitor all transactions
- Access platform analytics

## Features Implemented

✅ User Authentication & Authorization  
✅ Multi-role System (Customer, Vendor, Admin)  
✅ Product Management (CRUD)  
✅ Shopping Cart Functionality  
✅ Order Management System  
✅ Payment Integration Ready  
✅ Image Upload with Cloudinary  
✅ Responsive Design  
✅ Search & Filter Products  
✅ Order Tracking  
✅ Admin Dashboard  
✅ Vendor Dashboard  
✅ Real-time Notifications  
✅ Form Validation  
✅ Error Handling  

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact the development team.