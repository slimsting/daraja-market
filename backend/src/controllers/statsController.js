import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/responseHandler.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = {
    farmers: await User.countDocuments({ role: "farmer" }),
    brokers: await User.countDocuments({ role: "broker" }),
    products: await Product.countDocuments(),
    orders: {
      pending: await Order.countDocuments({ status: "pending" }),
      paid: await Order.countDocuments({ status: "paid" }),
      shipped: await Order.countDocuments({ status: "shipped" }),
      cancelled: await Order.countDocuments({ status: "cancelled" }),
      completed: await Order.countDocuments({ status: "completed" }),
    },
  };

  return successResponse(res, stats, "Retrieved stats successfully", 200);
});
