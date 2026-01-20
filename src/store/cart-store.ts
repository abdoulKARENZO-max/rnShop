//create our store
import { create } from "zustand";

// Define the structure of a single cart item
export type CartItemType = {
  id: number;
  title: string;
 
  heroImage:string;
  price: number;
  quantity: number;
  maxQuantity: number; // Maximum allowed quantity for this item
};

// Define the shape of our cart state and actions
type CartState = {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  getTotalPrice: () => string;
  getItemCount: () => number;
  resetCart: () => void;
};

// Initial state for the cart - empty array
const initialCartItems: CartItemType[] = [];

// Create the cart store using Zustand
export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  items: initialCartItems,

  // Add item to cart or update quantity if item already exists
  addItem: (item: CartItemType) => {
    const existingItem = get().items.find((i) => i.id === item.id);
    if (existingItem) {
      // Item exists - update quantity without exceeding maxQuantity
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity:Math.min(
                  i.quantity + item.quantity,i.maxQuantity
                ) ,
              }
            : i
        ),
      }));
    } else {
      // New item - add to cart
      set((state) => ({ items: [...state.items, item] }));
    }
  },

  // Remove item completely from cart by id
  removeItem: (id: number) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  // Increase quantity of specific item by 1 (respects maxQuantity)
  incrementItem: (id: number) =>
    set((state) => {
      /* if the product exist */
      
      /* if (!item) return state; */
      return {
        items: state.items.map((item) =>
          item.id === id && item.quantity < item.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }),

  // Decrease quantity of specific item by 1 (won't go below 1)
  decrementItem: (id: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),

  // Calculate total price of all items in cart (returns formatted string)
  getTotalPrice: () => {
    const { items } = get();
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2); // Format to 2 decimal places
  },

  // Get total number of items in cart (sum of all quantities)
  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  // Reset cart to initial empty state
  resetCart: () => set({ items: initialCartItems }),
}));
