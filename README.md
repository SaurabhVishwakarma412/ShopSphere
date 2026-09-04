# 🛍️ ShopSphere — Modern Multi-Vendor E-Commerce Platform

A production-ready, full-stack MERN (MongoDB, Express, React 19, Node.js) marketplace connecting verified independent merchants with consumers. Features role-based access control, responsive luxury aesthetics, customer reviews, wishlists, and multi-attribute product management.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Dynamic Product Catalog**: Real-time debounce search, instant category filtering, price sliders, and sorting (Newest, Popular, Top Rated, Price Low-High, Price High-Low).
- **Interactive Product Showcase**: Multiple angle image carousel, discount pricing calculation, stock count indicators, and SKU tracking.
- **Variant Selection**: Custom color swatches, size pickers, and highlighted feature checklists.
- **Customer Reviews & Ratings**: 5-star rating system with verified customer reviews and automatic product score aggregation.
- **Wishlist & Saved Items**: Real-time optimistic wishlist management with instant transfer to cart.
- **Cart & Dynamic Shipping**: Auto-calculating cart summary, free delivery progress bar (orders > ₹999), and quantity stepper.
- **Express Multi-Step Checkout**: Fast address confirmation and selectable payment options (Instant UPI, Debit/Credit Card, Cash on Delivery).
- **Customer Order Tracking**: Real-time order status tracking (`placed`, `packed`, `shipped`, `delivered`, `cancelled`) with 1-click cancellation for unfulfilled orders.

### 💼 Seller Central
- **Merchant Dashboard**: Real-time sales metrics, total order counts, inventory numbers, and recent sales feed.
- **Rich Product Upload Engine**:
  - Multi-image upload preview with individual image removal (up to 5 images, 5MB each).
  - Basic details (Title, Brand, Category with auto-suggestions).
  - Pricing & Discounts (Selling Price vs. Original / MRP Price for automatic discount badges).
  - Inventory management with stock levels and custom SKU identifier.
  - Multi-attribute variants: Colors, Sizes, and Search Keywords/Tags.
  - Bulleted key highlights / features list.
- **Inventory Control**: Live inventory search, low-stock warnings, inline edit triggers, and permanent deletion with safeguards.
- **Fulfillment Pipeline**: Update customer orders across stages (`placed` ➔ `packed` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).

---

## 📂 Project Structure

