// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Cart Store (Zustand)
// ─────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopifyCart } from '@/types';

interface CartStore {
  cartId: string | null;
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;

  setCartId: (id: string) => void;
  setCart: (cart: ShopifyCart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartId: null,
      cart: null,
      isOpen: false,
      isLoading: false,

      setCartId: (id) => set({ cartId: id }),
      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearCart: () => set({ cartId: null, cart: null }),
    }),
    {
      name: 'lifestyle-cart',
      partialize: (state) => ({ cartId: state.cartId }), // Persiste só o ID
    }
  )
);
