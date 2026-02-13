import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Helper from "../models/Helper.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select("-password");

    if (!user) {
      user = await Helper.findById(decoded.id).select("-password");
    }

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};
