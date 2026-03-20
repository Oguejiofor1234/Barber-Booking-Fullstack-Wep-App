# ✂️ The Barber Shop — Full-Stack Web App

A production-ready barber shop website with online booking, media gallery, email notifications, Docker containerization, GitHub Actions CI/CD, and one-click deployment to Render.

---

## Tech Stack

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| Frontend      | React 18 + Vite + TailwindCSS           |
| Backend       | Node.js + Express.js                    |
| Database      | PostgreSQL + Prisma ORM                 |
| Auth          | JWT + bcrypt                            |
| Notifications | Nodemailer (email)                      |
| File Uploads  | Multer                                  |
| Calendar      | FullCalendar.io                         |
| Testing       | Jest + Supertest / Vitest + RTL         |
| Docker        | Docker + Docker Compose                 |
| CI/CD         | GitHub Actions                          |
| Deployment    | Render (free tier)                      |

---

## Features

- **Booking calendar** — customers select time slots, barber confirms/rejects, customer can cancel
- **Email notifications** — sent on booking request, confirmation, and cancellation
- **In-app notification bell** — unread count badge, mark all as read
- **Gallery** — barbers upload images/videos; public lightbox viewer with filters
- **Role-based auth** — CUSTOMER / BARBER / ADMIN with separate dashboards
- **Dashboard** — booking stats, filter by status, full action buttons per role
- **Mobile-responsive** — Tailwind CSS utility-first design

---

## Project Structure

```
barbershop/
├── frontend/               # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/     # Navbar, Hero, Services, Gallery, Footer, NotificationBell
│   │   ├── pages/          # Home, BookingPage, GalleryPage, Login, Register, Dashboard
│   │   ├── context/        # AuthContext (JWT state management)
│   │   ├── utils/          # api.js (axios instance + interceptors)
│   │   └── tests/          # Vitest + React Testing Library tests
│   ├── nginx.conf          # SPA fallback for nginx
│   └── Dockerfile          # Multi-stage: node build → nginx serve
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── routes/         # auth, bookings, gallery, notifications
│   │   ├── controllers/    # authController, bookingController, galleryController
│   │   ├── middleware/     # auth.js (JWT verify), upload.js (multer)
│   │   └── services/       # emailService.js (nodemailer templates)
│   ├── prisma/
│   │   ├── schema.prisma   # User, Booking, GalleryItem, Notification models
│   │   └── seed.js         # Seeds admin + barber users
│   ├── tests/              # Jest + Supertest tests
│   ├── .env.example        # Copy to .env and fill in values
│   └── Dockerfile          # Multi-stage: node deps → runtime
├── nginx/nginx.conf        # Reverse proxy: /api/* → backend, /* → frontend
├── docker-compose.yml      # Local dev stack (postgres + backend + frontend + nginx)
├── docker-compose.prod.yml # Production overrides (uses pre-built Docker images)
├── docker-compose.test.yml # CI test stack (isolated postgres_test)
└── .github/workflows/
    └── ci-cd.yml           # lint → test → build → push → deploy
```

---

## 1. Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL running locally

### Backend

```bash
cd backend
cp .env.example .env        # Fill in DATABASE_URL, JWT_SECRET, SMTP_* values
npm install
npx prisma migrate dev --name init
npx prisma db seed          # Creates admin + barber seed users
npm run dev                 # Starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # Starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` → `localhost:3001` automatically.

---

## 2. Running with Docker Compose (Recommended)

### Prerequisites
- Docker Desktop or Docker Engine + Docker Compose v2

```bash
# Clone and enter the project
git clone https://github.com/YOUR_USERNAME/barbershop.git
cd barbershop

# Copy and configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env — at minimum set SMTP_USER and SMTP_PASS for email

# Build and start all services
docker compose up --build

# (Optional) seed the database with admin + barber users
docker compose exec backend node prisma/seed.js
```

The app will be available at **http://localhost:8080**

| Service       | Port    | Description              |
|---------------|---------|--------------------------|
| nginx proxy   | 8080    | Entry point              |
| frontend      | 80      | React SPA (internal)     |
| backend       | 3001    | Express API (internal)   |
| postgres      | 5432    | PostgreSQL database      |

### Stop and clean up

```bash
docker compose down          # Stop containers (preserves volumes)
docker compose down -v       # Stop + delete volumes (fresh start)
```

---

## 3. Seed Users

After starting the stack, seed the default users:

```bash
docker compose exec backend node prisma/seed.js
```

| Role    | Email                     | Password     |
|---------|---------------------------|--------------|
| Admin   | admin@barbershop.com      | Admin@1234   |
| Barber  | barber@barbershop.com     | Barber@1234  |

Register yourself as a **Customer** via the app's Sign Up page.

---

## 4. Email Configuration (Gmail)

To enable real email notifications:

1. Enable **2-Step Verification** on your Gmail account
2. Go to **Google Account → Security → App Passwords**
3. Generate an app password (select "Mail" + device)
4. Set in `backend/.env`:
   ```
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_16_char_app_password
   ```

> Email errors are non-fatal — the booking still succeeds if email fails.

---

## 5. Testing

### Backend tests (Jest + Supertest)

Requires a running PostgreSQL test database.

