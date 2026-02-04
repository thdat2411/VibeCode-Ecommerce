# API Organization Structure

The API layer has been reorganized into separate, domain-specific modules for better code organization and maintainability.

## Directory Structure

```
src/lib/api/
├── index.ts           # Central export hub
├── auth.ts           # Authentication APIs
├── catalog.ts        # Product catalog APIs
├── cart.ts           # Shopping cart APIs
├── addresses.ts      # User address APIs
├── orders.ts         # Orders and user info APIs
└── payments.ts       # Payment processing APIs
```

## Module Breakdown

### auth.ts

Authentication-related APIs including login, registration, and session management.

**Exports:**

- `login(email, password)` - User login
- `register(data)` - User registration
- `googleSignIn(idToken)` - Google OAuth sign-in
- `setAuthToken(token, userId)` - Store auth credentials
- `getAuthToken()` - Retrieve stored token
- `clearAuth()` - Clear auth session
- `isAuthenticated()` - Check auth status
- `getAuthStatus()` - Get full auth info
- `getUserId()` - Get current user ID

**Used by:**

- `/app/auth/signin/page.tsx`
- `/app/auth/signup/page.tsx`
- Components: GoogleAccountSelector, GoogleSignInButton, ProtectedRoute
- auth-context.tsx

### catalog.ts

Product catalog and browsing APIs.

**Exports:**

- `getProducts()` - Fetch all products
- `getProductById(id)` - Get single product details

**Types:**

- `Product` - Product interface

**Used by:**

- `/app/page.tsx`
- `/app/catalog/page.tsx`
- `/app/catalog/[id]/page.tsx`
- Components: CatalogWrapper, CatalogFilters, CatalogResults

### cart.ts

Shopping cart operations.

**Exports:**

- `getCart()` - Fetch user's cart
- `addToCart(item)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart

**Types:**

- `CartItem` - Cart item interface
- `CartResponse` - Cart response interface

**Used by:**

- `/app/cart/page.tsx`
- `/app/checkout/page.tsx`
- Components: AddToCartForm

### addresses.ts

User address management APIs.

**Exports:**

- `getAddresses()` - Fetch all user addresses
- `addAddress(address)` - Create new address
- `updateAddress(id, address)` - Update existing address
- `deleteAddress(id)` - Delete address
- `setDefaultAddress(id)` - Set default address

**Types:**

- `Address` - Address interface

**Used by:**

- `/app/dashboard/page.tsx`
- `/app/addresses/page.tsx`

### orders.ts

Orders and user profile APIs.

**Exports:**

- `getOrders()` - Fetch user orders
- `getUserInfo()` - Get user profile
- `createOrder(orderData)` - Create new order

**Types:**

- `Order` - Order interface
- `User` - User interface

**Used by:**

- `/app/dashboard/page.tsx`
- `/app/checkout/page.tsx`

### payments.ts

Payment processing APIs.

**Exports:**

- `processCheckout(checkoutData)` - Process checkout payment

**Types:**

- `CheckoutPayload` - Checkout data interface
- `PaymentResponse` - Payment response interface

**Used by:**

- `/app/checkout/page.tsx`

## index.ts (Central Hub)

The `index.ts` file re-exports all functions and types from individual modules, allowing imports from either:

```typescript
// Specific module imports (recommended for better tree-shaking)
import { login } from "@/lib/api/auth";
import { getProducts } from "@/lib/api/catalog";

// Or from the central hub
import { login, getProducts } from "@/lib/api";
```

## Key Features

✅ **Organization** - APIs organized by domain/feature
✅ **Separation of Concerns** - Each module handles one area
✅ **Better Testing** - Easier to unit test specific modules
✅ **Tree Shaking** - Dead code elimination works better
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Error Handling** - Consistent AxiosError handling across all modules
✅ **Response Parsing** - Handles backend JSON string responses automatically

## Import Examples

### Auth Module

```typescript
import { login, setAuthToken } from "@/lib/api/auth";

const result = await login(email, password);
setAuthToken(result.token, result.userId);
```

### Catalog Module

```typescript
import { getProducts, getProductById } from "@/lib/api/catalog";

const products = await getProducts();
const product = await getProductById("product-123");
```

### Cart Module

```typescript
import { getCart, addToCart, removeFromCart } from "@/lib/api/cart";

const cart = await getCart();
await addToCart(item);
await removeFromCart(productId);
```

### Addresses Module

```typescript
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/api/addresses";

const addresses = await getAddresses();
const newAddr = await addAddress(addressData);
await updateAddress(id, updatedData);
await deleteAddress(id);
```

### Orders Module

```typescript
import { getOrders, getUserInfo, createOrder } from "@/lib/api/orders";

const orders = await getOrders();
const user = await getUserInfo();
const order = await createOrder(orderData);
```

### Payments Module

```typescript
import { processCheckout } from "@/lib/api/payments";

const payment = await processCheckout(checkoutData);
```

## Migration Notes

- Old monolithic `api.ts` has been split into domain-specific modules
- All imports updated across the codebase
- Backward compatibility maintained through central `index.ts` export
- No breaking changes to function signatures or behavior
