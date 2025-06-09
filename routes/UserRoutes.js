import express from "express";
import {
  login,
  logout,
  myProfile,
  signup,
} from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/myProfile", authMiddleware, myProfile);
router.post("/auth/logout", authMiddleware, logout);

export default router;
