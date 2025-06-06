import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[] | null
}

const initialState: CartState = {
  items: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<{id: string, value: string}>) => {
      if (state.items) {
        const { id } = action.payload;
        const existingItemIndex = state.items?.findIndex(item => item.id === id) || -1;

        if (existingItemIndex !== -1) {
          const existingItem = state.items[existingItemIndex];
          const quantity = +(action.payload.value.replace(/[^\d]/, '').slice(-4))
          
          if (quantity < 1) {
            state.items?.splice(existingItemIndex, 1);
          } else {
            existingItem.quantity = quantity;
          }
        }
      }
    },
    increment: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const { id, name, price } = action.payload;
      const existingItem = state.items?.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items?.push({ id, name, price, quantity: 1 });
      }
    },

    decrement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItemIndex = state.items?.findIndex(item => item.id === id) || -1;
      
      if (existingItemIndex !== -1 && state.items) {
        const existingItem = state.items[existingItemIndex];
        
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items?.splice(existingItemIndex, 1);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { increment, decrement, setValue, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;