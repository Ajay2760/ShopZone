# ShopZone - E-Commerce Platform

A full-featured e-commerce platform with Google OAuth authentication, product management, shopping cart, wishlist, multi-address checkout, order tracking, and admin order management.

## Features Implemented

### Authentication
- **Google OAuth Login** via Firebase
- User profile with avatar and display name
- Protected routes for cart, wishlist, orders, and dashboard

### Product Catalog
- **16 products** across 5 categories (Electronics, Fashion, Home & Kitchen, Books, Sports)
- Product images from Unsplash
- **Dynamic search** by product name or description
- **Sorting options**: Name (A-Z), Price (Low to High), Price (High to Low), Stock Availability
- **Category filtering** via tabs
- Product details: name, description, price, original price (with discount %), stock count, ratings

### Stock Management
- **Real-time stock tracking** with visual badges:
  - Green "In Stock (X)" for items with stock ≥ 10
  - Amber "Low Stock (X)" for items with stock < 10
  - Red "Out of Stock" for items with stock = 0
- **Stock-based restrictions**:
  - Products with stock = 0 cannot be added to cart
  - Products with stock = 0 cannot be added to wishlist
  - Cart quantity limited by available stock
  - Stock decrements when orders are placed

### Shopping Cart
- Add/remove items
- Adjust quantity with stock validation
- Real-time subtotal calculation
- **Free shipping** on orders over ₹500
- Cart badge with item count in navbar

### Wishlist
- Add/remove products from wishlist
- Move items to cart (disabled for out-of-stock items)
- Wishlist badge with count in navbar
- Stock-based restrictions enforced

### Multi-Address Checkout
- **Save multiple delivery addresses** with Indian address format (pincode, state, city)
- Select delivery address during checkout
- Add new address via modal form
- Address validation using Zod schemas

### Order Management
- **Order confirmation** without payment gateway
- Default order status: "On Process"
- Order history with:
  - Order ID, date, items, total amount
  - Delivery address
  - Current status badge (color-coded)
- Real-time status updates visible to users

### Admin Dashboard
- **Admin panel** at `/admin` route
- View all orders from all customers
- **Edit order status** via dropdown:
  - "On Process" (Amber badge)
  - "Shipped" (Blue badge)
  - "Delivered" (Green badge)
- Order statistics (total orders, pending, delivered)

### User Dashboard
- Overview cards: Total Orders, Wishlist Items, Cart Items, Total Spent
- Recent orders summary
- Saved addresses display
- Quick navigation to all user features

### Currency
- All prices displayed in **Indian Rupees (₹)**
- Proper number formatting with comma separators

### Design System
- **Modern e-commerce aesthetic** based on design_guidelines.md
- Indigo-blue primary color for trust
- Amber secondary color for CTAs and highlights
- Fully responsive (mobile, tablet, desktop)
- Dark mode support with theme toggle
- Beautiful hero section with lifestyle image
- Consistent spacing, typography, and component usage
- Stock status badges with appropriate colors
- Loading and empty states

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Firebase for Google OAuth
- Tailwind CSS + Shadcn UI components
- Lucide icons

### Backend
- Express.js
- In-memory storage (MemStorage)
- Zod for validation
- RESTful API design

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart?userId={id}` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Wishlist
- `GET /api/wishlist?userId={id}` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders
- `GET /api/orders?userId={id}` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Addresses
- `GET /api/addresses?userId={id}` - Get user's addresses
- `POST /api/addresses` - Create new address

## Key Files

### Frontend
- `client/src/App.tsx` - Main app with routing
- `client/src/pages/Home.tsx` - Product catalog with search/filter/sort
- `client/src/pages/Cart.tsx` - Shopping cart page
- `client/src/pages/Wishlist.tsx` - Wishlist page
- `client/src/pages/Checkout.tsx` - Checkout with address selection
- `client/src/pages/Orders.tsx` - Order history
- `client/src/pages/Dashboard.tsx` - User dashboard
- `client/src/pages/Admin.tsx` - Admin order management
- `client/src/components/Navbar.tsx` - Navigation with user menu
- `client/src/components/ProductCard.tsx` - Product card with stock badges
- `client/src/contexts/AuthContext.tsx` - Firebase auth context
- `client/src/lib/firebase.ts` - Firebase configuration

### Backend
- `server/routes.ts` - All API endpoints
- `server/storage.ts` - In-memory data storage with seed data
- `shared/schema.ts` - TypeScript types and Zod schemas

### Configuration
- `design_guidelines.md` - Design system documentation
- `client/src/index.css` - Tailwind configuration with theme colors

## Firebase Configuration

Required environment variables (already configured):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

## Running the Project

The workflow `npm run dev` starts both the Express backend and Vite frontend on the same port.

## Future Enhancements

- Product reviews and ratings system
- Payment gateway integration (Razorpay/Stripe)
- Email notifications for order status changes
- Advanced admin dashboard with sales analytics
- Product filtering by price range and ratings
- Product detail pages with image galleries
- Order cancellation and returns
- Persistent database (PostgreSQL)
