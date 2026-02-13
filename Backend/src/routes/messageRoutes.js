import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMessagesByBooking,
  sendMessage
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:bookingId", protect, getMessagesByBooking);
router.post("/", protect, sendMessage);

export default router;
