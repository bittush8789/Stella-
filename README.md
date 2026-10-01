# ✦ Stella — Minimalist Apparel E-Commerce

> A modern, customer-first clothing e-commerce web platform engineered with **React 19**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL & Object Storage)**.

---

## 🌟 Highlights & Features

- **🛍️ Complete Customer Storefront**: Designed with architectural minimalism inspired by modern luxury apparel brands. Free from developer telemetry and clutter.
- **🔍 Faceted Search & Filtering**: Multi-attribute filtering across **10 garment categories**, brand selections, apparel sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`), color swatches, price sliders, and minimum customer ratings.
- **👗 Interactive Product Details (PDP)**: High-resolution previews, color variant switching, dynamic size selection, real-time stock counters, and one-click "Buy Now" flow.
- **👜 Slide-Out Shopping Bag**: Real-time line-item quantity controls, Indian Rupee (INR ₹) tax calculation (5% GST), and free shipping threshold calculation (Free over ₹999).
- **💳 4-Step Indian Checkout Funnel**:
  - **Step 1**: Delivery Address selection & custom address creation with PIN code validation.
  - **Step 2**: Shipping method review and express delivery dispatch.
  - **Step 3**: 256-bit encrypted payment supporting **UPI (Google Pay, PhonePe, Paytm)**, **Credit/Debit Cards (RuPay, Visa, Mastercard)**, and **Cash on Delivery (COD)**.
  - **Step 4**: Instant order confirmation receipt with tracking ID and estimated delivery date.
- **👤 Customer Account & Profile**:
  - View full order history and track shipments.
  - Manage multiple saved delivery addresses.
  - Direct profile photo upload powered by Supabase Object Storage (`avatars/` bucket).
- **🔐 Resilient Authentication**:
  - Email & password sign-up and sign-in.
  - **Continue with Google / Gmail** with safe in-app session handling.
  - In-app password recovery via Supabase `/auth/v1/recover`.
- **🐳 Production-Ready Docker**: Multi-stage, non-root Alpine Nginx container build (~25MB image).

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase Auth, Supabase Storage) |
| **Containerization** | Docker, Nginx Alpine, Docker Compose |

---

## 📂 Project Structure

```
├── .dockerignore                # Docker build exclusions
├── .env.example                 # Example environment variables template
├── Dockerfile                   # Multi-stage production Nginx Docker build
├── docker-compose.yml           # Microservices orchestration (Web + Redis Cache)
├── nginx.conf                   # Production Nginx SPA routing & caching configuration
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and build scripts
├── README.md                    # Project documentation
├── system-design.md             # Complete system architecture specifications
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── supabase/
│   └── schema.sql               # Idempotent PostgreSQL schema, RLS, and storage rules
└── src/
    ├── App.tsx                  # Root application orchestrator
    ├── main.tsx                 # React entry point
    ├── index.css                # Global stylesheet & Tailwind directives
    ├── components/              # Modular UI components
    │   ├── AuthModal.tsx        # Customer login, register & Google OAuth modal
    │   ├── CartDrawerOrPage.tsx # Shopping bag drawer
    │   ├── CheckoutFlow.tsx     # 4-Step checkout funnel (Address, Review, Pay, Confirm)
    │   ├── FilterSidebar.tsx    # Faceted catalog filter sidebar
    │   ├── Footer.tsx           # Customer-first brand footer & links
    │   ├── HeroBanner.tsx       # Autumn / Winter collection hero banner
    │   ├── Navbar.tsx           # Customer navigation header
    │   ├── ProductCard.tsx      # Garment item card with wishlist trigger
    │   ├── ProductDetailsModal.tsx # Full Product Details Page (PDP) modal
    │   ├── ProductPlaceholderImage.tsx # High-fidelity CSS/SVG garment artwork
    │   ├── UserAccount.tsx      # Customer account dashboard & orders
    │   └── WishlistPage.tsx     # Saved garments view
    ├── data/
    │   └── mockProducts.ts      # 50 curated apparel garments across 10 categories
    ├── lib/
    │   └── supabase.ts          # Supabase client singleton initialization
    ├── services/                # Decoupled domain service layer
    │   ├── apiBus.ts            # Central request logger & event bus
    │   ├── authAndStorageService.ts # Supabase Auth & Storage API wrapper
    │   ├── cartService.ts       # Cart calculation & management
    │   ├── checkoutService.ts   # Checkout payment validation & pipeline
    │   ├── orderService.ts      # Order persistence & lifecycle tracking
    │   ├── productService.ts    # Garment catalog query & stock validation
    │   ├── userService.ts       # Customer profile & address management
    │   └── wishlistService.ts   # Saved items & deduplication
    ├── types/
    │   └── microservices.ts     # TypeScript data contracts & models
    └── utils/
        └── currency.ts          # Indian Rupee (INR ₹) formatting utilities
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Node 20+ recommended)
- **npm** or **bun** / **yarn**

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/stella-apparel.git
cd stella-apparel

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Populate the Supabase connection keys:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```
*(Note: If Supabase keys are omitted, the application automatically falls back to client-side in-memory storage so you can test immediately).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup & Migrations

To initialize the database tables, security policies, and image storage buckets in Supabase:

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. In the left navigation, click on the **SQL Editor** (`>_`).
3. Click **"+ New query"**.
4. Copy the entire contents of **`/supabase/schema.sql`** and paste it into the editor.
5. Click **Run**.

### What gets created:
- **`public.users`**: Customer profiles, emails, phones, and avatar links.
- **`public.addresses`**: Multiple shipping addresses per customer.
- **`public.products`**: Garment catalog with sizes, colors, stock, and pricing.
- **`public.cart_items`**: Shopping bags referencing products.
- **`public.wishlist_items`**: Customer saved items with unique constraints.
- **`public.orders`**: Order records, payment methods, delivery addresses, and statuses.
- **`storage.buckets`**: `avatars` and `product-images` public buckets with storage access policies.
- **Row Level Security (RLS)**: Enforced across all tables.

---

## 🐳 Docker Containerization

### Build & Run Single Container
```bash
# 1. Build the production image (~25MB)
docker build \
  --build-arg VITE_SUPABASE_URL="https://your-project.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-anon-key" \
  -t stella-app:latest .

# 2. Run container on port 80
docker run -d -p 80:80 --name stella-web stella-app:latest
```
Visit `http://localhost`.

### Run with Docker Compose
```bash
docker compose up -d --build
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and builds production assets into `/dist` |
| `npm run preview` | Previews the compiled production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans previous build artifacts (`rm -rf dist`) |

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for personal or commercial projects.
