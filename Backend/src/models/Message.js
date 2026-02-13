import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: function () {
        return this.type === "booking";
      }
    },


    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["booking","support"],
      required: true
    },
    receiver: {
  type: mongoose.Schema.Types.ObjectId,
  required: function () {
    return this.type === "support";
  }
},

  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
