import mongoose from "mongoose";

export const mongoDbConnection = async (url) => {
  // Database Connection
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB connection failed", error);
  }
};
