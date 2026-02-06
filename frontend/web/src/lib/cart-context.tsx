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
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!authenticated) return;

    try {
      setLoading(true);
      setError(null);
      const cart: CartResponse = await getCart();
      setItems(cart.items);
      setTotal(cart.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch cart";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Fetch cart when component mounts or authentication changes
  useEffect(() => {
    if (authenticated) {
      fetchCart();
    }
  }, [authenticated, fetchCart]);

  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      if (!authenticated) {
        setError("Please log in to add items to cart");
        return;
      }

      try {
        setError(null);
        await addToCart(item);
        // Refresh cart after adding
        await fetchCart();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add item to cart";
        setError(errorMessage);
        throw err;
      }
    },
    [authenticated, fetchCart],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!authenticated) {
        setError("Please log in to remove items from cart");
        return;
      }

      try {
        setError(null);
        await removeFromCart(productId);
        // Refresh cart after removing
        await fetchCart();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to remove item from cart";
        setError(errorMessage);
        throw err;
      }
    },
    [authenticated, fetchCart],
  );

  const clearCart = useCallback(() => {
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
