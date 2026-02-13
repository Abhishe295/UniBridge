import Message from "../models/Message.js";
import User from "../models/User.js";


// ================= GET USER SUPPORT MESSAGES =================
export const getUserSupportMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      type: "support",
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET ALL SUPPORT USERS (ADMIN) =================
export const getSupportUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email");

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    next(error);
  }
};

export const getAdminSupportMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      type: "support",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    next(error);
  }
};

