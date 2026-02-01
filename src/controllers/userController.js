import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { sanitizeDocument } from "../utils/sanitizer.js";
import { successResponse } from "../utils/responseHandler.js";

export const getAllFarmers = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const currentUser = await User.findById(currentUserId).select("role");
  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (currentUser.role !== "admin") {
    const error = new Error("Access denied. Only admins can view farmers");
    error.status = 403;
    throw error;
  }

  const farmers = await User.find({ role: "farmer" })
    .select("name email role phone location")
    .lean();

  return successResponse(
    res,
    farmers.map((f) => sanitizeDocument(f, ["__v", "createdAt", "updatedAt"])),
    "Successfully retrieved all farmers",
  );
});

export const getAllBrokers = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const currentUser = await User.findById(currentUserId).select("role");
  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (currentUser.role !== "admin") {
    const error = new Error("Access denied. Only admins can view brokers");
    error.status = 403;
    throw error;
  }

  const brokers = await User.find({ role: "broker" })
    .select("name email phone")
    .lean();

  return successResponse(
    res,
    brokers.map((b) => sanitizeDocument(b, ["__v", "createdAt", "updatedAt"])),
    "Successfully retrieved all brokers",
  );
});
