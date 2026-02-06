import { useCallback } from "react";
import { useAddresses } from "@/lib/address-context";
import { useNotification } from "@/lib/notification-context";
import { Address } from "@/lib/api/addresses";

/**
 * useAddressActions hook for address management
 * Handles adding, updating, and removing addresses
 *
 * Usage:
 * const { add, update, remove, refresh, setDefault } = useAddressActions();
 *
 * // Add address
 * await add({ firstName: "John", lastName: "Doe", ... });
 *
 * // Update address
 * await update("123", { city: "New City" });
 *
 * // Remove address
 * await remove("123");
 *
 * // Set as default
 * setDefault("123");
 *
 * // Refresh addresses
 * await refresh();
 */
export function useAddressActions() {
    const { addNewAddress, updateExistingAddress, removeAddress, fetchAddresses, setDefaultAddress } = useAddresses();
    const { addToast } = useNotification();

    const add = useCallback(
        async (address: Omit<Address, "id">) => {
            try {
                const newAddress = await addNewAddress(address);
                addToast("Address added successfully!", "success");
                return newAddress;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to add address";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [addNewAddress, addToast]
    );

    const update = useCallback(
        async (id: string, address: Partial<Address>) => {
            try {
                const updated = await updateExistingAddress(id, address);
                addToast("Address updated successfully!", "success");
                return updated;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to update address";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [updateExistingAddress, addToast]
    );

    const remove = useCallback(
        async (id: string) => {
            try {
                await removeAddress(id);
                addToast("Address removed successfully!", "success");
                return true;
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to remove address";
                addToast(errorMsg, "error");
                throw error;
            }
        },
        [removeAddress, addToast]
    );

    const refresh = useCallback(async () => {
        try {
            await fetchAddresses();
            return true;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to fetch addresses";
            addToast(errorMsg, "error");
            throw error;
        }
    }, [fetchAddresses, addToast]);

    const setDefault = useCallback(
        (id: string) => {
            setDefaultAddress(id);
            addToast("Default address updated", "info");
        },
        [setDefaultAddress, addToast]
    );

    return {
        add,
        update,
        remove,
        refresh,
        setDefault,
    };
}
