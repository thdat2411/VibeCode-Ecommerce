# E-Commerce Platform Architecture

## Project Structure

```
AgentCoding/
├── frontend/
│   └── web/                          # Next.js 15.1.3 Frontend
│       ├── src/
│       │   └── app/
│       │       ├── layout.tsx        # Root layout with Inter font
│       │       ├── page.tsx          # Homepage
│       │       └── globals.css       # Tailwind CSS + global styles
│       ├── package.json              # Next.js, React 19, Tailwind
│       ├── tsconfig.json             # TypeScript config
│       ├── next.config.ts            # Next.js config (image domains)
│       ├── tailwind.config.ts        # Tailwind config
│       ├── postcss.config.mjs        # PostCSS config
│       └── .eslintrc.json            # ESLint config
│
├── backend/
│   ├── bff/                          # Backend for Frontend (API Gateway)
│   │   ├── Program.cs                # Minimal API with HttpClient for all services
│   │   ├── Bff.csproj                # .NET 8.0, Swashbuckle
│   │   ├── appsettings.json          # Service URLs configuration
│   │   ├── appsettings.Development.json
│   │   └── Properties/
│   │       └── launchSettings.json   # Port 5000
│   │
│   ├── services/
│   │   ├── catalog/                  # Product Catalog Service
│   │   │   ├── Program.cs            # MongoDB CRUD for products
│   │   │   ├── Catalog.csproj        # .NET 8.0, MongoDB.Driver
│   │   │   ├── appsettings.json      # MongoDB connection (catalog_db)
│   │   │   └── Properties/
│   │   │       └── launchSettings.json # Port 5001
│   │   │
│   │   ├── cart/                     # Shopping Cart Service
│   │   │   ├── Program.cs            # Redis-based cart with JSON serialization
│   │   │   ├── Cart.csproj           # .NET 8.0, StackExchange.Redis
│   │   │   ├── appsettings.json      # Redis connection
│   │   │   └── Properties/
│   │   │       └── launchSettings.json # Port 5002
│   │   │
│   │   ├── orders/                   # Order Management Service
│   │   │   ├── Program.cs            # MongoDB for order CRUD + status updates
│   │   │   ├── Orders.csproj         # .NET 8.0, MongoDB.Driver
│   │   │   ├── appsettings.json      # MongoDB connection (orders_db)
│   │   │   └── Properties/
│   │   │       └── launchSettings.json # Port 5003
│   │   │
│   │   ├── users/                    # User & Authentication Service
│   │   │   ├── Program.cs            # JWT + Google OAuth + BCrypt
│   │   │   ├── Users.csproj          # .NET 8.0, MongoDB, JWT, BCrypt.Net-Next
│   │   │   ├── appsettings.json      # MongoDB, JWT secrets, Google OAuth
│   │   │   └── Properties/
│   │   │       └── launchSettings.json # Port 5004
│   │   │
│   │   └── payments/                 # Payment Processing Service
│   │       ├── Program.cs            # Stripe Checkout + Webhooks
│   │       ├── Payments.csproj       # .NET 8.0, Stripe.net
│   │       ├── appsettings.json      # Stripe keys
│   │       └── Properties/
│   │           └── launchSettings.json # Port 5005
│   │
│   └── shared/                       # Shared DTOs
│       ├── Shared.csproj             # .NET 8.0 class library
│       └── DTOs.cs                   # ProductDto, CartItemDto, OrderDto, UserDto, AddressDto
│
├── infra/
│   ├── docker-compose.yml            # MongoDB + Redis containers
│   └── .env.example                  # Environment variables template
│
├── react-best-practices/             # Vercel React optimization guidelines
│   ├── SKILL.md                      # Quick reference (57 rules, 8 categories)
│   └── AGENTS.md                     # Full compiled guide
│
├── .gitignore                        # Node, .NET, Docker, IDEs
├── pnpm-workspace.yaml               # pnpm monorepo config
└── README.md                         # Setup instructions & documentation
```

## Service Endpoints

| Service         | Port | Database             | Purpose                  |
| --------------- | ---- | -------------------- | ------------------------ |
| **Next.js Web** | 3000 | -                    | Frontend UI              |
| **BFF**         | 5000 | -                    | API Gateway/Orchestrator |
| **Catalog**     | 5001 | MongoDB (catalog_db) | Product management       |
| **Cart**        | 5002 | Redis                | Session-based carts      |
| **Orders**      | 5003 | MongoDB (orders_db)  | Order processing         |
| **Users**       | 5004 | MongoDB (users_db)   | Auth & profiles          |
| **Payments**    | 5005 | Stripe API           | Payment processing       |