```bash
# Option A: Run tests directly (requires local postgres)
cd backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barbershop_test?schema=public" npm test

# Option B: Run tests in Docker (isolated, recommended)
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

Test files:
- `backend/tests/auth.test.js` — register, login, /me, barbers list
- `backend/tests/booking.test.js` — create, list, status update, double-booking, availability
- `backend/tests/gallery.test.js` — GET gallery, upload (role check), delete (role check)

### Frontend tests (Vitest + React Testing Library)

```bash
cd frontend
npm test               # run once
npm run test:ui        # open Vitest UI in browser
```

Test files:
- `frontend/src/tests/Navbar.test.jsx` — renders correctly for all auth states
- `frontend/src/tests/Services.test.jsx` — all 6 service cards, pricing, CTA

---

## 6. CI/CD with GitHub Actions

The pipeline (`.github/workflows/ci-cd.yml`) runs 5 jobs on every push/PR to `main`:

```
lint  →  test-backend  →  build-and-push  →  deploy
      →  test-frontend  ↗
```

| Job              | What it does                                       |
|------------------|----------------------------------------------------|
| `lint`           | ESLint on backend + frontend                      |
| `test-backend`   | Jest + Supertest with a real GitHub-hosted Postgres |
| `test-frontend`  | Vitest component tests                             |
| `build-and-push` | Builds + pushes Docker images to Docker Hub        |
| `deploy`         | Triggers Render deploy hooks                       |

### Required GitHub Secrets

Go to **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name                   | Value                                      |
|-------------------------------|--------------------------------------------|
| `DOCKERHUB_USERNAME`          | Your Docker Hub username                   |
| `DOCKERHUB_TOKEN`             | Docker Hub Access Token (not your password)|
| `RENDER_BACKEND_DEPLOY_HOOK`  | Render backend service deploy hook URL     |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Render frontend service deploy hook URL    |

---

## 7. Deployment on Render (Easiest Method)

### Step 1 — Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/barbershop.git
git push -u origin main
```

### Step 2 — Create PostgreSQL on Render

1. Go to [render.com](https://render.com) → **New → PostgreSQL**
2. Give it a name, choose **Free** tier
3. Copy the **Internal Database URL** (used as `DATABASE_URL`)

### Step 3 — Deploy the Backend

1. **New → Web Service** → Connect your GitHub repo
2. Set:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node src/index.js`
3. Add **Environment Variables**:
   ```
   DATABASE_URL       = <paste Internal DB URL from Step 2>
   JWT_SECRET         = <generate a strong random string>
   JWT_EXPIRES_IN     = 7d
   NODE_ENV           = production
   CLIENT_URL         = https://YOUR-FRONTEND.onrender.com
   SMTP_HOST          = smtp.gmail.com
   SMTP_PORT          = 587
   SMTP_USER          = your_email@gmail.com
   SMTP_PASS          = your_app_password
   SHOP_NAME          = The Barber Shop
   ```
4. Click **Create Web Service**

### Step 4 — Deploy the Frontend

1. **New → Static Site** → Same GitHub repo
2. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add **Environment Variable**:
   ```
   VITE_API_URL = https://YOUR-BACKEND.onrender.com
   ```
4. Add a **Redirect/Rewrite Rule**:
   - Source: `/*`  →  Destination: `/index.html`  →  Type: **Rewrite**
   (This enables React Router client-side navigation)
5. Click **Create Static Site**

### Step 5 — Get Deploy Hook URLs (for CI/CD)

In each Render service: **Settings → Deploy Hook** → copy the URL → add to GitHub Secrets.

### Step 6 — Seed the database

After deploy, open the Render backend service **Shell** tab:
```bash
node prisma/seed.js
```

---

## 8. API Reference

| Method | Endpoint                          | Auth         | Description                       |
|--------|-----------------------------------|--------------|-----------------------------------|
| POST   | `/api/auth/register`              | Public       | Register new customer             |
| POST   | `/api/auth/login`                 | Public       | Login, returns JWT                |
| GET    | `/api/auth/me`                    | Any          | Get current user profile          |
| GET    | `/api/auth/barbers`               | Public       | List all barbers                  |
| POST   | `/api/bookings`                   | CUSTOMER     | Create booking                    |
| GET    | `/api/bookings`                   | Any          | List bookings (role-filtered)     |
| GET    | `/api/bookings/available`         | Public       | Get booked slots for a barber     |
| GET    | `/api/bookings/:id`               | Any          | Get single booking                |
| PATCH  | `/api/bookings/:id/status`        | Any          | Confirm / cancel booking          |
| GET    | `/api/gallery`                    | Public       | List gallery items (paginated)    |
| POST   | `/api/gallery`                    | BARBER/ADMIN | Upload image or video             |
| DELETE | `/api/gallery/:id`                | BARBER/ADMIN | Delete gallery item               |
| GET    | `/api/notifications`              | Any          | Get user's notifications          |
| GET    | `/api/notifications/unread-count` | Any          | Get unread notification count     |
| PATCH  | `/api/notifications/:id/read`     | Any          | Mark notification as read         |
| PATCH  | `/api/notifications/read-all`     | Any          | Mark all notifications as read    |
| GET    | `/api/health`                     | Public       | Health check                      |

---

## License

MIT
