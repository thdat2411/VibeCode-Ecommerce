# Authentication Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Next.js Frontend (Port 3000)                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Sign In Page (/auth/signin)                                   │    │
│  │                                                                │    │
│  │  ┌──────────────────────────┐  ┌───────────────────────────┐ │    │
│  │  │ Email/Password Form      │  │ GoogleSignInButton        │ │    │
│  │  │                          │  │                           │ │    │
│  │  │ • Email input            │  │ • Loads Google SDK        │ │    │
│  │  │ • Password input         │  │ • Renders Sign-In button  │ │    │
│  │  │ • Submit button          │  │ • Handles OAuth response  │ │    │
│  │  │ • Error display          │  │ • Error display          │ │    │
│  │  └────────────┬─────────────┘  └────────────┬──────────────┘ │    │
│  │               │                            │               │    │
│  │               └────────────────┬───────────┘               │    │
│  │                                │                           │    │
│  │                        Sends ID token                      │    │
│  │                        or email/password                   │    │
│  └────────────────────────┼───────────────────────────────────┘    │
│                           │                                         │
│  Store in localStorage:   │                                         │
│  • token                  │                                         │
│  • userId                 │                                         │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    BFF Gateway (Port 5000)            │
        │                                       │
        │  POST /api/auth/login                 │
        │  POST /api/auth/register              │
        │  POST /api/auth/google ◀──────────────┼──── Proxies requests
        │                                       │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   Users Service (Port 5004)           │
        │                                       │
        │  ┌─────────────────────────────────┐  │
        │  │ Email/Password Login            │  │
        │  │ • Find user by email            │  │
        │  │ • Verify password with BCrypt   │  │
        │  │ • Generate JWT token            │  │
        │  │ • Return token + userId         │  │
        │  └─────────────────────────────────┘  │
        │                                       │
        │  ┌─────────────────────────────────┐  │
        │  │ Google OAuth Signin             │  │
        │  │ • Receive ID token              │  │
        │  │ • Call Google API to verify     │  │
        │  │ • Extract email & name          │  │
        │  │ • Check if user exists          │  │
        │  │ • Create user if new            │  │
        │  │ • Generate JWT token            │  │
        │  │ • Return token + userId         │  │
        │  └─────────────────────────────────┘  │
        │                                       │
        │         ▼ MongoDB (users_db)         │
        │    ┌─────────────────────┐           │
        │    │ users collection    │           │
        │    │                     │           │
        │    │ • Id                │           │
        │    │ • Email             │           │
        │    │ • Name              │           │
        │    │ • PasswordHash      │           │
        │    │ • GoogleId? (OAuth) │           │
        │    │ • Phone?            │           │
        │    │ • CreatedAt         │           │
        │    └─────────────────────┘           │
        │                                       │
        └───────────────────────────────────────┘
                            │
                JWT Token Response
                │
                ▼
        ┌──────────────────────────────────┐
        │  Google OAuth API                │
        │  https://www.googleapis.com/...  │
        │                                  │
        │  • Verify ID token               │
        │  • Return user info              │
        └──────────────────────────────────┘
```

---

## Authentication Flows

### Email/Password Login Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (signin page)                       │
│                                                                      │
│  1. User enters email & password                                    │
│  2. Form validates input                                            │
│  3. POST /api/auth/login with { email, password }                   │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │   BFF (Port    │
                   │   5000)        │
                   │  /api/auth/    │
                   │   login        │
                   └────────┬───────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ Users Service      │
                   │ (Port 5004)        │
                   │                    │
                   │ 1. Find user by    │
                   │    email in MongoDB│
                   │ 2. Verify password │
                   │    (BCrypt)        │
                   │ 3. Generate JWT    │
                   │ 4. Return token +  │
                   │    userId          │
                   └────────┬───────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │ Response JSON          │
               │ {                      │
               │  "token": "jwt...",    │
               │  "userId": "guid..."   │
               │ }                      │
               └────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │ Frontend stores in localStorage   │
        │ • localStorage.token              │
        │ • localStorage.userId             │
        │                                   │
        │ User redirected to /dashboard     │
        └───────────────────────────────────┘
```

