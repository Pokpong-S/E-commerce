import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './auth';

const base = import.meta.env.base_port;

export const useAdminStore = create((set) => ({
  users: [],
  products: [],
  totalPages: 1,
  fetchUsers: async (page = 1) => {
    const { user } = useAuthStore.getState();
    try {
      const { data } = await axios.get(`${base}/admin/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (data.success) {
        set({ users: data.data, totalPages: data.totalPages });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },
  fetchProducts: async (page = 1) => {
    const { user } = useAuthStore.getState();
    try {
      const { data } = await axios.get(`${base}/api/products?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (data.success) {
        set({ products: data.data, totalPages: data.totalPages });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
  approveMerchant: async (id) => {
    const { user } = useAuthStore.getState();
    try {
      await axios.post(`${base}/admin/approve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error('Error approving merchant:', error);
    }
  },
  rejectMerchant: async (id) => {
    const { user } = useAuthStore.getState();
    try {
      await axios.post(`${base}/admin/reject/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error('Error rejecting merchant:', error);
    }
  },
  deleteProduct: async (id) => {
    const { user } = useAuthStore.getState();
    try {
      await axios.delete(`${base}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },
}));
