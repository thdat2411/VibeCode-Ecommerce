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
  updateCartItemQuantity,
  clearCart as clearUserCart,
  createGuestCart,
  getGuestCart,
  addToGuestCart,
  removeFromGuestCart,
  clearGuestCart as clearGuestCartApi,
  mergeCart,
  getGuestCartId,
  setGuestCartId,
  clearGuestCartId,
  CartItem,
  CartResponse,
  cartKey,
} from "@/lib/api/cart";
import { useAuth } from "./auth-context";

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
  clearCart: () => Promise<void>;
  note: string;
  setNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const applyCart = useCallback((cart: CartResponse) => {
    setItems(cart.items);
  }, []);

  // ── Fetch user cart ──────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!authenticated) return;
    try {
      setLoading(true);
      setError(null);
      applyCart(await getCart());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, [authenticated, applyCart]);

  // ── On auth change ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!authenticated) {
      // Load existing guest cart from Redis (if cookie exists)
      const cartId = getGuestCartId();
      if (cartId) {
        setLoading(true);
        getGuestCart(cartId)
          .then(applyCart)
          .catch(() => {
            // Stale/expired guest cart — reset
            clearGuestCartId();
            setItems([]);
          })
          .finally(() => setLoading(false));
      } else {
        setItems([]);
      }
      return;
    }

    // Authenticated: merge guest cart then fetch user cart
    const mergeAndFetch = async () => {
      setLoading(true);
      try {
        const cartId = getGuestCartId();
        if (cartId) {
          await mergeCart(cartId); // merges guest → user, deletes guest key in Redis
          clearGuestCartId(); // remove cookie
        }
        applyCart(await getCart());
      } catch {
        // best-effort — still load user cart
        try {
          applyCart(await getCart());
        } catch {
          /* ignore */
        }
      } finally {
        setLoading(false);
      }
    };

    mergeAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  // ── Add item ─────────────────────────────────────────────────────────────
  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;

      if (!authenticated) {
        try {
          setError(null);
          const cartId = getGuestCartId();
          let cart: CartResponse;

          if (!cartId) {
            // First item ever → create cart in Redis, get back cart_id
            const result = await createGuestCart({ ...item, quantity: qty });
            setGuestCartId(result.cartId);
            cart = result.cart;
          } else {
            cart = await addToGuestCart(cartId, { ...item, quantity: qty });
          }
          applyCart(cart);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to add item");
          throw err;
        }
        return;
      }

      try {
        setError(null);
        applyCart(await addToCart({ ...item, quantity: qty }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
        throw err;
      }
    },
    [authenticated, applyCart],
  );

  // ── Remove item ──────────────────────────────────────────────────────────
  const removeItem = useCallback(
    async (item: Pick<CartItem, "productId" | "size" | "color">) => {
      if (!authenticated) {
        const cartId = getGuestCartId();
        if (!cartId) return;
        try {
          setError(null);
          applyCart(await removeFromGuestCart(cartId, item));
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to remove item",
          );
          throw err;
        }
        return;
      }

      try {
        setError(null);
        applyCart(await removeFromCart(item));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove item");
        throw err;
      }
    },
    [authenticated, applyCart],
  );

  // ── Update quantity ──────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (
      item: Pick<CartItem, "productId" | "size" | "color">,
      quantity: number,
    ) => {
      if (quantity < 1) return;

      // Optimistic update — immediately reflect new quantity in UI
      const key = cartKey(item);
      setItems((prev) =>
        prev.map((i) => (cartKey(i) === key ? { ...i, quantity } : i)),
      );

      if (!authenticated) {
        const cartId = getGuestCartId();
        if (!cartId) return;
        // Capture the current item snapshot before any async ops
        let snapshot: CartItem | undefined;
        setItems((prev) => {
          snapshot = prev.find((i) => cartKey(i) === key);
          return prev; // no-op, just reading
        });
        if (!snapshot) return;
        const existing = snapshot;
        try {
          setError(null);
          await removeFromGuestCart(cartId, item);
          const after = await addToGuestCart(cartId, { ...existing, quantity });
          applyCart(after);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update quantity",
          );
          // Rollback: re-fetch from Redis
          const cid = getGuestCartId();
          if (cid)
            applyCart(
              await getGuestCart(cid).catch(
                () => ({ items: [], total: 0 }) as CartResponse,
              ),
            );
        }
        return;
      }

      try {
        setError(null);
        applyCart(await updateCartItemQuantity(item, quantity));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update quantity",
        );
      }
    },
    [authenticated, applyCart],
  );

  // ── Clear cart ───────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (!authenticated) {
      const cartId = getGuestCartId();
      if (cartId) {
        try {
          await clearGuestCartApi(cartId);
        } catch {
          /* ignore */
        }
        clearGuestCartId();
      }
    } else {
      try {
        await clearUserCart();
      } catch {
        /* ignore */
      }
    }
    setItems([]);
    setNote("");
    setError(null);
  }, [authenticated]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Clear note when cart becomes empty
  useEffect(() => {
    if (items.length === 0) setNote("");
  }, [items.length]);

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
        note,
        setNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
