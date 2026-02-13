import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import { initSocket } from "./socket/socket.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import helperRoutes from "./routes/helperRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server); // ONLY THIS

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Helper Booking API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/helpers", helperRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/support", supportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
