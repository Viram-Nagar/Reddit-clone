# Reddit Clone 🚀

A full-stack Reddit-like social media platform built with the PERN stack.

![Reddit Clone](https://img.shields.io/badge/PERN-Stack-FF4500?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)

## 🌐 Live Demo

- **Frontend:** https://reddit-clone-five-tan.vercel.app/
- **Backend API:** https://reddit-clone-api-rczm.onrender.com/api/health

### Test Credentials

Email: alice@example.com
Password: password123

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Core Features

- 🔐 **Authentication** — JWT-based auth with httpOnly cookies
- 🏘️ **Communities** — Create, browse, join/leave communities
- 📝 **Posts** — Text, image (Cloudinary upload), and link posts
- 🗳️ **Voting** — Upvote/downvote with optimistic UI updates
- 💬 **Comments** — Add, edit, delete comments with real-time count
- 👤 **Profiles** — User profiles with karma, post/comment history
- 🔍 **Search** — Live search across posts and communities

### Technical Features

- 🔥 **Hot Algorithm** — Reddit-inspired trending post ranking
- 🛡️ **Security** — Rate limiting, input sanitization, helmet headers
- 📱 **Responsive** — Mobile-first design with slide-out drawer
- ⚡ **Optimistic UI** — Instant vote/comment updates before API response

---

## 🧰 Tech Stack

### Frontend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| React 18 + Vite | UI framework + build tool |
| Tailwind CSS    | Utility-first styling     |
| Zustand         | State management          |
| React Router v6 | Client-side routing       |
| React Hook Form | Form management           |
| Zod             | Schema validation         |
| Axios           | HTTP client               |
| Lucide React    | Icon library              |

### Backend

| Technology            | Purpose          |
| --------------------- | ---------------- |
| Node.js + Express     | REST API server  |
| Prisma ORM            | Database queries |
| PostgreSQL (Supabase) | Database         |
| JWT + bcrypt          | Authentication   |
| Helmet                | Security headers |
| express-rate-limit    | Rate limiting    |

### DevOps

| Service  | Purpose             |
| -------- | ------------------- |
| Vercel   | Frontend hosting    |
| Render   | Backend hosting     |
| Supabase | PostgreSQL database |
| GitHub   | Version control     |

---

## 🏗️ Architecture

┌─────────────────────────────────────────────┐
│ Client (Vercel) │
│ React + Vite + Tailwind + Zustand │
│ https://reddit-clone-five-tan.vercel.app/ │
└──────────────────┬──────────────────────────┘
│ HTTPS + httpOnly Cookie
▼
┌─────────────────────────────────────────────┐
│ API Server (Render) │
│ Node.js + Express + Prisma │
│ https://reddit-clone-api-rczm.onrender.com │
│ │
│ Middleware Stack: │
│ Helmet → CORS → Body Parser → │
│ Cookie Parser → Sanitize → │
│ Rate Limit → Routes → Error Handler │
└────────────────┬────────────────────────────┘
│ │

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  bio       String?
  posts     Post[]
  comments  Comment[]
  votes     Vote[]
  memberships        Community[] @relation("CommunityMembers")
  createdCommunities Community[] @relation("CommunityCreator")
  createdAt DateTime @default(now())
}

model Community {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  posts       Post[]
  members     User[]   @relation("CommunityMembers")
  creator     User     @relation("CommunityCreator", ...)
  creatorId   String
  createdAt   DateTime @default(now())
}

model Post {
  id            String    @id @default(cuid())
  title         String
  content       String?
  type          String    @default("text")
  community     Community @relation(...)
  communityId   String
  author        User      @relation(...)
  authorId      String
  comments      Comment[]
  votes         Vote[]
  createdAt     DateTime  @default(now())
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(...)
  postId    String
  author    User     @relation(...)
  authorId  String
  createdAt DateTime @default(now())
}

