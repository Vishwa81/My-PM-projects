# Ludhiana Bistro – Restaurant Review Portal (Zamato Lite)

A production-ready, full-stack restaurant review and discovery application built for **Ludhiana Bistro**, featured within the **Zamato Lite** food-tech platform.

Live, verified dining feedback powered by **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Neon Lakebase PostgreSQL** with **Drizzle ORM**.

---

## 🌟 Features

- **Restaurant Showcase**: High-resolution imagery, cuisine details (*North Indian, Punjabi*), location (*Feroze Gandhi Market, Ludhiana*), price point (*₹800 for two*), and live operational status.
- **Dynamic Rating Overview**: Real-time average star calculation, total review count, and full 5-star distribution progress bars computed on-the-fly from PostgreSQL database records.
- **Interactive Review Filtering & Sorting**:
  - Filter by star ratings: All, 5 Stars, 4 Stars, 3 Stars, 2 Stars, 1 Star.
  - Sort by: Most Recent, Oldest First, Highest Rated, Lowest Rated.
  - Real-time keyword search across review titles and comments with debouncing.
- **Review Submission Modal**:
  - Interactive 5-star rating selector with hover preview and accessibility labels.
  - Customer name and verified email validation (emails are kept strictly private and never exposed publicly).
  - Optional review title and detailed review text (minimum 10 characters, maximum 1,000 characters with live character counter).
  - Anti-spam & rate limiting protection to prevent spam submissions.
  - Instant optimistic/live refresh of reviews and rating metrics upon submission.
- **Helpful Counter**: Interactive customer feedback on each review.
- **Fully Responsive**: Mobile-first design tailored for phones, tablets, and wide-screen desktops.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend**: Next.js Route Handlers, Server-Side Validation with Zod, SQL parameterization.
- **Database**: Neon Lakebase PostgreSQL (Serverless connection pooling via `@neondatabase/serverless`).
- **ORM & Migrations**: Drizzle ORM & Drizzle Kit.
- **Hosting & CI/CD**: GitHub & Vercel.

---

## 🗄️ Database Architecture

The application connects to a Neon PostgreSQL instance with the following schema:

### `restaurants`
| Column | Type | Description |
|---|---|---|
| `id` | `UUID` (PK) | Primary unique identifier |
| `name` | `VARCHAR(255)` | Name of the bistro |
| `description` | `TEXT` | Detailed restaurant description |
| `cuisine` | `VARCHAR(255)` | Cuisine tags (e.g., North Indian, Punjabi) |
| `address` | `TEXT` | Configurable physical address |
| `image_url` | `TEXT` | Restaurant cover banner image URL |
| `price_range` | `VARCHAR(50)` | Price tier indicator |
| `created_at` | `TIMESTAMPTZ` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Record modification timestamp |

### `customers`
| Column | Type | Description |
|---|---|---|
| `id` | `UUID` (PK) | Primary unique identifier |
| `name` | `VARCHAR(255)` | Full customer name |
| `email` | `VARCHAR(255)` (Unique) | Customer email (private, never returned in APIs) |
| `avatar_url` | `TEXT` | Profile avatar URL |
| `created_at` | `TIMESTAMPTZ` | Registration timestamp |

### `reviews`
| Column | Type | Description |
|---|---|---|
| `id` | `UUID` (PK) | Primary unique identifier |
| `restaurant_id` | `UUID` (FK) | Reference to `restaurants.id` |
| `customer_id` | `UUID` (FK) | Reference to `customers.id` |
| `rating` | `INTEGER` | Rating between 1 and 5 (enforced by CHECK constraint) |
| `title` | `VARCHAR(255)` | Optional review title |
| `comment` | `TEXT` | Detailed review text |
| `status` | `VARCHAR(50)` | Status (default: `published`) |
| `helpful_count` | `INTEGER` | Helpful votes (default: 0) |
| `created_at` | `TIMESTAMPTZ` | Review date |
| `updated_at` | `TIMESTAMPTZ` | Last updated date |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with Node 20 / 22 / 24)
- An active Neon PostgreSQL database connection string

### 2. Installation
```bash
git clone <repository-url>
cd ludhiana-bistro
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
```

### 4. Database Setup & Seeding
To initialize tables, indexes, and seed demo reviews:
```bash
node scripts/setup-db.mjs
```

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

- `GET /api/restaurants` – Returns restaurant details.
- `GET /api/restaurants/[id]/rating-summary` – Dynamic calculation of average rating, total count, and distribution.
- `GET /api/restaurants/[id]/reviews?rating=5&sort=newest&page=1&limit=10&search=butter` – Paginated, filterable, searchable reviews list.
- `POST /api/restaurants/[id]/reviews` – Submits a validated review and returns the created record and recalculated summary.

---

## 🔒 Security & Performance Highlights

- **Server-Side Validation**: All review submissions are strictly validated using Zod schemas.
- **Privacy First**: Customer email addresses are never returned in public API payloads or HTML responses.
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM and Neon driver.
- **Rate Limiting**: Anti-spam protection prevents duplicate rapid submissions from the same user.
- **Server Component Rendering**: Initial page load uses server-side data fetching for blazing fast performance and SEO.
