import UserModel from "../models/UserModel.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

export const signup = catchAsync(async (req, res, next) => {
  let { userNameOrEmail, password } = req.body;
  userNameOrEmail = userNameOrEmail?.toLowerCase();
  // Check if user exists
  let user = await UserModel.findOne({ userNameOrEmail });
  if (user) return next(new AppError("User already exists", 400));

  // Save User
  await UserModel.create({ userNameOrEmail, password });

  return sendResponse(res, "User registered successfully", 201);
});

export const login = catchAsync(async (req, res, next) => {
  let { userNameOrEmail, password } = req.body;
  userNameOrEmail = userNameOrEmail?.toLowerCase();

  // Find user
  const user = await UserModel.findOne({ userNameOrEmail });
  if (!user) return next(new AppError("User Does not exists", 404));

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new AppError("Invalid credential", 400));

  // Generate JWT
  const token = user.generateToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
  return sendResponse(res, "Login Successfully", 200);
});

export const myProfile = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await UserModel.findById(_id).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ user });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", // match what you used while setting
  });
  return res.status(200).json({ message: "Logged out" });
});
