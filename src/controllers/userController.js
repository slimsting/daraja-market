import User from "../models/userModel.js";
import mongoose from "mongoose";
import { sanitizeDocument } from "../utils/sanitizer.js";
import { successResponse } from "../utils/responseHandler.js";

export const getAllFarmers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login first" });
    }

    const currentUser = await User.findById(currentUserId).select("role");
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view farmers",
      });
    }

    const farmers = await User.find({ role: "farmer" })
      .select("name email role phone location")
      .lean();

    return successResponse(
      res,
      farmers.map((f) =>
        sanitizeDocument(f, ["__v", "createdAt", "updatedAt"]),
      ),
      "Successfully retrieved all farmers",
    );
  } catch (error) {
    console.error("❌ Error retrieving farmers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving farmers",
    });
  }
};

export const getAllBrokers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login first" });
    }

    const currentUser = await User.findById(currentUserId).select("role");
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view brokers",
      });
    }

    const brokers = await User.find({ role: "broker" })
      .select("name email role")
      .lean();

    return successResponse(
      res,
      brokers.map((b) =>
        sanitizeDocument(b, ["__v", "createdAt", "updatedAt"]),
      ),
      "Successfully retrieved all brokers",
    );
  } catch (error) {
    console.error("❌ Error retrieving brokers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving brokers",
    });
  }
};
