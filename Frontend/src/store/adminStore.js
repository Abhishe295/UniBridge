import { create } from "zustand";
import api from "../lib/axios";

export const useAdminStore = create((set) => ({
  users: [],
  helpers: [],
  activeHelpers: [],
  bookings: [],
  stats: null,
  loading: false,

  fetchUsers: async () => {
    const res = await api.get("/admin/users");
    set({ users: res.data.users });
  },

  fetchHelpers: async () => {
    const res = await api.get("/admin/helpers");
    set({ helpers: res.data.helpers });
  },

  fetchActiveHelpers: async () => {
    const res = await api.get("/admin/helpers/active");
    set({ activeHelpers: res.data.helpers });
  },

  fetchBookings: async () => {
    const res = await api.get("/admin/bookings");
    set({ bookings: res.data.bookings });
  },

  fetchStats: async () => {
    const res = await api.get("/admin/stats");
    set({ stats: res.data.stats });
  },

  deleteUser: async (id) => {
    await api.delete(`/admin/user/${id}`);
    set((state) => ({
      users: state.users.filter((u) => u._id !== id)
    }));
  },

  deleteHelper: async (id) => {
    await api.delete(`/admin/helper/${id}`);
    set((state) => ({
      helpers: state.helpers.filter((h) => h._id !== id)
    }));
  }
}));