## Data Flow

```
┌─────────────┐
│  Next.js    │ (Port 3000)
│  Frontend   │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│     BFF     │ (Port 5000)
│  (Gateway)  │
└──────┬──────┘
       │
       ├─→ Catalog Service (5001) → MongoDB
       ├─→ Cart Service (5002) → Redis
       ├─→ Orders Service (5003) → MongoDB
       ├─→ Users Service (5004) → MongoDB + JWT
       └─→ Payments Service (5005) → Stripe
```

## Technology Stack

### Frontend

- **Framework**: Next.js 15.1.3 (App Router, Server Components)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **Package Manager**: pnpm

### Backend

- **Runtime**: .NET 8.0
- **API Style**: Minimal APIs (ASP.NET Core)
- **Documentation**: Swagger/OpenAPI

### Databases

- **MongoDB**: Products, Orders, Users (via MongoDB.Driver 2.30.0)
- **Redis**: Cart sessions (via StackExchange.Redis 2.8.16)

### Authentication

- **Strategy**: JWT Bearer tokens
- **Social Auth**: Google OAuth
- **Password Hashing**: BCrypt.Net-Next 4.0.3

### Payments

- **Provider**: Stripe (via Stripe.net 47.4.0)
- **Methods**: Checkout Sessions + Webhooks

## Key Models/DTOs

### Product (Catalog Service)

```csharp
{
  Id, Name, Description, Price, Category,
  Images[], Variants{}, Stock, CreatedAt
}
```

### CartItem (Cart Service)

```csharp
{
  ProductId, Name, Price, Quantity, Image
}
```

### Order (Orders Service)

```csharp
{
  Id, UserId, Items[], Total, Status,
  ShippingAddress, CreatedAt
}
```

### User (Users Service)

```csharp
{
  Id, Email, Name, PasswordHash,
  Phone?, ShippingAddress?, CreatedAt
}
```

## API Routes (BFF)

| Method | Endpoint                     | Target Service | Description           |
| ------ | ---------------------------- | -------------- | --------------------- |
| GET    | `/api/catalog/products`      | Catalog        | List all products     |
| GET    | `/api/catalog/products/{id}` | Catalog        | Get product details   |
| GET    | `/api/cart`                  | Cart           | Get user's cart       |
| POST   | `/api/cart/items`            | Cart           | Add item to cart      |
| GET    | `/api/orders`                | Orders         | Get user's orders     |
| POST   | `/api/orders`                | Orders         | Create new order      |
| GET    | `/api/users/me`              | Users          | Get current user      |
| POST   | `/api/payments/checkout`     | Payments       | Create Stripe session |

## Environment Variables

See `infra/.env.example` for complete list. Key variables:

- `NEXT_PUBLIC_BFF_URL` - BFF endpoint for frontend
- `MONGODB_CONNECTION_STRING` - MongoDB connection
- `REDIS_CONNECTION_STRING` - Redis connection
- `JWT_SECRET_KEY` - JWT signing key (32+ chars)
- `GOOGLE_CLIENT_ID/SECRET` - OAuth credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Webhook verification

## Development Setup

1. **Install Dependencies**: `cd frontend/web && pnpm install`
2. **Start Infrastructure**: `cd infra && docker-compose up -d`
3. **Run Services**: Start each service in separate terminal (`dotnet run`)
4. **Run Frontend**: `cd frontend/web && pnpm dev`

## Design Principles

Following [Vercel React Best Practices](./react-best-practices/SKILL.md):

1. **Eliminate Waterfalls**: Parallel data fetching with `Promise.all()`
2. **Bundle Size**: Dynamic imports for heavy components
3. **Server-Side**: Leverage Next.js Server Components
4. **Re-renders**: Memoization and state optimization
5. **Performance**: Code splitting, lazy loading

## Security Considerations

- ✅ JWT tokens with secure secrets
- ✅ BCrypt password hashing
- ✅ Stripe webhook signature verification
- ✅ CORS configured for web app
- ✅ Environment variables for secrets
- ⚠️ Add rate limiting in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement API authentication on BFF
