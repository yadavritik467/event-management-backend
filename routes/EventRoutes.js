import express from "express";
import {
  adminEditEventRegistration,
  adminEventRegistration,
  approveUserRegistration,
  getAllEvents,
  registerInEvent,
  singleEvents
} from "../controllers/EventController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/admin/registrations",
  authMiddleware,
  isAdmin,
  adminEventRegistration
);
router.put(
  "/admin/registrations/:eventId",
  authMiddleware,
  adminEditEventRegistration
);
router.get("/events", authMiddleware, getAllEvents);
router.get("/events/:eventId", authMiddleware, isAdmin, singleEvents);
router.post("/events/:eventId/register", authMiddleware, registerInEvent);

router.post(
  "/admin/registrations/:registrationId/approve",
  authMiddleware,
  isAdmin,
  approveUserRegistration
);

export default router;
