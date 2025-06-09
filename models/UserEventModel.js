import mongoose from "mongoose";
import { EVENT_STATUS } from "../enums/eventStatus.js";

const userEventSchema = new mongoose.Schema(
  {
    
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [EVENT_STATUS.PENDING, EVENT_STATUS.REJECT, EVENT_STATUS.APPROVE],
      default: EVENT_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserEvents", userEventSchema);
