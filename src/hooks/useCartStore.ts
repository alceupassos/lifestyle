// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Cart Store (Zustand) — Life Style 2.0
// ─────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopifyCart } from '@/types';

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  currencyCode: string;
  image?: string;
  quantity: number;
  handle: string;
}

interface CartStore {
  cartId: string | null;
  cart: ShopifyCart | null;
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  setCartId: (id: string) => void;
  setCart: (cart: ShopifyCart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartId: null,
      cart: null,
      items: [],
      isOpen: false,
      isLoading: false,

      setCartId: (id) => set({ cartId: id }),
      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearCart: () => set({ cartId: null, cart: null, items: [] }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
    }),
    {
      name: 'lifestyle-cart-v2',
      partialize: (state) => ({ cartId: state.cartId, items: state.items }),
    }
  )
);
