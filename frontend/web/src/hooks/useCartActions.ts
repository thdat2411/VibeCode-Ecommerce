import { useCallback } from "react";
import { useCart } from "@/lib/cart-context";
import { useNotification } from "@/lib/notification-context";
import { CartItem } from "@/lib/api/cart";

/**
 * useCartActions hook for cart operations
 * Handles adding, removing items and managing cart state
 *
 * Usage:
 * const { add, remove, refresh } = useCartActions();
 *
 * // Add item
 * await add({ productId: "123", name: "Product", price: 100, image: "url", quantity: 1 });
 *
 * // Remove item
 * await remove("123");
 *
 * // Refresh cart
 * await refresh();
 */
export function useCartActions() {
    const { addItem, removeItem, fetchCart } = useCart();
    const { addToast } = useNotification();

    const add = useCallback(
        async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
            try {
                await addItem(item);
                addToast(`${item.name} added to cart!`, "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to add item";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [addItem, addToast]
    );

    const remove = useCallback(
        async (productId: string) => {
            try {
                await removeItem(productId);
                addToast("Item removed from cart", "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to remove item";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [removeItem, addToast]
    );

    const refresh = useCallback(async () => {
        try {
            await fetchCart();
            return true;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to refresh cart";
            addToast(errorMsg, "error");
            throw error;
        }
    }, [fetchCart, addToast]);

    return {
        add,
        remove,
        refresh,
    };
}
