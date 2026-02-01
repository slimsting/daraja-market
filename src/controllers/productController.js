import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { sanitizeDocument } from "../utils/sanitizer.js";
import { successResponse } from "../utils/responseHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const productData = req.body;
  const newProductData = { ...productData, farmer: currentUserId };

  const newProduct = new Product(newProductData);
  await newProduct.save();

  return successResponse(
    res,
    sanitizeDocument(newProduct, ["__v", "createdAt", "updatedAt", "_id"]),
    "Product created successfully",
    201,
  );
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const { role: currentUserRole } =
    await User.findById(currentUserId).select("role");
  if (!currentUserRole) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  //
  if (!["admin", "broker"].includes(currentUserRole)) {
    const error = new Error("Access denied. Insufficient permissions");
    error.status = 403;
    throw error;
  }

  const products = await Product.find()
    .select("-__v -createdAt -updatedAt")
    .populate("farmer", "name email phone")
    .lean();

  return successResponse(
    res,
    products.map((p) => sanitizeDocument(p, ["__v", "createdAt", "updatedAt"])),
    "Successfully retrieved products",
  );
});

export const getAllMyProducts = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const { role: currentUserRole } =
    await User.findById(currentUserId).select("role");
  if (!currentUserRole) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (currentUserRole !== "farmer") {
    const error = new Error("Access denied. Insufficient permissions");
    error.status = 403;
    throw error;
  }

  const products = await Product.find({ farmer: currentUserId })
    .select("-__v -createdAt -updatedAt")
    .populate("farmer", "name email phone")
    .lean();

  return successResponse(
    res,
    products.map((p) => sanitizeDocument(p, ["__v", "createdAt", "updatedAt"])),
    "Successfully retrieved farmer products",
  );
});

export const getProductByID = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;
  const { productId: productId } = req.params;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }
  // check if theproduct Id is a valid mongodb id
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.status = 400;
    throw error;
  }

  const currentUser = await User.findById(currentUserId).select("role");
  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const product = await Product.findById(productId)
    .select("-__v")
    .populate("farmer", "name email phone")
    .lean(); // return plain JS objects for performance

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  // Authorization check. if the current user role is farmer and the product does not belong to them deny access
  if (
    ["farmer", "broker"].includes(currentUser.role) &&
    product.farmer._id.toString() !== currentUserId
  ) {
    const error = new Error("Access denied. You do not own this product");
    error.status = 403;
    throw error;
  }

  return successResponse(
    res,
    sanitizeDocument(product, ["__v"]),
    "Successfully retrieved product",
  );
});

export const updateProductById = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;
  const { productId: productId } = req.params;
  const updates = req.body;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.status = 400;
    throw error;
  }

  const currentUser = await User.findById(currentUserId).select("role");
  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  // Authorization check
  if (
    ["farmer", "broker"].includes(currentUser.role) &&
    product.farmer.toString() !== currentUserId
  ) {
    const error = new Error("Access denied. You do not own this product");
    error.status = 403;
    throw error;
  }

  // Update product
  Object.assign(product, updates);
  await product.save();

  return successResponse(
    res,
    sanitizeDocument(product, ["__v", "createdAt", "updatedAt"]),
    "Product updated successfully",
  );
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;
  const { productId: productId } = req.params;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.status = 400;
    throw error;
  }

  const currentUser = await User.findById(currentUserId).select("role");
  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  // Authorization checks
  if (currentUser.role === "broker") {
    const error = new Error("Brokers are not allowed to delete products");
    error.status = 403;
    throw error;
  }

  if (
    currentUser.role === "farmer" &&
    product.farmer.toString() !== currentUserId
  ) {
    const error = new Error(
      "Access denied. You can only delete your own products",
    );
    error.status = 403;
    throw error;
  }

  // Admin or authorized farmer → delete
  await product.deleteOne();

  return successResponse(
    res,
    { _id: productId },
    "Product deleted successfully",
  );
});
