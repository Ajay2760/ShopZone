# E-Commerce Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern e-commerce leaders (Shopify, Amazon, Flipkart) with emphasis on visual commerce and Indian market aesthetics. Focus on product discovery, trust-building, and seamless shopping experience.

## Core Design Principles
- **Product-First**: Visual hierarchy emphasizes product imagery and availability
- **Trust & Clarity**: Clear pricing in ₹, stock indicators, and order status visibility
- **Efficient Navigation**: Quick access to cart, wishlist, and account features
- **Status Communication**: Visual feedback for stock levels, order progression, and admin actions

## Color Palette

**Light Mode:**
- Primary Brand: 230 60% 45% (rich indigo-blue for trust and commerce)
- Secondary: 45 95% 55% (warm amber for accents, CTAs, badges)
- Success: 142 70% 45% (product availability, confirmed orders)
- Warning: 30 95% 55% (low stock alerts)
- Danger: 0 70% 50% (out of stock, remove actions)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%

**Dark Mode:**
- Primary: 230 50% 60%
- Secondary: 45 90% 65%
- Success: 142 60% 55%
- Background: 220 15% 10%
- Surface: 220 12% 15%
- Text Primary: 0 0% 95%

## Typography
- **Primary Font**: Inter (Google Fonts) - clean, modern, excellent for commerce
- **Headings**: Font weights 700-800, tracking tight for impact
- **Product Names**: Font weight 600, size responsive (text-base to text-lg)
- **Prices**: Font weight 700, tabular numbers for alignment
- **Body**: Font weight 400-500, comfortable reading (text-sm to text-base)

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 consistently
- Compact spacing (p-2, gap-2): Product cards, badges, small UI elements
- Standard spacing (p-4, gap-4, m-4): Form fields, buttons, list items
- Generous spacing (p-8, py-12, gap-8): Section padding, grid layouts
- Major spacing (py-16, py-20): Page sections, headers

## Component Library

### Navigation & Header
- **Top Bar**: Sticky navigation with logo, search bar (prominent center), cart icon with badge count, wishlist icon with count, "My Account" dropdown
- **Search Bar**: Full-width on mobile, max-w-2xl on desktop with search icon and filters dropdown
- **Account Dropdown**: Smooth dropdown revealing Dashboard, Orders, Wishlist, Logout
- **Category Navigation**: Horizontal scrollable tabs or mega-menu on hover

### Product Components
- **Product Grid**: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 with consistent gap-4
- **Product Card**: 
  - Aspect-ratio-square image container with hover scale effect
  - Stock badge (top-right corner): Green "In Stock (X)", Red "Out of Stock", Amber "Low Stock (X)"
  - Product name, category tag, rating stars
  - Price in ₹ with font-bold, old price with line-through if discounted
  - Dual action buttons: "Add to Cart" (disabled if stock=0), Heart icon for wishlist (disabled if stock=0)
- **Product Detail View**: Large image gallery, detailed specs, prominent stock indicator, quantity selector

### Cart & Wishlist
- **Cart Page**: Table layout on desktop (Product | Price | Quantity | Subtotal), stacked cards on mobile
- **Quantity Controls**: Bordered input with +/- buttons, max controlled by stock
- **Wishlist Grid**: Similar to product grid with "Move to Cart" action (disabled for out-of-stock)
- **Summary Card**: Sticky on desktop showing subtotal, delivery estimates, total in ₹

### Checkout Flow
- **Address Selection**: Radio cards showing saved addresses with "Edit" and "Delete" actions
- **Add New Address**: Inline form or modal with Indian address format (pincode, state, city)
- **Order Review**: Clear product summary, selected address display, final pricing breakdown
- **Confirmation CTA**: Large, prominent button "Confirm Order" with security/trust badges

### Order Management
- **Order History**: Timeline cards showing order number, date, items preview, total ₹, current status
- **Status Badge**: Pill-shaped badges with colors:
  - "On Process": Amber background
  - "Shipped": Blue background  
  - "Delivered": Green background
- **Order Detail**: Expandable sections showing items, address, status timeline with icons

### Admin Panel
- **Order List Table**: Sortable columns (Order ID, Customer, Date, Total, Status)
- **Status Dropdown**: Inline editable select for each order with immediate save
- **Admin Navigation**: Sidebar with Products, Orders, Categories sections
- **Product Management**: Add/Edit forms with stock quantity input, category selection

### Authentication
- **Login Modal**: Centered card with Google OAuth button, clean white background
- **OAuth Button**: Google brand colors, icon + "Continue with Google" text

## Images

**Hero Section**: 
- Full-width hero banner (h-[500px] lg:h-[600px]) featuring lifestyle product photography
- Overlay gradient for text readability
- Image: Vibrant shopping scene with diverse products or happy customers with shopping bags
- CTA buttons with backdrop-blur-sm bg-white/10 treatment

**Product Images**:
- Square aspect ratio (1:1) for grid consistency
- White/light gray backgrounds for product clarity
- Hover: subtle zoom effect (scale-105)

**Category Banners**:
- Wide rectangular cards for category navigation
- Images: Category-specific lifestyle or product collections

**Trust Elements**:
- Small icons/badges: Secure checkout, easy returns, quality guarantee
- Placement: Below hero, in footer, checkout page

## Animations & Interactions
- **Minimal Motion**: Subtle hover scales (scale-105), smooth color transitions
- **Cart Badge**: Gentle bounce animation when item added
- **Status Updates**: Toast notification with slide-in effect
- **Stock Indicators**: Pulse animation for "Low Stock" badges
- **Disabled States**: 50% opacity with cursor-not-allowed, clear visual feedback

## Responsive Breakpoints
- Mobile: Single column product grid, stacked checkout
- Tablet (md): 2-3 column grid, side-by-side cart summary
- Desktop (lg+): 4 column grid, sticky cart summary, expanded navigation

## Accessibility
- High contrast ratios (4.5:1 minimum) for all text
- Focus rings on all interactive elements
- Clear disabled states with aria-disabled
- Stock status announced to screen readers
- Form labels properly associated