```text
ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, JWT & profile
│   │   │   ├── orderController.js    # Order placement, seller orders & status
│   │   │   ├── productController.js  # Product CRUD, filters, reviews, categories
│   │   │   └── wishlistController.js # Customer wishlist toggle & retrieval
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Protect route & role authorization
│   │   │   ├── errorMiddleware.js    # 404 & centralized error handler
│   │   │   ├── uploadMiddleware.js   # Multer storage configuration
│   │   │   └── validateMiddleware.js # Express-validator request sanitization
│   │   ├── models/
│   │   │   ├── accountSchema.js      # Base schema for Customer & Seller
│   │   │   ├── Customer.js           # Customer model with wishlist references
│   │   │   ├── Order.js              # Order model with line items & statuses
│   │   │   ├── Product.js            # Rich product schema (variants, tags, rating)
│   │   │   ├── Review.js             # Customer review & rating schema
│   │   │   ├── Seller.js             # Seller account model
│   │   │   └── User.js               # Account polymorphic resolver
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   ├── orderRoutes.js        # /api/orders
│   │   │   ├── productRoutes.js      # /api/products (including reviews & categories)
│   │   │   └── wishlistRoutes.js     # /api/wishlist
│   │   ├── utils/
│   │   │   └── generateToken.js      # JWT token signer
│   │   ├── app.js                    # Express app, CORS, parsers & route mounting
│   │   └── server.js                 # HTTP server listening on port
│   ├── uploads/                      # Uploaded product image storage
│   ├── .env.example                  # Backend environment variables template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.jsx            # Modern marketplace footer with trust badges
│   │   │   ├── Navbar.jsx            # Sticky glassmorphism header & navigation
│   │   │   ├── ProductCard.jsx       # Interactive product card with wishlist & badge
│   │   │   ├── ProductForm.jsx       # Multi-section product creation & edit form
│   │   │   └── ProtectedRoute.jsx    # Role-based route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state & session persistence
│   │   │   ├── CartContext.jsx       # Shopping cart & totals calculation
│   │   │   └── WishlistContext.jsx   # Wishlist state & optimistic toggle
│   │   ├── pages/
│   │   │   ├── seller/
│   │   │   │   ├── SellerDashboard.jsx # Revenue metrics & recent activity
│   │   │   │   ├── SellerOrders.jsx    # Order fulfillment & status updates
│   │   │   │   └── SellerProducts.jsx  # Inventory management & search
│   │   │   ├── Cart.jsx              # Cart page with shipping progress bar
│   │   │   ├── Checkout.jsx          # Multi-step checkout & payment selector
│   │   │   ├── Home.jsx              # Hero banner, category pills & catalog
│   │   │   ├── Login.jsx             # Customer / Seller login
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   ├── ProductDetails.jsx    # Image gallery, variants & customer reviews
│   │   │   ├── Profile.jsx           # Order history & delivery addresses
│   │   │   ├── Register.jsx          # New user registration
│   │   │   └── Wishlist.jsx          # Customer saved items page
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   ├── utils/
│   │   │   └── formatters.js         # Currency & date formatters
│   │   ├── App.jsx                   # Route declarations & layout shell
│   │   ├── index.css                 # Tailwind CSS v4 design system & typography
│   │   └── main.jsx                  # React DOM root with context providers
│   ├── index.html                    # SEO headers & Google Fonts (Outfit / Plus Jakarta)
│   ├── .env.example                  # Frontend environment variables template
│   ├── package.json
│   ├── vercel.json                   # SPA routing redirects for Vercel
│   ├── vite.config.js
│   └── README.md
│
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone & Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Files

**Backend (`backend/.env`)**:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
NODE_ENV=development
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Applications

In terminal 1 (Backend):
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📦 Deployment Guide

### Deploying the Backend (Render / Railway / Fly.io)
1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set the **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `node src/server.js`
6. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default for your host)
   - `MONGO_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure random secret string
   - `CLIENT_URL`: The URL of your deployed frontend (e.g. `https://shopsphere.vercel.app`)
   - `SERVER_URL`: The URL of your deployed backend service (e.g. `https://shopsphere-api.onrender.com`)

### Deploying the Frontend (Vercel / Netlify)
1. Create a new project on [Vercel](https://vercel.com).
2. Link your GitHub repository and set the **Root Directory** to `frontend`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend API endpoint, e.g. `https://shopsphere-api.onrender.com/api`
7. Deploy! Deep links are automatically handled by the included `frontend/vercel.json`.

---

## 🏷️ Adding Rich Product Details as a Seller

When creating or updating products in the **Seller Hub**, provide complete specifications for maximum buyer conversion:
1. **Title & Brand**: Clear product identification and certified manufacturer name.
2. **Category**: Choose from popular suggestions (Electronics, Fashion, Home, etc.) or type a custom category.
3. **Selling Price vs. Original Price**: Entering an original price automatically generates an eye-catching discount badge (e.g., `-25%`).
4. **Stock Units & SKU**: Inventory quantity for real-time stock protection and custom warehouse SKU.
5. **Variants**:
   - **Colors**: Enter comma-separated color choices (e.g., `Midnight Blue, Starlight, Space Gray`).
   - **Sizes**: Enter comma-separated sizes (e.g., `S, M, L, XL` or `128GB, 256GB`).
6. **Search Tags**: Enter comma-separated discovery tags (e.g., `Wireless, Water-Resistant, Trending`).
7. **Key Highlights**: Enter one bulleted feature per line for customer checklist previews.
8. **Multi-Image Gallery**: Upload up to 5 high-resolution photos with individual remove triggers and instant previews.

---

## 🔒 Security & Data Integrity
- **Password Encryption**: 12-round salted Bcrypt hashing.
- **JWT Authorization**: Signed bearer token verification on all protected endpoints.
- **Stock Protection**: Atomic reservation during checkout (`$gte` query with `$inc`) prevents race conditions and overselling.
- **Input Sanitization**: Express-validator middleware on all mutation endpoints.