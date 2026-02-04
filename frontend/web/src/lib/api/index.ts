// Auth API
export {
    login,
    register,
    googleSignIn,
    setAuthToken,
    getAuthToken,
    clearAuth,
    isAuthenticated,
    getAuthStatus,
    getUserId
} from './auth';

// Catalog API
export type { Product } from './catalog';
export {
    getProducts,
    getProductById
} from './catalog';

// Cart API
export type { CartItem, CartResponse } from './cart';
export {
    getCart,
    addToCart,
    removeFromCart
} from './cart';

// Address API
export type { Address } from './addresses';
export {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from './addresses';

// Orders API
export type { Order, User } from './orders';
export {
    getOrders,
    getUserInfo,
    createOrder
} from './orders';

// Payments API
export type { CheckoutPayload, PaymentResponse } from './payments';
export {
    processCheckout
} from './payments';
