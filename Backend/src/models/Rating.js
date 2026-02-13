import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "fromModel"
    },

    fromModel: {
      type: String,
      required: true,
      enum: ["User", "Helper"]
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "toModel"
    },

    toModel: {
      type: String,
      required: true,
      enum: ["User", "Helper"]
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    review: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
