import Helper from "../models/Helper.js";
import Booking from "../models/Booking.js";


// ================= TOGGLE AVAILABILITY =================
export const toggleAvailability = async (req, res, next) => {
  try {
    const helper = await Helper.findById(req.user._id);

    helper.isAvailable = !helper.isAvailable;

    await helper.save();

    res.status(200).json({
      success: true,
      isAvailable: helper.isAvailable
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET HELPERS BY CATEGORY =================
export const getHelpersByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const helpers = await Helper.find({
      category,
      isAvailable: true
    }).select("-password");

    res.status(200).json({
      success: true,
      helpers
    });

  } catch (error) {
    next(error);
  }
};


// ================= HELPER DASHBOARD STATS =================
export const getHelperDashboard = async (req, res, next) => {
  try {
    const helperId = req.user._id;

    const totalBookings = await Booking.countDocuments({ helper: helperId });

    const completedBookings = await Booking.countDocuments({
      helper: helperId,
      status: "completed"
    });

    const pendingBookings = await Booking.countDocuments({
      helper: helperId,
      status: "waiting"
    });

    const helper = await Helper.findById(helperId);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        earnings: helper.earnings,
        isAvailable: helper.isAvailable
      }
    });

  } catch (error) {
    next(error);
  }
};
