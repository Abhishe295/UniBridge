import Rating from "../models/Rating.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Helper from "../models/Helper.js";


// ================= CREATE RATING =================
export const createRating = async (req, res, next) => {
  try {
    const { bookingId, rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.status !== "completed") {
      res.status(400);
      throw new Error("Booking not completed yet");
    }

    // Prevent duplicate rating
    const existingRating = await Rating.findOne({
      booking: bookingId,
      from: req.user._id
    });

    if (existingRating) {
      res.status(400);
      throw new Error("You already rated this booking");
    }

    // Determine who is rating whom
    let toId;
    let toModel;

    if (req.user.role === "user") {
      toId = booking.helper;
      toModel = "Helper";
    } else {
      toId = booking.user;
      toModel = "User";
    }

    const newRating = await Rating.create({
      from: req.user._id,
      fromModel: req.user.role === "user" ? "User" : "Helper",
      to: toId,
      toModel,
      booking: bookingId,
      rating,
      review
    });

    // Recalculate average rating
    const ratings = await Rating.find({ to: toId });

    const avg =
      ratings.reduce((acc, item) => acc + item.rating, 0) /
      ratings.length;

    if (toModel === "Helper") {
      await Helper.findByIdAndUpdate(toId, {
        averageRating: avg.toFixed(1)
      });
    } else {
      await User.findByIdAndUpdate(toId, {
        averageRating: avg.toFixed(1)
      });
    }

    res.status(201).json({
      success: true,
      rating: newRating
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET RATINGS FOR PROFILE =================
export const getRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ to: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ratings
    });

  } catch (error) {
    next(error);
  }
};
