import express from "express";
import { createRating, getRatings } from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRating);
router.get("/:id", getRatings);

export default router;
