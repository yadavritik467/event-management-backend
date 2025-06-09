import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    capacity: {
      type: Number,
      required: true,
      default: 0,
      min: [1, "Capacity must be at least 1"],
    },
    approveUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    date: {
      type: Date,
      require: true,
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Date must be in the future",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Events", eventSchema);
