import { EVENT_STATUS } from "../enums/eventStatus.js";
import EventModel from "../models/EventModel.js";
import UserEventModel from "../models/UserEventModel.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

export const adminEventRegistration = catchAsync(async (req, res, next) => {
  let { title, description, capacity, date } = req.body;

  await EventModel.create({ title, description, capacity, date });

  return sendResponse(res, "Event Created Successfully", 201);
});
export const adminEditEventRegistration = catchAsync(async (req, res, next) => {
  let { title, description, capacity, date, userId } = req.body;

  let eventId = req.params?.eventId;

  let event = await EventModel.findById(eventId);
  if (!event) {
    return next(new AppError("Event not found", 404));
  }
  if (title) {
    event.title = title;
  }
  if (description) {
    event.description = description;
  }
  if (capacity > 0) {
    event.capacity = capacity;
  }
  if (date) {
    event.date = date;
  }
  if (userId) {
    if (event.userIds.includes(userId)) {
      return next(new AppError("User already exists in this event", 401));
    } else {
      event.userIds.push(userId);
    }
  }

  await event.save();

  return sendResponse(res, "Event Edited Successfully", 201);
});

export const registerInEvent = catchAsync(async (req, res, next) => {
  let userId = req.user?._id;
  let eventId = req.params?.eventId
  let event = await EventModel.findById(eventId);
  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  if (event.userIds?.includes(userId)) {
    return next(new AppError("You have already booked for this event", 401));
  } else if (event.capacity === event.approveUserIds?.length) {
    return next(new AppError("This Event is filled now", 403));
  } else {
    event.userIds?.push(userId);
    await event.save();
    await UserEventModel.create({
      eventId,
      userId,
    });
  }

  return sendResponse(res, "Registered Successfully", 200);
});

export const approveUserRegistration = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Status is required", 400));
  }

  const registrationId = req.params?.registrationId;
  const registeredUser = await UserEventModel.findById(registrationId);
  if (!registeredUser) {
    return next(new AppError("Registration not found", 404));
  }

  const myEvent = await EventModel.findById(registeredUser.eventId);
  if (!myEvent) {
    return next(new AppError("Event not found", 404));
  }

  // Update status only if it has changed
  if (registeredUser.status !== status) {
    registeredUser.status = status;
    await registeredUser.save();

    const userId = registeredUser.userId;

    if (status === EVENT_STATUS.APPROVE) {
      // Add to approveUserIds only if not already added
      if (!myEvent.approveUserIds.includes(userId)) {
        myEvent.approveUserIds.push(userId);
      }
    } else {
      // Remove from approveUserIds if exists
      myEvent.approveUserIds = myEvent.approveUserIds.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await myEvent.save();
  }

  return sendResponse(res, "User registration status updated", 200);
});

export const getAllEvents = catchAsync(async (req, res, next) => {
  let rawEvents = await EventModel.find({}).lean();
  const userId = req.user?._id;

  const events = rawEvents.map(({ approveUserIds, userIds, ...ev }) => ({
    ...ev,
    registeredInEvent: approveUserIds.some((id) => id.toString() === userId),
    bookedInEvent: userIds.some((id) => id.toString() === userId),
    availableCount: approveUserIds?.length,
    eventFull: (approveUserIds?.length || 0) === ev.capacity,
  }));

  return sendResponse(res, "", 200, { events });
});

export const singleEvents = catchAsync(async (req, res, next) => {
  let eventId = req.params?.eventId;
  let event = await EventModel.findById(eventId).select(
    "title description capacity date"
  );
  if (!event) {
    return next(new AppError("Event not found", 404));
  }
  const registrations = await UserEventModel.find({ eventId })
    .populate({ path: "userId", select: "userNameOrEmail" })
    .select("userId status")
    .lean();

  return sendResponse(res, "Success", 200, {
    event,
    registrations,
  });
});
