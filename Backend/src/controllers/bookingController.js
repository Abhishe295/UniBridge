import Booking from "../models/Booking.js";
import Helper from "../models/Helper.js";
import { getIO } from "../socket/socket.js";


// ================= CREATE BOOKING =================
export const createBooking = async (req, res, next) => {
  try {
    const { helperId, category } = req.body;

    const helper = await Helper.findById(helperId);

    if (!helper) {
      res.status(404);
      throw new Error("Helper not found");
    }

    if (!helper.isAvailable) {
      res.status(400);
      throw new Error("Helper not available");
    }

    const booking = await Booking.create({
      user: req.user._id,
      helper: helperId,
      category,
      status: "waiting"
    });

    const io = getIO();

    // existing direct emit
    io.emit("bookingUpdate", {
      receiverId: helperId,
      booking
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};



// ================= ACCEPT BOOKING =================
export const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.status !== "waiting") {
      res.status(400);
      throw new Error("Booking already processed");
    }

    booking.status = "accepted";
    booking.arrivalTime = new Date(Date.now() + 15 * 60 * 1000);

    await booking.save();

    await Helper.findByIdAndUpdate(booking.helper, {
      isAvailable: false
    });

    const io = getIO();

    // existing direct emit
    io.emit("bookingUpdate", {
      receiverId: booking.user.toString(),
      booking
    });

    // 🔥 NEW: emit to booking room for real-time update
    io.to(`booking-${booking._id}`).emit("bookingUpdated", booking);

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};



// ================= COMPLETE BOOKING =================
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.status !== "reached") {
      res.status(400);
      throw new Error("Booking must be marked as reached first");
    }

    booking.status = "completed";
    booking.completedAt = new Date();

    await booking.save();

    await Helper.findByIdAndUpdate(booking.helper, {
      $inc: { earnings: 500 },
      isAvailable: true
    });

    const io = getIO();

    // 🔥 NEW: emit to booking room
    io.to(`booking-${booking._id}`).emit("bookingUpdated", booking);

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};



// ================= MARK REACHED =================
export const markReached = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.status !== "accepted") {
      res.status(400);
      throw new Error("Booking must be accepted first");
    }

    booking.status = "reached";
    await booking.save();

    const io = getIO();

    // 🔥 NEW: emit to booking room
    io.to(`booking-${booking._id}`).emit("bookingUpdated", booking);

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};

// ================= GET BOOKING BY ID =================
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name")
      .populate("helper", "name");

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      booking.helper._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized");
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};

// ================= GET USER BOOKINGS =================
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("helper", "name category averageRating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET HELPER BOOKINGS =================
export const getHelperBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ helper: req.user._id })
      .populate("user", "name averageRating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    next(error);
  }
};


