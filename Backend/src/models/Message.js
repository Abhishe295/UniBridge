import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
