import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
const base = import.meta.env.base_port;
const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
export const useAuthStore = create((set) => ({
  user: storedUser,
  error: null,
  loading: false,

  signup: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base}/auth/signup`, 
        { username, password },
        { 'Content-Type': 'application/json'}
      );
      const { user, token } = res.data;
      Cookies.set("user", JSON.stringify({ username: user.username, role: user.role , token }), { expires: 30 });
      set({ user: { username: user.username, role: user.role, token }, loading: false });
      return user;
    } catch (err) {
      console.log("error", err);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base}/auth/login`,  
        { username, password },
        { 'Content-Type': 'application/json'}
      );
      const { user, token } = res.data;
      Cookies.set("user", JSON.stringify({ username: user.username , role: user.role, token }), { expires: 30 });
      set({ user: { username: user.username, role: user.role, token }, loading: false });
      return user;
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    Cookies.remove("user");
    set({ user: null, error: null });
  },
}));
