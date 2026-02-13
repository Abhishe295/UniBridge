import express from "express";
import {
  getUserSupportMessages,
  getSupportUsers,
  getAdminSupportMessages
} from "../controllers/supportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/user", protect, authorizeRoles("user"), getUserSupportMessages);

router.get("/users", protect, authorizeRoles("admin"), getSupportUsers);

// 🔥 ADD THIS
router.get(
  "/admin/:userId",
  protect,
  authorizeRoles("admin"),
  getAdminSupportMessages
);

export default router;
