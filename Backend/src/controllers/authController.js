import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Helper from "../models/Helper.js";
import { generateToken } from "../config/generateToken.js";


// ================= REGISTER =================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, category } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Check existing email in both collections
    const userExists = await User.findOne({ email });
    const helperExists = await Helper.findOne({ email });

    if (userExists || helperExists) {
      res.status(400);
      throw new Error("Email already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newAccount;

    if (role === "helper") {
      if (!category) {
        res.status(400);
        throw new Error("Category required for helper");
      }

      newAccount = await Helper.create({
        name,
        email,
        password: hashedPassword,
        category
      });

    } else {
      newAccount = await User.create({
        name,
        email,
        password: hashedPassword
      });
    }

    generateToken(res, newAccount._id);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: newAccount._id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role
      }
    });

  } catch (error) {
    next(error);
  }
};


// ================= LOGIN =================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const helper = await Helper.findOne({ email });

    const account = user || helper;

    if (!account) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    generateToken(res, account._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role
      }
    });

  } catch (error) {
    next(error);
  }
};


// ================= LOGOUT =================
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// ================= GET CURRENT USER =================
export const getMe = async (req, res, next) => {
  try {
    // req.user comes from protect middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

