# Project Improvement Roadmap

## Current State Assessment

### ✅ Strengths

- Clean microservices architecture
- API layer properly organized (domain modules)
- TypeScript with type safety
- JWT + OAuth authentication implemented
- Responsive UI with Tailwind CSS
- Toast notifications system in place

### ❌ Weaknesses

- **Backend**: No service/repository layer - DB access directly in routes
- **Backend**: No custom exception handling
- **Backend**: Program.cs is bloated with all routes inline
- **Frontend**: No centralized state management
- **Frontend**: Page-level logic mixed with UI
- **Frontend**: No error boundaries
- **Frontend**: No API interceptors for auth/retry logic

---

## 📋 Priority Roadmap (9 Steps)

### **PHASE 1: Backend Refactoring (Steps 1-4)**

Estimated: 2-3 hours

#### **Step 1: Repository Pattern Implementation** ⭐ HIGH PRIORITY

**Why**: Decouple data access from business logic

**What to build**:

```
Catalog Service:
├── Repositories/
│   └── IProductRepository.cs (interface)
│   └── ProductRepository.cs (MongoDB implementation)
├── Models/ (move from inline)
│   └── Product.cs
└── SeedData.cs (existing)

Cart Service:
├── Repositories/
│   └── ICartRepository.cs
│   └── CartRepository.cs (Redis implementation)
└── Models/
    └── CartItem.cs

Users Service:
├── Repositories/
│   └── IUserRepository.cs
│   └── UserRepository.cs
└── Models/
    └── User.cs
```

**Benefits**:

- Easy to swap Redis/MongoDB for testing
- Single responsibility principle
- Reusable across services

---

#### **Step 2: Service Layer Creation** ⭐ HIGH PRIORITY

**Why**: Encapsulate business logic, reduce code duplication

**What to build**:

```
Catalog Service:
├── Services/
│   └── ProductService.cs
│       - GetAllProducts()
│       - GetProductById()
│       - GetProductsByCategory()
│       - CreateProduct()

Cart Service:
├── Services/
│   └── CartService.cs
│       - GetCart()
│       - AddToCart()
│       - RemoveFromCart()
│       - UpdateQuantity()
│       - ClearCart()

Users Service:
├── Services/
│   └── UserService.cs
│       - Register()
│       - Login()
│       - GetUserById()
│       - GoogleSignIn()
│       - GetAddresses()
│       - AddAddress()
```

**Pattern Example**:

```csharp
public class ProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _repository.GetAllAsync();
    }
}
```

---

#### **Step 3: Custom Exception Handling** ⭐ MEDIUM PRIORITY

**Why**: Consistent error responses, better debugging

**What to build**:

```
Shared/
├── Exceptions/
│   ├── ApplicationException.cs (base)
│   ├── NotFoundException.cs
│   ├── ValidationException.cs
│   ├── UnauthorizedException.cs
│   └── ConflictException.cs
└── Models/
    └── ErrorResponse.cs

// In each service Program.cs:
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        // Map exceptions to status codes
    });
});
```

---

#### **Step 4: Program.cs Cleanup & Endpoint Organization** ⭐ MEDIUM PRIORITY

**Why**: DRY code, easier maintenance

**What to do**:

1. Move route registration to extension methods
2. Refactor huge Program.cs into smaller modules
3. Example for Catalog service:

```csharp
// Extensions/CatalogEndpoints.cs
public static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Catalog");

        group.MapGet("/", GetAllProducts)
            .WithName("GetAllProducts");
        group.MapGet("/{id}", GetProductById)
            .WithName("GetProductById");
        // ... more routes
    }

    private static async Task<IResult> GetAllProducts(
        ProductService service) =>
        Results.Ok(await service.GetAllProductsAsync());
}

// In Program.cs:
app.MapCatalogEndpoints();
```

---

### **PHASE 2: Frontend Improvements (Steps 5-8)**

Estimated: 2-3 hours

#### **Step 5: Implement Context-Based State Management** ⭐ HIGH PRIORITY

**Why**: Avoid prop drilling, centralize app state

**What to build**:

```
src/context/
├── AuthContext.tsx (user, token, loading)
├── CartContext.tsx (items, total, count)
├── AddressContext.tsx (addresses, default, loading)
└── NotificationContext.tsx (toasts queue)

// Usage:
<AuthProvider>
  <CartProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </CartProvider>
</AuthProvider>
```

**Benefits**:

- No prop drilling
- Easy to access user state anywhere
- Persistent state across pages
- Clear separation of concerns

---

#### **Step 6: Error Boundary Component** ⭐ MEDIUM PRIORITY

**Why**: Catch React errors gracefully

```tsx
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// In layout.tsx:
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

---

#### **Step 7: Extract Business Logic to Custom Hooks** ⭐ MEDIUM PRIORITY

**Why**: Reusable logic, cleaner components

```
src/hooks/
├── useAuth.ts (login, register, logout)
├── useCart.ts (add, remove, update quantity)
├── useAddresses.ts (fetch, add, update, delete)
├── useNotification.ts (show toast)
└── useFetch.ts (generic data fetching with loading/error)

