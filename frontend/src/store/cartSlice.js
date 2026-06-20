import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [], totalItems: 0, totalPrice: 0 };

const calcTotals = (items) => {
  let totalItems = 0; let totalPrice = 0;
  items.forEach((i) => {
    const itemPrice = i.price ?? ((i.product?.discountPrice > 0) ? i.product?.discountPrice : (i.product?.price || 0));
    totalItems += i.quantity;
    totalPrice += i.quantity * itemPrice;
  });
  return { totalItems, totalPrice };
}

const cartSlice = createSlice({ name: 'cart', initialState, reducers: {
  setCart(state, action){ state.items = action.payload; const t = calcTotals(state.items); state.totalItems = t.totalItems; state.totalPrice = t.totalPrice; },
  addItem(state, action){ const item = action.payload; const idx = state.items.findIndex(i=>i.product === item.product); if(idx>-1) state.items[idx].quantity += item.quantity; else state.items.push(item); const t = calcTotals(state.items); state.totalItems = t.totalItems; state.totalPrice = t.totalPrice; },
  updateItem(state, action){ const { product, quantity } = action.payload; const idx = state.items.findIndex(i=>i.product===product); if(idx>-1) state.items[idx].quantity = quantity; const t = calcTotals(state.items); state.totalItems = t.totalItems; state.totalPrice = t.totalPrice; },
  removeItem(state, action){ state.items = state.items.filter(i=>i.product !== action.payload); const t = calcTotals(state.items); state.totalItems = t.totalItems; state.totalPrice = t.totalPrice; },
  clearCart(state){ state.items = []; state.totalItems=0; state.totalPrice=0; }
}});

export const { setCart, addItem, updateItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
