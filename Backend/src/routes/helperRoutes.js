import express from "express";
import {
  toggleAvailability,
  getHelpersByCategory,
  getHelperDashboard
} from "../controllers/helperController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User side — view helpers
router.get("/category/:category", protect, authorizeRoles("user"), getHelpersByCategory);

// Helper side
router.put("/availability", protect, authorizeRoles("helper"), toggleAvailability);
router.get("/dashboard", protect, authorizeRoles("helper"), getHelperDashboard);

export default router;
