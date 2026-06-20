# Sajiri MERN - Quick Start Guide (Post-Refactor)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

---

## Backend Setup

### 1. Environment Configuration
Create `.env` file in `backend/` directory:

```
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sajiri_db
JWT_SECRET=sajiri_jwt_secret_2026
JWT_REFRESH_SECRET=sajiri_refresh_secret_2026
JWT_EMAIL_SECRET=sajiri_email_secret_2026
FRONTEND_URL=http://localhost:3000

# Optional - for Razorpay payment
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=rzp_secret_xxxxx

# Optional - for Cloudinary images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

**Expected Output:**
```
Server running on port 8000
✅ Sample products seeded successfully!
MongoDB Connected
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Development Server
```bash
npm start
# or for development
npm run dev
```

Frontend will open on `http://localhost:3000` or `http://localhost:5173` (Vite)

---

## 📦 Sample Data

The backend automatically seeds **15 clothing products** on first startup:

### Women's Collection (5 products)
- Classic White Cotton T-Shirt (₹599 → ₹399)
- Blue Denim Jeans (₹1299 → ₹899)
- Black Yoga Leggings (₹899 → ₹599)
- Floral Summer Dress (₹1499 → ₹999)
- Red Hoodie Sweatshirt (₹1099 → ₹799)

### Men's Collection (5 products)
- Classic Black T-Shirt (₹549 → ₹349)
- Navy Blue Formal Shirt (₹1399 → ₹999)
- Gray Sports Shorts (₹699 → ₹449)
- Dark Blue Chinos (₹1199 → ₹849)
- Gray Zip-up Jacket (₹1599 → ₹1199)

### Kids' Collection (5 products)
- Colorful Kids T-Shirt (₹399 → ₹249)
- Blue Denim Shorts (₹549 → ₹349)
- Pink Cute Dress (₹799 → ₹499)
- Green Printed Hoodie (₹699 → ₹449)
- Sports Track Pants (₹649 → ₹399)

---

## 🧪 Testing the Application

### 1. Test Homepage
1. Open browser → `http://localhost:3000`
2. Should see featured products
3. Browse by category (Women, Men, Kids)
4. Use search bar
5. Sort by price/newest

### 2. Test Product Details
1. Click any product
2. View details, images, price
3. Click "Like" button (works without login)
4. Click "Add to Cart" → redirects to login

### 3. Test User Authentication
1. Click "Signup" → Create new user
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Password: password123
   Role: User (default)
   ```
2. Login with credentials
3. See "Hi, John" in header

### 4. Test Shopping Cart
1. After login, click "Add to Cart"
2. Go to Cart page
3. Update quantities
4. Remove items
5. Proceed to Checkout

### 5. Test Order Placement
1. From Cart, click "Checkout"
2. Enter shipping address:
   ```
   Name: John Doe
   Phone: 9876543210
   Address: 123 Main St
   City: Mumbai
   Zip: 400001
   ```
3. Select payment method (Razorpay or COD)
4. Click "Place Order"
5. Complete payment (if Razorpay)
6. View order in "My Orders" page

### 6. Test API Endpoints Directly

**Get All Products:**
```bash
curl http://localhost:8000/api/products
```

**Get Featured Products:**
```bash
curl http://localhost:8000/api/products/featured
```

**Get Single Product:**
```bash
curl http://localhost:8000/api/products/PRODUCT_ID
```

**Create Order (requires auth):**
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "COD",
    "totalPrice": 5000
  }'
```

---

## 🔑 Important API Endpoints

### Products (Public)
- `GET /api/products` - List products with pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/like` - Like a product

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (requires auth)
- `POST /api/auth/refresh-token` - Refresh JWT

### Cart (Requires Auth)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Requires Auth)
- `POST /api/orders` - Create order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

---

## 📂 Project Structure

```
Sajiri/
├── backend/
│   ├── models/
│   │   ├── Product.model.js         (Modified - owner optional)
│   │   ├── User.model.js
│   │   ├── Cart.model.js
│   │   └── Order.model.js
│   ├── controllers/
│   │   ├── product.controller.simple.js  (NEW)
│   │   ├── cart.controller.js
│   │   ├── order.controller.js      (Modified - seller logic removed)
│   │   └── auth.controller.js
│   ├── routes/
│   │   ├── product.routes.js        (Modified - removed owner endpoints)
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── auth.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── utils/
│   │   ├── email.js
│   │   └── response.js
│   ├── seed.data.js                 (NEW - sample products)
│   ├── server.js                    (Modified - auto-seed)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ProductPage.js       (Modified - like endpoint)
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── components/
│   │   │   ├── Header.js            (Modified - removed owner nav)
│   │   │   ├── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── index.js
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── App.js                   (Modified - removed owner routes)
│   │   ├── index.js
│   │   └── styles/
│   │       └── theme.css
│   └── package.json
│
└── REFACTOR_DOCUMENTATION.md       (NEW - detailed changes)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /dashboard"
**Solution:** Owner dashboard removed. Navigate to `/` (home) instead.

### Issue: Products not showing
1. Check backend console for seeding logs
2. Verify MongoDB connection string
3. Check if products collection exists in DB
4. Manually seed data (see Database Reset section)

### Issue: Add to Cart gives 404
1. Make sure you're logged in
2. Check backend is running
3. Verify `/api/cart/add` endpoint

### Issue: Login doesn't work
1. Verify user was created in signup
2. Check password is correct
3. Check backend JWT_SECRET is set

### Issue: Checkout page shows errors
1. Make sure cart has items
2. Verify all required fields filled
3. For Razorpay: check RAZORPAY_KEY_ID is set
4. Check order backend is running

---

## 🔄 Database Reset

To reset and reseed products:

### Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to database
use sajiri_db

# Delete existing products
db.products.deleteMany({})

# Exit
exit
```

### Using Mongoose (Node.js)
```bash
# Create reset script
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

connectDB().then(async () => {
  const Product = require('./models/Product.model');
  await Product.deleteMany({});
  console.log('Products cleared. Restart server to reseed.');
  process.exit(0);
});
"
```

---

## 📝 Notes

- **No owner functionality:** Users can only browse and purchase products
- **Sample products are permanent:** You can add/modify products in `seed.data.js`
- **Auto-seeding:** Only runs if products collection is empty
- **All products approved:** No approval workflow - all display immediately
- **Default seller:** All products show "Sajiri Store" as seller

---

## 🚀 Deployment

For production deployment, see main `README.md` in project root.

---

**Ready to go!** 🎉 Start both servers and visit `http://localhost:3000`
