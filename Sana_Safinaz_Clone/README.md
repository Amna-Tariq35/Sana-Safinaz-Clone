# 🛍️ Sana Safinaz Clone - E-Commerce Platform

A modern e-commerce web application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. This project replicates the functionality of a Pakistani luxury fashion brand's online store.

## ✨ Features

### 👥 User Features
- ✅ User Registration & Authentication
- ✅ Browse Products Catalog
- ✅ Add to Cart (without login required)
- ✅ Add to Wishlist (with account)
- ✅ Guest Checkout - Complete orders without account
- ✅ Order Confirmation & History
- ✅ User-Friendly Dashboard

### 🛠️ Admin Features
- ✅ Admin Dashboard
- ✅ Manage Products (Add, Edit, Delete)
- ✅ Manage Categories
- ✅ View & Track Orders
- ✅ Admin-Only Access Control

### 🎨 UI/UX Enhancements
- ✅ Modern Gradient Design
- ✅ Responsive Layout (Mobile-Friendly)
- ✅ Smooth Animations & Transitions
- ✅ Flash Messages for User Feedback
- ✅ Professional Color Scheme

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: EJS, Bootstrap 5, HTML5, CSS3
- **Authentication**: bcryptjs, express-session
- **Other**: Dotenv, connect-flash

## 📋 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Account or Local MongoDB
- npm or yarn

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Sana_Safinaz_Clone
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` File**
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   PORT=3000
   ```

4. **Start the Server**
   ```bash
   npm start
   # or
   node server.js
   ```

5. **Access the Application**
   - **Main Site**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 👨‍💼 Admin Credentials

Use these credentials to access the admin panel and test all admin features:

| Field | Value |
|-------|-------|
| **Email** | `admin@admin.com` |
| **Password** | `Admin@9892` |

### How to Login as Admin
1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Enter the email and password provided above
3. You'll be automatically redirected to the admin dashboard
4. Access admin features: Manage Products, Categories, and Orders

---

## 📁 Project Structure

```
Sana_Safinaz_Clone/
├── routes/              # Express routes
│   ├── cart.js         # Shopping cart routes
│   ├── wishlist.js     # Wishlist routes
│   └── admin.js        # Admin panel routes
├── models/             # MongoDB schemas
│   ├── User.js         # User schema
│   ├── Product.js      # Product schema
│   ├── Order.js        # Order schema
│   └── Category.js     # Category schema
├── middleware/         # Custom middleware
│   ├── auth.js         # Authentication middleware
│   └── admin.js        # Admin authorization
├── views/              # EJS templates
│   ├── admin/          # Admin pages
│   ├── auth/           # Auth pages (login, signup)
│   ├── cart/           # Cart & checkout
│   └── partials/       # Reusable components
├── public/             # Static files
│   ├── css/            # Stylesheets
│   ├── images/         # Product images
│   └── uploads/        # User uploads
├── server.js           # Main application file
└── package.json        # Dependencies

```

---

## 🎯 Key Features Breakdown

### 🛒 Shopping Cart
- **Add to Cart**: Works for both guest and logged-in users
- **Guest Checkout**: Complete purchase without account
- **Session-Based**: Cart persists during user session
- **Quantity Management**: Increase/decrease quantities
- **Order Confirmation**: Successful order placement

### 👤 User Authentication
- **Sign Up**: New user registration with email validation
- **Login**: Secure password hashing with bcryptjs
- **Session Management**: Express session for user persistence
- **Logout**: Secure session termination
- **Role-Based Access**: User vs Admin differentiation

### 🛠️ Admin Panel
- **Product Management**: Add, edit, delete products
- **Category Management**: Organize products by category
- **Order Tracking**: View and manage all orders
- **Admin-Only Pages**: Protected routes with middleware

---

## 🌟 Recent Improvements

✨ **Guest Checkout System**
- Users can shop and checkout without creating an account
- Guest information captured during checkout
- Orders linked to guest email for tracking

🎨 **UI Enhancements**
- Modern purple gradient theme
- Improved checkout form with better UX
- Responsive design for all devices
- Better navigation with conditional login/logout

🔐 **Security Updates**
- Admin panel properly protected
- Session-based authentication
- Password hashing with bcrypt

---

## 📝 API Routes

### Cart Routes
- `GET /cart` - View shopping cart
- `GET /cart/add/:id` - Add product to cart
- `GET /cart/checkout` - Checkout page
- `POST /cart/checkout` - Process order
- `DELETE /cart/delete/:id` - Remove item
- `POST /cart/update/:id/:action` - Update quantity

### Auth Routes
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/signup` - Signup page
- `POST /auth/signup` - Create account
- `GET /logout` - Logout user

### Admin Routes (Protected)
- `GET /admin` - Admin dashboard
- `GET /admin/products` - Manage products
- `GET /admin/categories` - Manage categories
- `GET /admin/orders` - View orders

---

## 🎨 Color Scheme

The application uses a modern gradient design:
- **Primary Gradient**: `#667eea` → `#764ba2` (Purple)
- **Accent**: Smooth transitions and hover effects
- **Background**: Clean whites with subtle shadows

---

## 🚀 Deployment

This project can be deployed on platforms like:
- **Vercel** (with `vercel.json` config included)
- **Heroku**
- **Railway**
- **AWS**

For Vercel deployment, the `vercel.json` file is already configured.

---

## 🔍 Testing

### Test as Guest
1. Don't login, just browse products
2. Add items to cart
3. Proceed to checkout
4. Fill in guest information
5. Complete purchase

### Test as Admin
1. Login with admin credentials above
2. Access admin dashboard
3. Create, edit, or delete products
4. Manage categories
5. View orders

---

## 📧 Contact & Support

For portfolio inquiries or questions about this project:
- Feel free to explore the admin panel with provided credentials
- Test all features including guest checkout
- Review the codebase for implementation details

---

## 📄 License

This project is for portfolio demonstration purposes.

---

**Happy Shopping! 🛍️**

---

*Last Updated: August 18, 2026*
