import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

const checkToken = (req, res, next) => {
  const token = req.cookies?.["token"];

  if (!token) return next(new AppError("No token, authorization denied", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("jsonwebtoken error", error);
    }
    return next(new AppError("Invalid Token", 401));
  }
};

export const authMiddleware = (req, res, next) => {
  const user = checkToken(req, res, next);
  if (!user) return;
  req.user = user;
  next();
};

export const isAdmin = (req, res, next) => {
  const user = checkToken(req, res, next);
  if (!user) return;
  req.user = user;
  if (req.user?.role === "admin") {
    next();
  } else {
    return next(new AppError("You don't have access for this action", 401));
  }
};
