# System Design Document: Stella Apparel E-Commerce Platform

## 1. Executive Summary & System Overview

**Stella** is a high-performance, modular apparel e-commerce web platform engineered for modern retail. The application blends architectural minimalism with production-grade modularity, catering to domestic (India) and international consumers with real-time Indian Rupee (INR ₹) pricing, multi-attribute filtering, interactive shopping carts, streamlined checkout pipelines, and persistent database synchronization with **Supabase PostgreSQL & Object Storage**.

---

## 2. High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                      |
|                                                                                       |
|   +-------------------+  +--------------------+  +------------------+  +----------+   |
|   | Storefront / Hero |  | Product Detail PDP |  | Cart / Wishlist  |  | Checkout |   |
|   +-------------------+  +--------------------+  +------------------+  +----------+   |
|   +-------------------+  +--------------------+  +------------------+                 |
|   | Account / Profile |  | Auth / Google Oauth|  | Toast Feedback   |                 |
|   +-------------------+  +--------------------+  +------------------+                 |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                           DECOUPLED SERVICE LAYER & API BUS                            |
|                                                                                       |
|   +-------------------+  +-------------------+  +-------------------+                 |
|   |  Product Service  |  |   User Service    |  |   Cart Service    |                 |
|   +-------------------+  +-------------------+  +-------------------+                 |
|   +-------------------+  +-------------------+  +-------------------+                 |
|   | Wishlist Service  |  | Checkout Service  |  |   Order Service   |                 |
|   +-------------------+  +-------------------+  +-------------------+                 |
|   +-----------------------------------------------------------------+                 |
|   |             Auth & Storage Service (Supabase SDK Wrapper)       |                 |
|   +-----------------------------------------------------------------+                 |
|   +-----------------------------------------------------------------+                 |
|   |      API Bus / Telemetry Logger (Status, Latency & Error Trace)  |                 |
|   +-----------------------------------------------------------------+                 |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                                 PERSISTENCE TIER                                      |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                             SUPABASE POSTGRESQL                               |   |
|   |  • public.users               • public.addresses                              |   |
|   |  • public.products            • public.cart_items                             |   |
|   |  • public.wishlist_items      • public.orders                                 |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                           SUPABASE OBJECT STORAGE                             |   |
|   |  • avatars/ (User Photos)     • product-images/ (Clothing Media)              |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                            SUPABASE AUTH & OAUTH                              |   |
|   |  • Email / Password           • Google (Gmail) OAuth                          |   |
|   |  • Password Recovery API      • JWT Token Verification                        |   |
|   +-------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack
- **Framework**: React 18 (Functional Components & Hooks)
- **Language**: TypeScript 5.x
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Minimalist neutral palette, slate-900 typography, teal accents)
- **Icons**: Lucide React

### 3.2 Component Hierarchy & Responsibilities
- **`App.tsx`**: Top-level root orchestrator managing active viewport views (`storefront`, `wishlist`, `checkout`, `account`), global toast feedback, and active user session.
- **`Navbar.tsx`**: Customer navigation bar with brand emblem, search input, currency badge (INR ₹), shopping bag count, wishlist counter, user avatar, and authentication modal trigger.
- **`HeroBanner.tsx`**: High-fashion visual showcase highlighting collections, seasonal themes, and smooth-scroll call-to-actions.
- **`FilterSidebar.tsx`**: Dynamic faceted filtering engine supporting multi-select categories, brands, clothing sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`), colors, price ranges, and minimum rating thresholds.
- **`ProductCard.tsx`**: Responsive garment card with sale badges, stock indicators, dynamic color swatch preview, quick bag insertion, and PDP modal launch.
- **`ProductDetailsModal.tsx`**: Comprehensive Product Display Page (PDP) modal with size selector, color switcher, material breakdown, stock validation, and "Buy Now" direct checkout trigger.
- **`CartDrawerOrPage.tsx`**: Slide-out shopping bag drawer with quantity adjustment, item deletion, subtotal calculations, dynamic shipping fee computation (Free over ₹999), and GST breakdown.
- **`WishlistPage.tsx`**: Dedicated customer wishlist view with one-click garment migration into the shopping bag.
- **`CheckoutFlow.tsx`**: 4-step linear checkout funnel:
  1. Delivery Address selection / creation.
  2. Order Review & Express Dispatch method.
  3. Secure Payment (UPI, Credit/Debit Cards, Cash on Delivery).
  4. Instant Order Confirmation receipt & summary.
- **`UserAccount.tsx`**: Customer portal displaying shipment history, saved delivery addresses, profile management, and direct profile photo upload.
- **`AuthModal.tsx`**: Tabbed authentication modal handling customer sign-in, account creation, Google / Gmail login, and forgot password recovery.

---

## 4. Microservices & Domain Service Layer

The application enforces strict separation of concerns through isolated domain services. Each service exposes clean asynchronous API methods and emits request/response traces through the central `apiBus`.

### 4.1 Product Service (`productService.ts`)
- `getProducts(filters)`: Executes query matching across categories, brand lists, size arrays, price bounds, and ratings.
- `getProductById(id)`: Fetches individual item specifications.
- `checkStock(id, size, quantity)`: Pre-purchase inventory validation.

### 4.2 User Service (`userService.ts`)
- `getCurrentUser()` / `setCurrentUserId(id)`: Manages active customer session context.
- `getUserById(id)` / `updateUser(id, updates)`: Retrieves and synchronizes customer profile data with Supabase `public.users`.
- `addAddress(id, address)` / `deleteAddress(id, addrId)`: Manages shipping addresses in `public.addresses`.

### 4.3 Cart & Wishlist Services (`cartService.ts`, `wishlistService.ts`)
- `addItem(userId, product, size, color, qty)`: Adds items with optimistic local calculation and Supabase synchronization.
- `updateItemQuantity(userId, itemId, qty)`: Recalculates line-item subtotal and GST.
- `toggleWishlist(userId, product)`: Atomic addition/removal with unique user-product constraint.

### 4.4 Checkout & Order Services (`checkoutService.ts`, `orderService.ts`)
- `processCheckout(request)`: Freezes pricing, calculates delivery ETA (2-4 business days), verifies payment token, and transitions cart items into confirmed orders.
- `getOrdersByUser(userId)`: Fetches customer order history from Supabase `public.orders`.
- `cancelOrder(orderId)`: Cancels pending or processing shipments.

### 4.5 Auth & Storage Service (`authAndStorageService.ts`)
- `signUp(params)`: Registers customer with Supabase Auth and inserts profile into `public.users`.
- `signIn(email, password)`: Authenticates credentials against Supabase Auth.
- `signInWithGoogle(email?)`: Executes Google OAuth with `skipBrowserRedirect: true` for safe, error-free customer onboarding.
- `uploadImage(file, bucket)`: Streams profile avatars to Supabase Storage bucket (`avatars/`) and generates public CDN URLs.
- `resetPasswordForEmail(email)`: Dispatches password recovery requests via Supabase `/auth/v1/recover`.

---

## 5. Database Schema & Data Models

### 5.1 Relational Schema Diagram (PostgreSQL)

```
+--------------------+        +---------------------+
|    public.users    | 1    * |  public.addresses   |
+--------------------+--------+---------------------+
| id (PK)            |        | id (PK)             |
| name               |        | user_id (FK)        |
| email (UNIQUE)     |        | full_name           |
| phone              |        | phone_number        |
| avatar_url         |        | street, city, state |
| role               |        | postal_code         |
| created_at         |        | country, is_default |
+---------+----------+        +---------------------+
          |
          | 1
          |
          +-------------------+---------------------+
          | *                 | *                   | *