model Vote {
  id      String   @id @default(cuid())
  type    VoteType
  user    User     @relation(...)
  userId  String
  post    Post     @relation(...)
  postId  String
  @@unique([userId, postId])
}
```

---

## 📡 API Documentation

### Authentication

| Method | Endpoint             | Description      | Auth |
| ------ | -------------------- | ---------------- | ---- |
| POST   | `/api/auth/register` | Register user    | ❌   |
| POST   | `/api/auth/login`    | Login user       | ❌   |
| POST   | `/api/auth/logout`   | Logout user      | ✅   |
| GET    | `/api/auth/me`       | Get current user | ✅   |

### Communities

| Method | Endpoint                      | Description          | Auth |
| ------ | ----------------------------- | -------------------- | ---- |
| GET    | `/api/communities`            | List all communities | ❌   |
| POST   | `/api/communities`            | Create community     | ✅   |
| GET    | `/api/communities/:slug`      | Get community        | ❌   |
| POST   | `/api/communities/:slug/join` | Join/leave community | ✅   |

### Posts

| Method | Endpoint         | Description     | Auth |
| ------ | ---------------- | --------------- | ---- |
| GET    | `/api/posts`     | Get all posts   | ❌   |
| POST   | `/api/posts`     | Create post     | ✅   |
| GET    | `/api/posts/:id` | Get single post | ❌   |
| DELETE | `/api/posts/:id` | Delete post     | ✅   |

### Votes

| Method | Endpoint             | Description    | Auth |
| ------ | -------------------- | -------------- | ---- |
| POST   | `/api/votes/:postId` | Vote on post   | ✅   |
| GET    | `/api/votes/:postId` | Get vote stats | ❌   |

### Comments

| Method | Endpoint                     | Description       | Auth |
| ------ | ---------------------------- | ----------------- | ---- |
| GET    | `/api/comments/post/:postId` | Get post comments | ❌   |
| POST   | `/api/comments/post/:postId` | Add comment       | ✅   |
| PATCH  | `/api/comments/:commentId`   | Edit comment      | ✅   |
| DELETE | `/api/comments/:commentId`   | Delete comment    | ✅   |

### Feed

| Method | Endpoint              | Description          | Auth |
| ------ | --------------------- | -------------------- | ---- |
| GET    | `/api/feed/home`      | Home feed            | ❌   |
| GET    | `/api/feed/following` | Following feed       | ✅   |
| GET    | `/api/feed/trending`  | Trending communities | ❌   |
| GET    | `/api/feed/search`    | Search               | ❌   |

### Users

| Method | Endpoint                        | Description       | Auth |
| ------ | ------------------------------- | ----------------- | ---- |
| GET    | `/api/users/:username`          | Get profile       | ❌   |
| GET    | `/api/users/:username/posts`    | Get user posts    | ❌   |
| GET    | `/api/users/:username/comments` | Get user comments | ❌   |
| PATCH  | `/api/users/me/profile`         | Update profile    | ✅   |
| PATCH  | `/api/users/me/password`        | Change password   | ✅   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Git
- Supabase account (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Viram-Nagar/Reddit-clone
cd reddit-clone

# 2. Setup backend
cd server
npm install

# 3. Setup frontend
cd ../client
npm install
```

### Environment Setup

```bash
# server/.env
cp server/.env.example server/.env
# Fill in your values (see Environment Variables section)
```

### Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed with test data
npm run db:seed
```

### Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Visit `http://localhost:5173`

### Run Tests

```bash
cd server
npm test                    # Run all tests
npm run test:coverage       # With coverage report
npm run test:watch          # Watch mode
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/DATABASE"

# JWT
JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Client (`client/.env.production`)

```env
VITE_API_URL="https://your-backend.onrender.com"
```

---

## 🌐 Deployment

### Database — Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Run `npx prisma migrate deploy`

### Backend — Render

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Root: `server`, Build: `npm install && npm run build`
4. Start: `npm start`
5. Add all environment variables

### Frontend — Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Root: `client`, Framework: Vite
4. Add `VITE_API_URL` environment variable

---

---

## 📁 Project Structure

reddit-clone/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── comments/ # Comment components
│ │ │ ├── communities/ # Community components
│ │ │ ├── errors/ # Error boundary components
│ │ │ ├── feed/ # Feed components
│ │ │ ├── layout/ # Layout components
│ │ │ ├── posts/ # Post components
│ │ │ ├── profile/ # Profile components
│ │ │ └── ui/ # Generic UI components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page components
│ │ ├── schemas/ # Zod validation schemas
│ │ ├── services/ # API service (axios)
│ │ ├── store/ # Zustand stores
│ │ └── utils/ # Utility functions
│ ├── public/
│ ├── index.html
│ └── vite.config.js
│
└── server/ # Node.js backend
├── src/
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Express middleware
│ ├── routes/ # Route definitions
│ └── utils/ # Utilities
├── prisma/
│ ├── schema.prisma # Database schema
│ └── seed.js # Seed data
└── server.js # Entry point

---

## 👨‍💻 Author

Built as a portfolio project demonstrating:

- Full-stack PERN development
- REST API design with Express + Prisma
- React state management with Zustand
- JWT authentication with httpOnly cookies
- Cloud services integration (Supabase, Render, Vercel)
- Production deployment and DevOps

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.

---

⭐ Star this repo if you found it helpful!
