import Message from "../models/Message.js";
import Booking from "../models/Booking.js";

// ================= GET MESSAGES BY BOOKING =================
export const getMessagesByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    // Only booking user or helper allowed
    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.helper.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized for this booking");
    }

    const messages = await Message.find({ booking: bookingId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    next(error);
  }
};

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res, next) => {
  try {
    const { bookingId, message } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    // Only booking user or helper allowed
    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.helper.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized for this booking");
    }

    const newMessage = await Message.create({
      booking: bookingId,
      sender: req.user._id,
      message
    });

    res.status(201).json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    next(error);
  }
};