+---------v----------+ +------v-------------+ +-----v---------------+
| public.cart_items  | | public.wishlist    | |    public.orders    |
+--------------------+ +--------------------+ +---------------------+
| id (PK)            | | id (PK)            | | id (PK)             |
| user_id            | | user_id            | | user_id             |
| product_id (FK)    | | product_id (FK)    | | customer_name       |
| size               | | added_at           | | customer_email      |
| color (JSONB)      | +---------+----------+ | items (JSONB)       |
| quantity           |           |            | shipping_addr (JSONB|
| unit_price         |           |            | subtotal, discount  |
| discount_price     |           |            | shipping, tax, total|
| added_at           |           |            | payment_method      |
+---------+----------+           |            | payment_status      |
          |                      |            | order_status        |
          +----------+-----------+            | estimated_delivery  |
                     |                        | created_at          |
                     | *                      +---------------------+
           +---------v----------+
           |  public.products   |
           +--------------------+
           | id (PK)            |
           | name, category     |
           | brand, description |
           | price, disc_price  |
           | available_sizes [] |
           | available_colors {}|
           | stock, rating      |
           | reviews_count      |
           | status, material   |
           | image_url          |
           +--------------------+
```

### 5.2 Storage Buckets
1. **`avatars`**: Stores user profile pictures uploaded from the account dashboard or registration flow.
2. **`product-images`**: Houses high-resolution apparel catalog photos.

---

## 6. Security, Authentication & Data Protection

1. **Password Encryption & Authentication**:
   - Built on Supabase Auth (Argon2 / bcrypt password hashing with salted keys).
   - Session verification using standard Bearer JWT tokens.
2. **Row Level Security (RLS)**:
   - RLS enabled across all database tables (`products`, `users`, `addresses`, `cart_items`, `wishlist_items`, `orders`).
   - Public read permissions for products and storage objects; authenticated user access for carts, addresses, and orders.
3. **File Upload Restrictions**:
   - Client-side size checks capped at 5MB.
   - MIME-type validation accepting only standard image formats (`image/jpeg`, `image/png`, `image/webp`).
4. **OAuth Resilience**:
   - Google Sign-In employs `skipBrowserRedirect: true` to prevent external redirect crashes if 3rd-party OAuth providers are pending configuration in the Supabase console.

---

## 7. Payment & Checkout Pipeline

### Supported Payment Channels:
1. **UPI (Unified Payments Interface)**:
   - Optimized for Indian shoppers (Google Pay, PhonePe, Paytm, BHIM).
   - Virtual Payment Address (VPA) validation (e.g., `user@okhdfcbank`, `user@ybl`).
2. **Credit & Debit Cards**:
   - RuPay, Visa, Mastercard, and American Express.
   - 256-bit SSL encrypted mock processing.
3. **Cash on Delivery (COD)**:
   - Zero advance payment required; payment collected in cash or QR scan on arrival.

---

## 8. Performance Optimization & Resilience

1. **Instant Offline & Local Fallback**:
   - If Supabase environment variables are missing or temporarily unreachable, services seamlessly fall back to client-side in-memory mock stores without blocking customer checkout.
2. **Database Performance Indexing**:
   - B-tree indexing applied on `products(category)`, `products(brand)`, `products(price)`, and `products(status)`.
3. **Idempotent Database Migrations**:
   - The `/supabase/schema.sql` migration file uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS` constructs, ensuring safe, repeatable execution in the Supabase SQL editor.
