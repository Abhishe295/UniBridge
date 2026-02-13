// socket/socket.js
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

    // ================= REGISTER USER =================
    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User Registered:", userId);
    });

    // ================= DIRECT MESSAGE =================
    socket.on("sendDirectMessage", async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          message
        });

        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveDirectMessage", newMessage);
        }
      } catch (error) {
        console.error("Direct Message Error:", error.message);
      }
    });

    // ================= BOOKING ROOM JOIN =================
    socket.on("joinBookingRoom", (bookingId) => {
      const roomName = `booking-${bookingId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined ${roomName}`);
    });

    // ================= BOOKING CHAT MESSAGE =================
    socket.on("sendBookingMessage", async ({ bookingId, senderId, message }) => {
      try {
        if (!bookingId || !senderId || !message) return;

        const newMessage = await Message.create({
          booking: bookingId,
          sender: senderId,
          message
        });

        const roomName = `booking-${bookingId}`;

        io.to(roomName).emit("receiveBookingMessage", newMessage);

      } catch (error) {
        console.error("Booking Message Error:", error.message);
      }
    });

    // ================= BOOKING STATUS UPDATE =================
    socket.on("bookingUpdate", ({ receiverId, booking }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("bookingUpdated", booking);
      }
    });

    // ================= GENERIC ROOM CHAT =================
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("sendRoomMessage", ({ room, message, sender }) => {
      io.to(room).emit("receiveRoomMessage", {
        message,
        sender,
        createdAt: new Date()
      });
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      }
      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }
  return io;
};
