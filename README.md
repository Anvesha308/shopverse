# Shopverse — Mini Amazon/Flipkart E-Commerce Platform

A full-stack e-commerce demo built with **Spring Boot + Spring Security (JWT) + MySQL** on the backend and **React + Vite + Tailwind CSS** on the frontend.

It demonstrates: REST API design, JWT authentication & role-based authorization, cart/order business logic, a simulated payment gateway flow, and product search/filtering — wrapped in a bright, responsive, interactive UI.

---

## Project structure

```
ecommerce-platform/
├── backend/          Spring Boot API (Java 17, Maven)
└── frontend/          React app (Vite, Tailwind CSS v4)
```

---

## 1. Backend setup (Spring Boot + MySQL)

### Prerequisites
- Java 17+
- Maven 3.8+ (or use your IDE's built-in Maven)
- MySQL 8+ running locally

### Step 1 — Create the database
The app auto-creates the schema on first run (`createDatabaseIfNotExist=true` + `ddl-auto=update`), so you just need MySQL running. Optionally create it yourself:
```sql
CREATE DATABASE shopverse_db;
```

### Step 2 — Configure credentials
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```
Also change `jwt.secret` to your own random 32+ byte string before any real deployment.

### Step 3 — Run it
```bash
cd backend
mvn spring-boot:run
```
The API starts on **http://localhost:8080**. On first run, `data.sql` seeds 6 categories and 16 sample products automatically.

### Key API endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account, returns JWT |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/products` | Public | Search/filter/paginate products (`keyword`, `categoryId`, `minPrice`, `maxPrice`, `page`, `size`, `sort`) |
| GET | `/api/products/{id}` | Public | Product detail |
| POST/PUT/DELETE | `/api/products/**` | SELLER/ADMIN | Manage products |
| GET | `/api/categories` | Public | List categories |
| GET/POST/PUT/DELETE | `/api/cart/**` | Authenticated | View/add/update/remove cart items |
| POST | `/api/orders/checkout` | Authenticated | Convert cart → order (reserves stock) |
| GET | `/api/orders` / `/api/orders/{id}` | Authenticated | Order history & detail |
| POST | `/api/payments/verify` | Authenticated | Simulated payment gateway confirmation |

Send the JWT as `Authorization: Bearer <token>` on authenticated requests.

> **Note on payments:** `PaymentServiceImpl` simulates a gateway (like Razorpay/Stripe) for demo purposes — it never contacts a real processor. Swap its internals for a real provider SDK/webhook verification before going to production.

---

## 2. Frontend setup (React + Vite)

### Prerequisites
- Node.js 18+

### Step 1 — Install dependencies
```bash
cd frontend
npm install
```

### Step 2 — Run the dev server
```bash
npm run dev
```
The app starts on **http://localhost:5173** and proxies all `/api/*` calls to the backend at `http://localhost:8080` (see `vite.config.js`), so make sure the backend is running first.

### Step 3 — Build for production
```bash
npm run build
```
Outputs static files to `frontend/dist`, ready to deploy behind any static host or reverse proxy (point it at your backend for `/api`).

---

## Running with Docker

The whole stack (MySQL + backend + frontend behind nginx) can run via Docker Compose — no local Java/Node/MySQL needed.

### Prerequisites
- Docker Desktop (with Compose)

### Steps
```bash
cp .env.example .env   # then edit MYSQL_ROOT_PASSWORD and JWT_SECRET
docker compose up --build
```
- Frontend: **http://localhost:5173** (nginx, proxies `/api` to the backend container)
- Backend API: **http://localhost:8080**
- MySQL data persists in the `mysql_data` volume between runs.

To stop: `docker compose down` (add `-v` to also drop the MySQL volume/data).

---

## 3. Trying it out

1. Start MySQL, then the backend (`mvn spring-boot:run`), then the frontend (`npm run dev`).
2. Open http://localhost:5173 — you'll see seeded products immediately (browsing/search works without login).
3. Register an account, add items to your cart, go to **Checkout**.
4. On the payment step, click **Simulate Success** or **Simulate Failure** to see the full order lifecycle (stock reservation, payment status, auto-restock on failure).
5. Check **My Orders** to see order history and status.

---

## Design notes

- **Auth:** stateless JWT via Spring Security, `BCrypt` password hashing, role-based endpoint protection (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`).
- **Cart/Order logic:** stock is validated and reserved at checkout; a failed simulated payment automatically restocks the reserved items and cancels the order.
- **Search:** dynamic JPA query supporting keyword (name/brand/description), category, and price-range filtering with pagination and sorting.
- **Frontend design system:** indigo/violet brand color with sunflower-yellow CTAs and coral discount tags, "Space Grotesk" display type paired with "Inter" body text and tabular "JetBrains Mono" pricing, and a signature notched price-tag badge on discounted products.

## Extending this project
- Add product image upload (S3/local storage) instead of URL strings.
- Add an admin dashboard UI for seller/admin product management (the API already supports it).
- Swap the simulated payment service for a real Razorpay/Stripe integration.
- Add product reviews, wishlists, and order tracking/status webhooks.
