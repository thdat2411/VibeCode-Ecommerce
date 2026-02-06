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
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  Address,
} from "@/lib/api/addresses";
import { useAuth } from "./auth-context";

interface AddressContextType {
  addresses: Address[];
  defaultAddress: Address | null;
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addNewAddress: (address: Omit<Address, "id">) => Promise<Address>;
  updateExistingAddress: (
    id: string,
    address: Partial<Address>,
  ) => Promise<Address>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!authenticated) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch addresses";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Fetch addresses when component mounts or authentication changes
  useEffect(() => {
    if (authenticated) {
      fetchAddresses();
    }
  }, [authenticated, fetchAddresses]);

  const addNewAddress = useCallback(
    async (address: Omit<Address, "id">) => {
      if (!authenticated) {
        throw new Error("Please log in to add addresses");
      }

      try {
        setError(null);
        const newAddress = await addAddress(address);
        setAddresses((prev) => [...prev, newAddress]);
        return newAddress;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add address";
        setError(errorMessage);
        throw err;
      }
    },
    [authenticated],
  );

  const updateExistingAddress = useCallback(
    async (id: string, address: Partial<Address>) => {
      if (!authenticated) {
        throw new Error("Please log in to update addresses");
      }

      try {
        setError(null);
        const updated = await updateAddress(id, address);
        setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return updated;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update address";
        setError(errorMessage);
        throw err;
      }
    },
    [authenticated],
  );

  const removeAddress = useCallback(
    async (id: string) => {
      if (!authenticated) {
        throw new Error("Please log in to delete addresses");
      }

      try {
        setError(null);
        await deleteAddress(id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete address";
        setError(errorMessage);
        throw err;
      }
    },
    [authenticated],
  );

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    );
  }, []);

  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || null;

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddress,
        loading,
        error,
        fetchAddresses,
        addNewAddress,
        updateExistingAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddresses must be used within AddressProvider");
  }
  return context;
}
