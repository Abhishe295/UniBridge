import express from "express";
import {
  createBooking,
  acceptBooking,
  completeBooking,
  getUserBookings,
  getHelperBookings
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), createBooking);
router.get("/user", protect, authorizeRoles("user"), getUserBookings);
router.get("/helper", protect, authorizeRoles("helper"), getHelperBookings);
router.put("/accept/:id", protect, authorizeRoles("helper"), acceptBooking);
router.put("/complete/:id", protect, authorizeRoles("user"), completeBooking);

export default router;