// Usage in pages/addresses/page.tsx:
const AddressesPage = () => {
  const { addresses, loading, addAddress } = useAddresses();
  const { showToast } = useNotification();

  const handleAdd = async (data) => {
    try {
      await addAddress(data);
      showToast("Address added!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return <AddressForm onSubmit={handleAdd} />;
};
```

---

#### **Step 8: Add HTTP Interceptors** ⭐ MEDIUM PRIORITY

**Why**: Automatic auth header injection, error handling, retries

```typescript
// lib/api/client.ts
export const apiClient = axios.create({...});

// Request interceptor - auto add auth
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['X-User-Id'] = getUserId();
  return config;
});

// Response interceptor - handle 401, retries
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      // Redirect to login
    }
    // Implement exponential backoff retry
    return Promise.reject(error);
  }
);
```

---

### **PHASE 3: Testing & Documentation (Step 9)**

Estimated: 1-2 hours

#### **Step 9: Unit Test Skeleton** ⭐ LOW PRIORITY (but recommended)

**Why**: Prevent regressions, document expected behavior

```
Backend:
├── CatalogService.Tests.cs
│   - GetAllProductsAsync_ReturnsProducts()
│   - GetProductById_WithInvalidId_ThrowsNotFoundException()
├── CartService.Tests.cs
│   - AddToCart_NewItem_IncreasesTotal()
└── UserService.Tests.cs
    - Register_ValidEmail_CreatesUser()
    - Login_InvalidPassword_ThrowsUnauthorizedException()

Frontend:
├── hooks/__tests__/useAddresses.test.ts
├── hooks/__tests__/useAuth.test.ts
└── components/__tests__/ErrorBoundary.test.tsx
```

---

## 📊 Implementation Priority Matrix

| Step                   | Complexity | Impact    | Priority | Time |
| ---------------------- | ---------- | --------- | -------- | ---- |
| 1 - Repository         | Medium     | 🔥🔥 High | ⭐⭐⭐   | 1h   |
| 2 - Service Layer      | Medium     | 🔥🔥 High | ⭐⭐⭐   | 1h   |
| 3 - Exceptions         | Low        | 🔥 Medium | ⭐⭐     | 30m  |
| 4 - Program.cs         | Low        | 🔥 Medium | ⭐⭐     | 30m  |
| 5 - Context (Frontend) | Medium     | 🔥🔥 High | ⭐⭐⭐   | 1h   |
| 6 - Error Boundary     | Low        | 🔥 Medium | ⭐⭐     | 30m  |
| 7 - Custom Hooks       | Medium     | 🔥🔥 High | ⭐⭐⭐   | 1h   |
| 8 - Interceptors       | Low        | 🔥 Medium | ⭐⭐     | 30m  |
| 9 - Tests              | Medium     | 🔥 Medium | ⭐       | 1-2h |

**Total Time**: ~8-10 hours

---

## 🚀 Recommended Execution Path

### Week 1 (Backend Hardening)

1. ✅ Step 1: Repository Pattern
2. ✅ Step 2: Service Layer
3. ✅ Step 3: Exception Handling
4. ✅ Step 4: Program.cs Cleanup

### Week 2 (Frontend Polish)

5. ✅ Step 5: Context Management
6. ✅ Step 6: Error Boundary
7. ✅ Step 7: Custom Hooks
8. ✅ Step 8: Interceptors

### Week 3 (Quality & Testing)

9. ✅ Step 9: Unit Tests (as needed)

---

## Key Architecture Improvements

### Before (Current)

```
Program.cs (250+ lines)
└── Direct MongoDB/Redis access in routes
    └── No error handling
        └── No business logic encapsulation
```

### After (Target)

```
Program.cs (50 lines)
└── Endpoints Extension
    └── Service Layer
        └── Repository Pattern
            └── MongoDB/Redis (abstracted)
                └── Custom Exception Handling
```

---

## Development Tips

1. **Test Incrementally**: After each step, run the app and verify endpoints still work
2. **Backward Compatibility**: Keep old endpoints working during refactoring
3. **Use Dependency Injection**: Leverage .NET DI for all services/repos
4. **TypeScript Strict Mode**: Enable in tsconfig for frontend type safety
5. **Commit Frequently**: One commit per step for easy rollback

---

## Success Metrics

After completing this roadmap:

✅ **Backend**:

- 0 direct DB access in routes
- All routes delegate to services
- Custom exceptions for all error cases
- Program.cs < 100 lines
- 80%+ code reusability

✅ **Frontend**:

- Centralized state management
- No prop drilling
- Reusable hooks across pages
- Consistent error handling
- Auto-injected auth headers

✅ **Overall**:

- 50% less code duplication
- 90% test coverage ready
- SOLID principles applied
- Production-ready architecture
