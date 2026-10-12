# ATELIER & CO. — Modern Frontend-Only E-Commerce Application

A complete, high-fidelity, and responsive e-commerce application built with **Next.js App Router, React, and Tailwind CSS**.

This project is **100% frontend-only**. All features run locally using dummy datasets, React Context API, and browser `LocalStorage` persistence. No backend, database, or network requests are required.

---

## 🌟 Key Features

### 1. Storefront & Exploration
- **Announcement Bar**: Free shipping notifications, seasonal promo codes, and dismissible state.
- **Responsive Navigation**: Brand identity, desktop navigation links, category dropdown, search input, live wishlist and cart badges, user account menu, and mobile navigation drawer.
- **Editorial Homepage (`/`)**:
  - Hero banner with call-to-actions and capsule highlights.
  - Department cards across 6 distinct categories.
  - Featured products grid with discount badges.
  - Archival promotional banner with quick shopping links.
  - New Arrivals and Best Sellers showcase.
  - Client testimonial review cards.
  - Newsletter subscription form with input validation and local feedback.
- **Product Catalog (`/products`)**:
  - Full-text search by title, category, or description.
  - Category filters, min/max price sliders, rating filters, on-sale toggle, and in-stock toggle.
  - Sorting (Featured, Newest, Price Low-High, Price High-Low, Popularity, Rating).
  - Responsive mobile filter drawer.
  - Load More pagination.
- **Category Portals (`/categories/[slug]`)**: Dedicated department pages with category heroes and filtered inventory.
- **Product Details (`/products/[id]`)**:
  - Interactive multi-image gallery with thumbnail selection.
  - Centralized discount calculation and percentage badges.
  - Size and color variant selectors.
  - Stock limit checks on quantity controls.
  - Client reviews list and related product recommendations.
  - 404 fallback for non-existent IDs.

### 2. Shopping Bag, Wishlist & Checkout
- **Shopping Bag (`/cart`)**:
  - Dynamic line item quantity increment/decrement with stock constraints.
  - Real-time subtotal, discount savings, and free shipping threshold calculation.
  - Empty cart state with quick navigation.
- **Wishlist (`/wishlist`)**:
  - Heart toggle from any product card or detail page.
  - Grid of saved products with single-click "Move to Bag" action.
- **Demo Checkout (`/checkout`)**:
  - Customer contact and multi-field delivery address validation.
  - Simulated payment options (Demo Credit Card, Apple Pay, PayPal).
  - Local order creation with unique ID generation (e.g., `ORD-XXXXX`).
  - Polished confirmation screen and cart reset.

### 3. Customer Account & Authentication
- **Simulated Authentication (`/login`, `/register`)**:
  - Password visibility toggles, required-field checks, email validation.
  - One-click demo credentials autofill (`julian.sterling@example.com` / `password123`).
- **Customer Account (`/account`)**:
  - Profile details editor.
  - Delivery address book with "Add Address" modal.
  - Demo order history with live fulfillment status badges.

### 4. Admin Management Dashboard
- **Dashboard Layout (`/dashboard`)**: Dedicated sidebar and header separate from the main storefront.
- **Overview (`/dashboard`)**:
  - High-level KPIs (Total Revenue, Orders, Products, Customers).
  - Interactive monthly revenue bar chart.
  - Recent transactions table and best-selling goods list.
  - Real-time activity feed.
- **Inventory CRUD (`/dashboard/products`)**:
  - Search and category filters.
  - "Add Product" and "Edit Product" modal forms.
  - "Delete Product" confirmation modal.
  - Local state updates that reflect immediately in the storefront catalog.
- **Fulfillment Management (`/dashboard/orders`)**:
  - Order table with status filter.
  - Order inspection modal with items breakdown.
  - Local status updates (`Processing`, `Shipped`, `Delivered`).
- **Customer Directory (`/dashboard/customers`)**: Shopper lifetime value and order metrics.
- **Store Configuration (`/dashboard/settings`)**: Editable store settings, tax rates, and free shipping thresholds.

### 5. Global Notification System
- Reusable toast notification container at top-right on desktop / top on mobile.
- `useNotification()` hook supporting `success`, `error`, `warning`, `info`, and `loading` alerts.
- Auto-dismissal and manual dismiss buttons.
- Inline `Alert` component for forms.

---

## 🛠️ Project Structure

```text
src/
├── app/
│   ├── layout.jsx               # Root layout with providers & global toasts
│   ├── page.jsx                 # Editorial storefront homepage
│   ├── globals.css              # Custom styling, scrollbar, animations
│   ├── not-found.jsx            # Custom 404 page
│   ├── products/
│   │   ├── page.jsx             # Product catalog with search & filters
│   │   └── [id]/page.jsx        # Product detail with image gallery
│   ├── categories/[slug]/page.jsx # Category listing
│   ├── cart/page.jsx            # Shopping bag
│   ├── wishlist/page.jsx        # Saved pieces
│   ├── checkout/page.jsx        # Demo order placement
│   ├── login/page.jsx           # Sign in
│   ├── register/page.jsx        # Account registration
│   ├── account/page.jsx         # Customer profile & orders
│   └── dashboard/
│       ├── layout.jsx           # Dedicated admin sidebar & header
│       ├── page.jsx             # Overview & sales chart
│       ├── products/page.jsx    # Local inventory CRUD
│       ├── orders/page.jsx      # Order status management
│       ├── customers/page.jsx   # Customer registry
│       └── settings/page.jsx    # Store configuration
├── components/
│   ├── layout/                  # Navbar, AnnouncementBar, Footer, StoreLayoutWrapper
│   ├── home/                    # HeroSection, PromoBanner, TestimonialsSection
│   ├── products/                # ProductCard, ProductGrid, CategoryCard, Filters, Sort
│   ├── cart/                    # CartItem, OrderSummary
│   ├── dashboard/               # DashboardSidebar, DashboardNavbar, SalesChart
│   └── ui/                      # Button, Input, Modal, Alert, Notification, StatCard, Badges
├── context/
│   ├── CartContext.jsx          # Shopping bag state & calculations
│   ├── WishlistContext.jsx      # Wishlist state
│   ├── AuthContext.jsx          # Demo authentication session
│   ├── StoreContext.jsx         # Product catalog & order CRUD
│   └── NotificationContext.jsx  # Global toast alerts
├── data/
│   ├── products.js              # 18 curated items with realistic photography
│   ├── categories.js            # 6 departmental categories
│   ├── orders.js                # Initial demo orders
│   ├── customers.js             # Initial demo customers
│   ├── reviews.js               # Sample client reviews & testimonials
│   └── dashboard.js             # Overview analytics & monthly trends
├── hooks/
│   ├── useCart.js
│   ├── useWishlist.js
│   └── useNotification.js
└── utils/
    ├── calculateDiscount.js     # Exact discount calculation formula
    ├── formatCurrency.js        # Currency formatter
    └── storage.js               # Safe SSR-compatible LocalStorage helpers
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Verification
```bash
npm run build
npm start
```

---

## 🔌 Future Backend Integration

All integration points are labeled in the codebase with:
```javascript
// FUTURE BACKEND INTEGRATION:
// Replace this dummy product dataset / local state mutation with your backend API.
```

Major endpoints to connect later:
- `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- `POST /api/auth/login`, `POST /api/auth/register`
- `GET /api/cart`, `POST /api/cart/items`
- `POST /api/orders`, `GET /api/orders`
- `GET /api/admin/metrics`, `PATCH /api/admin/orders/:id/status`
