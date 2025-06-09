import mongoose from "mongoose";

export const mongoDbConnection = async () => {
  // Database Connection
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB connection failed", error);
  }
};
