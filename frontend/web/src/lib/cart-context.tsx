"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  CartItem,
  CartResponse,
  cartKey,
} from "@/lib/api/cart";
import { useAuth } from "./auth-context";

const GUEST_CART_KEY = "guest_cart";

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => Promise<void>;
  removeItem: (
    item: Pick<CartItem, "productId" | "size" | "color">,
  ) => Promise<void>;
  updateQuantity: (
    item: Pick<CartItem, "productId" | "size" | "color">,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcTotal = (list: CartItem[]) =>
    list.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ── Fetch backend cart (authenticated only) ──
  const fetchCart = useCallback(async () => {
    if (!authenticated) return;
    try {
      setLoading(true);
      setError(null);
      const cart: CartResponse = await getCart();
      setItems(cart.items);
      setTotal(cart.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // ── On login: merge guest cart into backend, then clear localStorage ──
  useEffect(() => {
    if (!authenticated) {
      // Load guest cart into state
      const guest = loadGuestCart();
      setItems(guest);
      setTotal(calcTotal(guest));
      return;
    }

    const mergeAndFetch = async () => {
      const guest = loadGuestCart();
      if (guest.length > 0) {
        try {
          // Add each guest item to backend cart
          for (const item of guest) {
            await addToCart(item);
          }
        } catch {
          // best-effort merge
        } finally {
          clearGuestCart();
        }
      }
      await fetchCart();
    };

    mergeAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  // ── Add item ──
  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;

      if (!authenticated) {
        // Guest: update localStorage
        const current = loadGuestCart();
        const key = cartKey({ ...item });
        const existing = current.find((i) => cartKey(i) === key);
        let updated: CartItem[];
        if (existing) {
          updated = current.map((i) =>
            cartKey(i) === key ? { ...i, quantity: i.quantity + qty } : i,
          );
        } else {
          updated = [...current, { ...item, quantity: qty }];
        }
        saveGuestCart(updated);
        setItems(updated);
        setTotal(calcTotal(updated));
        return;
      }

      // Authenticated: hit backend
      try {
        setError(null);
        await addToCart({ ...item, quantity: qty });
        await fetchCart();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to add item to cart";
        setError(msg);
        throw err;
      }
    },
    [authenticated, fetchCart],
  );

  // ── Remove item ──
  const removeItem = useCallback(
    async (item: Pick<CartItem, "productId" | "size" | "color">) => {
      const key = cartKey(item);
      if (!authenticated) {
        const updated = loadGuestCart().filter((i) => cartKey(i) !== key);
        saveGuestCart(updated);
        setItems(updated);
        setTotal(calcTotal(updated));
        return;
      }

      try {
        setError(null);
        await removeFromCart(item);
        await fetchCart();
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to remove item from cart";
        setError(msg);
        throw err;
      }
    },
    [authenticated, fetchCart],
  );

  // ── Update quantity ──
  const updateQuantity = useCallback(
    async (
      item: Pick<CartItem, "productId" | "size" | "color">,
      quantity: number,
    ) => {
      if (quantity < 1) return;
      const key = cartKey(item);

      if (!authenticated) {
        const updated = loadGuestCart().map((i) =>
          cartKey(i) === key ? { ...i, quantity } : i,
        );
        saveGuestCart(updated);
        setItems(updated);
        setTotal(calcTotal(updated));
        return;
      }

      try {
        setError(null);
        const existing = items.find((i) => cartKey(i) === key);
        if (!existing) return;
        await addToCart({ ...existing, quantity });
        await fetchCart();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to update quantity";
        setError(msg);
      }
    },
    [authenticated, fetchCart, items],
  );

  const clearCart = useCallback(() => {
    clearGuestCart();
    setItems([]);
    setTotal(0);
    setError(null);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
