import { Server } from "socket.io";
import Message from "../models/Message.js";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // ===== REGISTER USER =====
    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User Registered:", userId);
    });

    // ===== SEND MESSAGE =====
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          message
        });

        const receiverSocket = onlineUsers.get(receiverId);

        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", newMessage);
        }

      } catch (error) {
        console.error("Message error:", error.message);
      }
    });

    // ===== BOOKING STATUS UPDATE =====
    socket.on("bookingUpdate", ({ receiverId, booking }) => {
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("bookingUpdated", booking);
      }
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      }

      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
