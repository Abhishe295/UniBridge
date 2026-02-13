import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Helper",
      required: true
    },

    category: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "accepted",
        "arriving",
        "completed",
        "cancelled",
        "reached"
      ],
      default: "waiting"
    },

    arrivalTime: {
      type: Date
    },

    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
