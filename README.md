# Piyush Ghonge — Developer Portfolio

A premium, responsive, full-stack developer portfolio built on the **MERN stack** (MongoDB, Express, React, Node.js).

## 🔑 Quick Facts

| | |
|---|---|
| **Admin URL** | http://localhost:5173/admin |
| **Public site** | http://localhost:5173 |
| **Admin email** | set in `server/.env` → `ADMIN_EMAIL` |
| **Admin password** | set in `server/.env` → `ADMIN_PASSWORD` |

## 🚀 How to Run

You need **two terminals**.

### 1. Start the backend (API + database connection)

```bash
cd server
npm install        # only the first time
npm run seed       # only the first time — fills MongoDB with your content
npm run dev        # starts API on http://localhost:5000
```

### 2. Start the frontend (React dev server)

```bash
cd client
npm install        # only the first time
npm run dev        # starts site on http://localhost:5173
```

Open **http://localhost:5173** for the public portfolio and **http://localhost:5173/admin** for the admin panel.

> The frontend automatically proxies `/api` and `/uploads` to the backend, so no extra config is needed in development.

## ⚙️ Environment Setup (first time only)

1. Copy `server/.env.example` → rename to `server/.env`
2. Fill in:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin login credentials
3. Run `npm run seed` once

## 🗂️ Project Structure

```
├── client/                 # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/     # Public UI (Hero, Projects, Skills...)
│   │   ├── components/admin/# Admin form controls (fields, uploads)
│   │   ├── context/        # Theme, Auth, Portfolio data
│   │   ├── pages/          # AdminLogin + admin section pages
│   │   ├── services/api.js # Axios instance w/ JWT interceptor
│   │   └── App.jsx         # Routes
│   └── vite.config.js      # Dev proxy → backend
│
└── server/                 # Express backend
    ├── models/             # Mongoose schemas (13 collections)
    ├── routes/             # auth, public, admin APIs
    ├── controllers/        # business logic
    ├── middleware/         # JWT auth, multer upload, errors
    ├── seed/               # initial content (seedData.js)
    ├── scripts/seed.js     # populates MongoDB
    └── .env                # secrets (never committed)
```

## 🔐 Security Notes

- Passwords hashed with **bcrypt**
- Login returns a **JWT** stored in `localStorage`
- Protected admin routes verify JWT in the `Authorization` header
- Secrets live only in `server/.env` (excluded via `.gitignore`)
- File uploads are type- and size-limited via Multer

## 🛠️ Admin Capabilities

- **Dashboard** — real database counts + contact messages
- **Profile** — name, headline, tagline, email, phone, photo
- **About** — editable about section
- **Education / Skills / Experience / Projects / Certificates / Achievements / Social Links** — full CRUD
- **Projects** — featured toggle, reorder, main image + multiple screenshots, GitHub/Live demo links
- **Resume** — upload PDF, set which resume is active (public uses the active one)
- **Settings** — site title, tagline, footer text, default theme
- **Uploads** — images/PDFs stored under `server/uploads/` (designed so cloud storage can be swapped in later)

## 📡 Main API Endpoints

| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | admin login → JWT | — |
| GET | `/api/public/*` | public portfolio data | — |
| POST | `/api/public/contact` | contact form → stored in DB | — |
| GET/POST | `/api/admin/*` | manage all content | JWT |
| POST | `/api/admin/upload` | upload image/PDF | JWT |
| POST | `/api/admin/upload/multiple` | upload multiple images | JWT |

## 🧪 Common Commands

| Task | Command |
|---|---|
| Run backend | `cd server && npm run dev` |
| Run frontend | `cd client && npm run dev` |
| Re-populate database | `cd server && npm run seed` |
| Production build | `cd client && npm run build` |

## 📚 Learning Path (how this was built)

1. Frontend structure + UI
2. Tailwind theme system (dark/light)
3. Express backend + Mongoose models
4. REST APIs + JWT auth + bcrypt
5. Admin panel with config-driven CRUD
6. Public site wired to live API data
7. File uploads (single + gallery)