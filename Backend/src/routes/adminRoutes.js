import express from "express";
import {
  getAllUsers,
  getAllHelpers,
  getActiveHelpers,
  getAllBookings,
  getPlatformStats,
  deleteUser,
  deleteHelper
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes protected & admin only
router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/helpers", getAllHelpers);
router.get("/helpers/active", getActiveHelpers);
router.get("/bookings", getAllBookings);
router.get("/stats", getPlatformStats);

router.delete("/user/:id", deleteUser);
router.delete("/helper/:id", deleteHelper);

export default router;
