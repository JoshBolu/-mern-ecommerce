import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupon");
      set({ coupon: response.data.coupon[0]});
    } catch (error) {
      console.log("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupon/validate", { code });
      set({
        coupon: response.data,
        isCouponApplied: true,
      });
      get().calculateTotals(); 
      toast.success("Coupon applied successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed successfully");
  },
  getCartItems: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data, loading: false });
      // console.log(response.data);
      get().calculateTotals();
    } catch (error) {
      set({ cart: [], loading: false });
      toast.error(error.response.data.message || "failed to fetch cart items");
    }
  },

  addToCart: async (product) => {
    set({ loading: true });
    try {
      await axios.post("/cart", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      set({ loading: false });
      get().calculateTotals();
      toast.success("Product added to cart", { id: "addToCart" });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "failed to fetch cart items");
    }
  },

  deleteFromCart: async (productId) => {
    // Note: For DELETE requests, the second argument is a config object.
    // To send a request body (e.g., productId), we must pass it inside the 'data' key.
    set({ loading: true });
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => {
        const newCart = prevState.cart.filter((item) => item._id !== productId);
        return { cart: newCart };
      });
      set({ loading: false });
      get().calculateTotals();
      toast.success("Product removed from cart", { id: "removeFromCart" });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "failed to fetch cart items");
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true });
    try {
      if (quantity === 0) {
        get().deleteFromCart(productId);
        return;
      }
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => {
        const newCart = prevState.cart.map((item) => {
          if (productId === item._id) {
            return { ...item, quantity };
          } else {
            return item;
          }
        });
        return { cart: newCart };
      });
      set({ loading: false });
      get().calculateTotals();
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data || "failed to fetch cart items");
    }
  },

  calculateTotals: async () => {
    const { cart, coupon, isCouponApplied } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;

    if (coupon && isCouponApplied) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }
    set({ subTotal, total });
  },

  clearCart: async () => {
    set({
      cart: [],
      total: 0,
      subTotal: 0,
      isCouponApplied: false,
      coupon: null,
    });
  },
}));
