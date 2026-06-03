import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],  // Current Cart Items
      orders: [], // Permanent Order History
      
      // ✅ PERSISTENT ADDRESS STATE
      // This will stay saved until the user manually edits it
      address: {
        name: "Rajesh Kumar",
        street: "123 MG Road, Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400069",
        phone: "+91 98765 43210",
      },

      // ✅ ACTION TO UPDATE ADDRESS
      setAddress: (newAddress) => set({ address: newAddress }),

      // ✅ ADD ITEM (Checks for duplicates)
      addItem: (product) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === product.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: (i.quantity || 1) + (product.quantity || 1) }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: product.quantity || 1 }],
          };
        }),

      // ✅ INCREASE QUANTITY
      increase: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          ),
        })),

      // ✅ DECREASE QUANTITY
      decrease: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      // ✅ UPDATE QUANTITY (Direct manual input)
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ),
        })),

      // ✅ REMOVE ITEM COMPLETELY
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      // ✅ CLEAR CART ONLY
      clearCart: () => set({ items: [] }),

      /**
       * ✅ PLACE ORDER
       * Captures current cart items and address to prevent UI crashes.
       */
      placeOrder: (orderData = {}) => {
        const { items, address } = get();
        
        if (items.length === 0) return null;

        const totalAmount = items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 
          0
        );

        const newOrder = {
          id: `BV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: "Processing",
          items: [...items], 
          address: { ...address }, // Snapshots address at time of order
          total: totalAmount,
          ...orderData, 
        };

        set((state) => ({
          orders: [newOrder, ...state.orders], 
          items: [], 
        }));

        return newOrder;
      },
    }),
    {
      name: "bellavista-cart-storage", // Key used in LocalStorage
    }
  )
);