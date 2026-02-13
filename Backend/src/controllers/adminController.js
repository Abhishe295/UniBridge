import User from "../models/User.js";
import Helper from "../models/Helper.js";
import Booking from "../models/Booking.js";


// ================= GET ALL USERS =================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET ALL HELPERS =================
export const getAllHelpers = async (req, res, next) => {
  try {
    const helpers = await Helper.find().select("-password");

    res.status(200).json({
      success: true,
      count: helpers.length,
      helpers
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET ACTIVE HELPERS =================
export const getActiveHelpers = async (req, res, next) => {
  try {
    const helpers = await Helper.find({ isAvailable: true }).select("-password");

    res.status(200).json({
      success: true,
      count: helpers.length,
      helpers
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET ALL BOOKINGS =================
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("helper", "name email category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET PLATFORM STATS =================
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHelpers = await Helper.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    const helpers = await Helper.find();

    const totalEarnings = helpers.reduce(
      (acc, helper) => acc + helper.earnings,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalHelpers,
        totalBookings,
        completedBookings,
        totalEarnings
      }
    });

  } catch (error) {
    next(error);
  }
};


// ================= DELETE USER =================
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {
    next(error);
  }
};


// ================= DELETE HELPER =================
export const deleteHelper = async (req, res, next) => {
  try {
    await Helper.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Helper deleted"
    });

  } catch (error) {
    next(error);
  }
};
