import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";

export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,

  fetchUserBookings: async () => {
    const res = await api.get("/bookings/user");
    set({ bookings: res.data.bookings });
  },

  fetchHelperBookings: async () => {
    const res = await api.get("/bookings/helper");
    set({ bookings: res.data.bookings });
  },

  createBooking: async (data) => {
    await api.post("/bookings", data);
    toast.success("Booking Created");
  },

  acceptBooking: async (id) => {
    await api.put(`/bookings/accept/${id}`);
    toast.success("Accepted");
  },

  completeBooking: async (id) => {
    await api.put(`/bookings/complete/${id}`);
    toast.success("Completed");
  },
  markReached: async (id) => {
   await api.put(`/bookings/reached/${id}`);
}

}));
