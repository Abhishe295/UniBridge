import { create } from "zustand";
import { getSocket } from "../socket";

const socket = getSocket();

export const useChatStore = create((set) => ({
  messages: [],

  sendMessage: (data) => {
    socket.emit("sendMessage", data);
  },

  listenMessages: () => {
    socket.on("receiveMessage", (msg) => {
      set((state) => ({
        messages: [...state.messages, msg]
      }));
    });
  }
}));
