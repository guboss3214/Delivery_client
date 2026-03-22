import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

interface CartState {
  items: CartItem[];
  couponDiscount: number;
}

const initialState: CartState = {
  items: [],
  couponDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(i => i.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    applyCoupon: (state, action: PayloadAction<number>) => {
      state.couponDiscount = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.couponDiscount = 0;
    },
    reorderItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.couponDiscount = 0;
    }
  }
});

export const { addItem, removeItem, updateQuantity, applyCoupon, clearCart, reorderItems } = cartSlice.actions;
export default cartSlice.reducer;