### Google OAuth Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                  Frontend (signin/signup page)                        │
│                                                                       │
│  1. GoogleSignInButton component loads Google SDK                    │
│  2. Renders "Sign in with Google" button                             │
│  3. User clicks button                                               │
│  4. Google OAuth dialog appears                                      │
│  5. User authenticates with Google account                           │
│  6. Google returns ID token                                          │
│  7. handleCredentialResponse() called with token                     │
│  8. POST /api/auth/google with { idToken: "..." }                    │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │   BFF (Port        │
                   │   5000)            │
                   │  /api/auth/google  │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌──────────────────────────┐
                   │ Users Service            │
                   │ (Port 5004)              │
                   │                          │
                   │ 1. Receive ID token      │
                   │ 2. Call Google API:      │
                   │    GET tokeninfo?...     │
                   │ 3. Extract email & name │
                   │ 4. Check if user exists │
                   │    in MongoDB            │
                   │ 5. If not: create new   │
                   │    user record           │
                   │ 6. Generate JWT token    │
                   │ 7. Return token +        │
                   │    userId                │
                   └────────┬─────────────────┘
                            │
                            │ Calls Google API
                            │
                            ▼
            ┌──────────────────────────────────┐
            │ Google OAuth API                 │
            │ (https://googleapis.com/oauth2)  │
            │                                  │
            │ Verifies ID token signature      │
            │ Returns: { email, name, ... }    │
            └──────────────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │ Response JSON          │
               │ {                      │
               │  "token": "jwt...",    │
               │  "userId": "guid..."   │
               │ }                      │
               └────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │ Frontend stores in localStorage   │
        │ • localStorage.token              │
        │ • localStorage.userId             │
        │                                   │
        │ User redirected to /dashboard     │
        └───────────────────────────────────┘
```

---

## Token Usage & Protected Routes

```
┌─────────────────────────────────────┐
│  Any API Request to Backend         │
│                                     │
│  GET /api/cart                      │
│  GET /api/orders                    │
│  POST /api/orders                   │
│  GET /api/users/me                  │
│                                     │
│  Headers sent:                      │
│  Authorization: Bearer {token}      │
│  X-User-Id: {userId}                │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ BFF receives     │
         │ Validates token  │
         │ in header        │
         └────────────────┬─┘
                          │
                 ┌────────┴────────┐
                 │                 │
         ✓ Valid               ✗ Invalid
                 │                 │
                 ▼                 ▼
        ┌──────────────┐   ┌───────────────┐
        │ Forward to   │   │ Return 401    │
        │ service      │   │ Unauthorized  │
        │ Include auth │   │               │
        │ header       │   │ Redirect to   │
        └──────────────┘   │ /auth/signin  │
                           └───────────────┘

┌──────────────────────────────────────────┐
│  ProtectedRoute Component                │
│                                          │
│  Wraps sensitive pages:                  │
│  • /dashboard                            │
│  • /checkout                             │
│  • /orders                               │
│                                          │
│  On Mount:                               │
│  1. Check isAuthenticated()              │
│  2. If false: redirect to /auth/signin   │
│  3. If true: render page                 │
└──────────────────────────────────────────┘
```

---

## Component Interaction

```
┌─────────────────────────────────────────────────────┐
│           App Layout (root layout.tsx)              │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │      AuthProvider (auth-context)             │  │
│  │      • Provides useAuth() hook              │  │
│  │      • Manages global auth state            │  │
│  │      • Checks auth on mount                 │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │      Page Content                      │ │  │
│  │  │                                        │ │  │
│  │  │  Protected Pages:                      │ │  │
│  │  │  <ProtectedRoute>                      │ │  │
│  │  │    <DashboardPage />                   │ │  │
│  │  │  </ProtectedRoute>                     │ │  │
│  │  │                                        │ │  │
│  │  │  Auth Pages:                           │ │  │
│  │  │  <SignInPage>                          │ │  │
│  │  │    <GoogleSignInButton />              │ │  │
│  │  │    Email/Password Form                 │ │  │
│  │  │  </SignInPage>                         │ │  │
│  │  │                                        │ │  │
│  │  │  Product Pages:                        │ │  │
│  │  │  <ProductDetail>                       │ │  │
│  │  │    <AddToCartForm />                   │ │  │
│  │  │  </ProductDetail>                      │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Custom Hooks Available:                           │
│  • useAuth() - Access auth state                   │
│  • useRouter() - Navigation                        │
│  • useState() - Component state                    │
│  • useEffect() - Side effects                      │
└─────────────────────────────────────────────────────┘
```

---

## Data Model (MongoDB)

```
users collection:
{
  _id: ObjectId,

  // Basic Info
  id: string (GUID),
  email: string,
  name: string,
  phone?: string,

  // Authentication
  passwordHash: string (BCrypt),
  googleId?: string (OAuth identifier),

  // Shipping
  shippingAddress?: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },

  // Metadata
  createdAt: DateTime,
  updatedAt?: DateTime
}
```

---

## Environment Variables

```dotenv
# Frontend (.env.local)
NEXT_PUBLIC_BFF_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx-xxx-xxx.apps.googleusercontent.com

# Backend - Users Service (appsettings.json)
"Google": {
  "ClientId": "xxx-xxx-xxx.apps.googleusercontent.com",
  "ClientSecret": "your-client-secret"
},
"Jwt": {
  "SecretKey": "your-secret-key-min-32-characters",
  "Issuer": "ecommerce-api",
  "Audience": "ecommerce-web"
}
```

---

## Error Handling Flows

```
Sign-In Errors:

User not found
├─ Return 401 Unauthorized
├─ Frontend displays: "Invalid credentials"
└─ User can try again or sign up

Invalid password
├─ Return 401 Unauthorized
├─ Frontend displays: "Invalid credentials"
└─ User can reset password (future feature)

Google OAuth - Invalid token
├─ Return 400 Bad Request
├─ Message: "Invalid Google token"
├─ Frontend displays error
└─ User can try again

Google OAuth - Network error
├─ Return 500 Internal Server Error
├─ Message: "Failed to verify Google token"
├─ Frontend displays: "Try again later"
└─ User can retry
```

---

This architecture ensures:
✅ Secure token exchange
✅ Multiple authentication methods
✅ Global state management
✅ Protected routes
✅ User session persistence
✅ Google OAuth verification
