import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,
  successMessage: null,

  getCart: async () => {
    try {
      set({ loading: true, error: null, successMessage: null });
      const { user } = useAuthStore.getState();
      console.log(`token ${user?.token}`);
      if (!user?.token) {
        console.log(`token ${user?.token}`);
        set({ error: "Authentication token not found", loading: false });
        return;
      }

      const response = await axios.get("/cart", 
        {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data.cart);
      set({ cart: (response.data.cart), loading: false });
    } catch (error) {
      console.log(`getcart : ${error}`)
      set({ 
        error: error.response?.data?.message || "Failed to fetch cart", 
        loading: false 
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      set({ error: null, successMessage: null });
      const { user } = useAuthStore.getState();
      console.log(`sending : ${productId} from ${user?.username}`);

      if (!user?.token) {
        console.log(`token ${user?.token}`);
        set({ error: "Authentication token not found", loading: false });
        return;
      }

      const response = await axios.post(
        "/cart",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      set({ cart: response.data.cart, successMessage: "Product added to cart" });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to add product to cart" 
      });
    }
  },

  removeFromCart: async (productId) => {
    try {
      set({ error: null, successMessage: null ,loading: true});
      const { user } = useAuthStore.getState();
      console.log(`Token used: ${productId}`);
      if (!user?.token) {
        console.log(`token ${user?.token}`);
        set({ error: "Authentication token not found", loading: false });
        return;
      }

      const response = await axios.delete(`http://localhost:5173/cart/${productId}`,
         {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set({ cart: response.data.cart || [] ,loading: false, successMessage: "Product removed from cart" });
    } catch (error) {
      console.log(`removefromcart : ${error}`)
      set({ 
        error: error.response?.data?.message || "Failed to remove product from cart" ,loading: false
      });
    }
  },

  updateCartQuantity: async (productId, newQuantity) => {
    try {
      set({ loading: true, error: null, successMessage: null });
      const { user } = useAuthStore.getState();

      if (!user?.token) {
        console.log(`token ${user?.token}`);
        set({ error: "Authentication token not found", loading: false });
        return;
      }

      const response = await axios.post(
        `/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      set({ cart: response.data.cart, loading: false, successMessage: "Cart updated successfully" });
    } catch (error) {
      console.log(`updatecart : ${error}`)
      set({ 
        error: error.response?.data?.message || "Failed to update cart quantity", 
        loading: false 
      });
    }
  },

  buyCartItems: async () => {
    try {
      set({ loading: true, error: null, successMessage: null });
      const { user } = useAuthStore.getState();

      if (!user?.token) {
        console.log(`token ${user?.token}`);
        set({ error: "Authentication token not found", loading: false });
        return;
      }

      const response = await axios.post(
        "/cart/buy",
        {}, 
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      set({ cart: [], successMessage: response.data.message || "Purchase completed successfully" });
      set({loading: false});
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to complete purchase", 
        loading: false 
      });
    }
  },
}));
