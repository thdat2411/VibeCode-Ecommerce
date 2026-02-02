# AgentCoding (frontend/web)

This repository contains a Next.js + TailwindCSS frontend for the project you are developing locally at `d:/CODING/AgentCoding`.

Quick notes

- Project root: `d:/CODING/AgentCoding`
- Web app folder: `frontend/web`

How to upload to GitHub (recommended, run in PowerShell):

1. If you have the GitHub CLI (`gh`) installed and authenticated, run:

```powershell
cd D:\CODING\AgentCoding
gh repo create <your-repo-name> --public --source . --remote origin --push
```

2. Without `gh`, run these commands and then create a repo on GitHub and add its remote URL:

```powershell
cd D:\CODING\AgentCoding
git init
git add .
git commit -m "Initial commit"
# create a repo on GitHub then add remote and push
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

There is also a helper script `push-to-github.ps1` in the project root to automate these steps (see usage in the script).

If you want me to run the push commands locally I will need a remote URL or access to your account — otherwise run the commands above on your machine.

# E-Commerce Clothing Store

A modern e-commerce platform inspired by [The New Originals](https://theneworiginals.com), built with Next.js frontend and .NET microservices backend.

## 🏗️ Architecture

This project uses a microservices architecture with:

### Frontend

- **Next.js App** (`apps/web`) - Server-side rendered React app with App Router
  - Port: 3000
  - Features: Catalog browsing, cart management, checkout flow, user authentication

### Backend

- **BFF (Backend for Frontend)** (`apps/bff`) - API Gateway for the web app
  - Port: 5000
  - Aggregates calls to downstream microservices
- **Catalog Service** (`services/catalog`) - Product management
  - Port: 5001
  - Database: MongoDB
  - Features: Product CRUD, category filtering, inventory tracking
- **Cart Service** (`services/cart`) - Shopping cart management
  - Port: 5002
  - Database: Redis
  - Features: Add/remove items, session-based carts
- **Orders Service** (`services/orders`) - Order processing
  - Port: 5003
  - Database: MongoDB
  - Features: Order creation, status tracking, order history
- **Users Service** (`services/users`) - User authentication & profiles
  - Port: 5004
  - Database: MongoDB
  - Features: JWT auth, Google OAuth, user profiles
- **Payments Service** (`services/payments`) - Payment processing
  - Port: 5005
  - Integration: Stripe
  - Features: Checkout sessions, webhook handling

### Shared

- **Shared Package** (`packages/shared`) - Common DTOs used across services

## 📋 Prerequisites

- **Node.js** 18+ and **pnpm**
- **.NET 8 SDK**
- **Docker & Docker Compose** (for MongoDB and Redis)
- **Stripe Account** (for payment testing)
- **Google OAuth Credentials** (for social login)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
# Install Next.js dependencies
cd frontend/web
pnpm install
cd ../..

# Restore .NET dependencies
dotnet restore
```

### 2. Start Infrastructure Services

```bash
# Start MongoDB and Redis
cd infra
docker-compose up -d
cd ..
```

### 3. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp infra/.env.example .env
```

Update the following in `.env`:

- `JWT_SECRET_KEY` - Generate a secure 32+ character secret
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or Dashboard

### 4. Run All Services

**Terminal 1 - Web App:**

```bash
cd frontend/web
pnpm dev
```

**Terminal 2 - BFF:**

```bash
cd backend/bff
dotnet run
```

**Terminal 3 - Catalog Service:**

```bash
cd backend/services/catalog
dotnet run
```

**Terminal 4 - Cart Service:**

```bash
cd backend/services/cart
dotnet run
```

**Terminal 5 - Orders Service:**

```bash
cd backend/services/orders
dotnet run
```

**Terminal 6 - Users Service:**

```bash
cd backend/services/users
dotnet run
```

**Terminal 7 - Payments Service:**

```bash
cd backend/services/payments
dotnet run
```

### 5. Access the Application

- **Web App:** http://localhost:3000
- **BFF API:** http://localhost:5000/swagger
- **Catalog API:** http://localhost:5001/swagger
- **Cart API:** http://localhost:5002/swagger
- **Orders API:** http://localhost:5003/swagger
- **Users API:** http://localhost:5004/swagger
- **Payments API:** http://localhost:5005/swagger

## 📁 Project Structure

```
.
├── frontend/
│   └── web/              # Next.js frontend
├── backend/
│   ├── bff/              # Backend for Frontend API Gateway
│   ├── services/
│   │   ├── catalog/      # Product catalog microservice
│   │   ├── cart/         # Shopping cart microservice
│   │   ├── orders/       # Order management microservice
│   │   ├── users/        # User & auth microservice
│   │   └── payments/     # Payment processing microservice
│   └── shared/           # Shared DTOs and models
├── infra/
│   ├── .env.example      # Environment variables template
│   └── docker-compose.yml # MongoDB & Redis containers
└── react-best-practices/ # Vercel React best practices guide
```

## 🧪 Testing Stripe Webhooks Locally

Install Stripe CLI and forward webhooks:

```bash
stripe listen --forward-to localhost:5005/api/payments/webhook
```

Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing):

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🔒 Security Notes

- Never commit `.env` files with real credentials
- Rotate JWT secrets in production
- Use HTTPS in production
- Enable rate limiting on public APIs
- Validate webhook signatures (Stripe)

## 📚 Tech Stack

### Frontend

- Next.js 15.1.3 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Server Components

### Backend

- ASP.NET Core 8 Minimal APIs
- MongoDB Driver
- Redis (StackExchange.Redis)
- Stripe.net
- JWT Authentication
- BCrypt for password hashing

### DevOps

- Docker & Docker Compose
- pnpm (package management)
- Swagger/OpenAPI

## 🎨 Design Philosophy

This project follows [Vercel's React Best Practices](./react-best-practices/SKILL.md):

- Eliminate request waterfalls with parallel data fetching
- Optimize bundle size with dynamic imports
- Server-side rendering for performance
- Minimal client-side JavaScript

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow the existing code structure and adhere to the React best practices guide.
