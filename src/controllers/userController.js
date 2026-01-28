import User from "../models/userModel.js";
import mongoose from "mongoose";

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
      .select("name email role phone location") // include only safe fields
      .lean();

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved all farmers",
      data: farmers,
    });
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
      .select("name email role") // include only safe fields
      .lean();

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved all brokers",
      data: brokers,
    });
  } catch (error) {
    console.error("❌ Error retrieving brokers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving brokers",
    });
  }
};
