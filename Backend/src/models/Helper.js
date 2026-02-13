import mongoose from "mongoose";

const helperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "helper"
    },

    category: {
      type: String,
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: false
    },

    earnings: {
      type: Number,
      default: 0
    },

    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Helper", helperSchema);
