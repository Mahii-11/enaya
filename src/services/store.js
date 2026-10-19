import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart } from "../cart/cartSlice";

// প্রজেক্টের নাম দিয়ে key, যাতে অন্য প্রজেক্টের cart-এর সাথে না মেশে।
// cart-এর শেপ বদলালে _v2 করবে, তাহলে পুরোনো data এড়ানো যাবে।
const CART_STORAGE_KEY = "enayas_cart_v1";

// ভাঙা বা নষ্ট data ফিল্টার করে: array না হলে বা item-এ slug না থাকলে বাদ
const parseCart = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === "object" && item.slug);
  } catch {
    return [];
  }
};

// private mode বা blocked storage-এ localStorage অ্যাক্সেসই exception ছুঁড়তে পারে
const readSavedCart = () => {
  try {
    return parseCart(localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
};

// showCartPopup ও lastAdded সবসময় ডিফল্টে শুরু হয়, যাতে refresh-এ drawer খোলা না থাকে
// বা পুরোনো toast আবার না বাজে
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: { cart: readSavedCart(), showCartPopup: false, lastAdded: null },
  },
});

// Auto-save: শুধু cart items সেভ হয়, বদলালেই লেখে
let lastSaved = JSON.stringify(store.getState().cart.cart);
store.subscribe(() => {
  const next = JSON.stringify(store.getState().cart.cart);
  if (next === lastSaved) return;
  lastSaved = next;
  try {
    localStorage.setItem(CART_STORAGE_KEY, next);
  } catch {
    /* storage full/blocked: এই session-এ cart চলবে */
  }
});

// Multi-tab sync: এক ট্যাবে cart বদলালে অন্য ট্যাবেও আপডেট হয়
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== CART_STORAGE_KEY) return;
    const incoming = parseCart(e.newValue);
    const serialized = JSON.stringify(incoming);
    if (serialized === lastSaved) return; // নিজের লেখা ফিরে এলে loop হবে না
    lastSaved = serialized;
    store.dispatch(replaceCart(incoming));
  });
}

export default store;
