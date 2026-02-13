import express from "express";
import {
  createBooking,
  acceptBooking,
  completeBooking,
  getUserBookings,
  getHelperBookings,
  markReached,
  getBookingById
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), createBooking);
router.get("/user", protect, authorizeRoles("user"), getUserBookings);
router.get("/helper", protect, authorizeRoles("helper"), getHelperBookings);
router.put("/accept/:id", protect, authorizeRoles("helper"), acceptBooking);
router.put("/complete/:id", protect, authorizeRoles("user"), completeBooking);
router.put("/reached/:id", protect, authorizeRoles("helper"), markReached);
router.get("/:id",protect,getBookingById);


export default router;
