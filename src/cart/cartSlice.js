import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  showCartPopup: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {


       addItem(state, action) {

           const newItem = action.payload;

                const existingItem = state.cart.find(
                 (item) =>
                 item.product_slug === newItem.product_slug &&
                 (item.variation_id || 0) === (newItem.variation_id || 0) &&
                 (item.color_id || 0) === (newItem.color_id || 0)
                );

                if (existingItem) {
                existingItem.quantity += newItem.quantity ?? 1;
                existingItem.totalPrice =
                existingItem.quantity * existingItem.discount_price;
                } else {

                 state.cart.push({
                 ...newItem,
                 product_id: newItem.product_id || newItem.id,
                 quantity: newItem.quantity ?? 1,
                 totalPrice: (newItem.quantity ?? 1) * newItem.discount_price,
                 size_id: newItem.size_id || 0,
                 color_id: newItem.color_id || 0,
                 variation_id: newItem.variation_id || 0,
                 });

                }
                 state.showCartPopup = true;

               },
        



        deleteItem(state, action) {
            state.cart = state.cart.filter((item) => item.product_slug !== action.payload);
        },
        increaseItemQuantity(state, action) {
          const item = state.cart.find(
          (item) => item.product_slug === action.payload
          );

          if (item) {
          item.quantity++;
          item.totalPrice = item.quantity * item.discount_price;
          }
          },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.product_slug === action.payload);

            if (item && item.quantity > 1) {
                 item.quantity--;
                 item.totalPrice = item.quantity * item.discount_price;
            }
           
        },

        clearCart(state) {
            state.cart = [];
        },
         hideCartPopup(state) {
      state.showCartPopup = false;
    }
    },
});

export const {addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart, hideCartPopup} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  )

export const getTotalCartPrice = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0)
  )  

export const getCart = (state) => state.cart.cart;  
