import Product from "../models/productModel.js";
import { successResponse } from "../utils/responseHandler.js";
import asyncHandler from "express-async-handler";
import { pickAllowedFields } from "../middleware/utils/utils.js";
import { sanitizeDocument } from "../utils/sanitizer.js";

const mergeUploadedImages = (body, files) => {
  const existingImages = Array.isArray(body?.images) ? body.images : [];
  const uploadedImages = Array.isArray(files)
    ? files
        .map((file) => file.path || file.secure_url || file.url)
        .filter(Boolean)
    : [];

  const merged = [...existingImages, ...uploadedImages];
  return merged.length ? merged : undefined;
};

export const createProduct = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    const error = new Error("Unauthorized. Please login first");
    error.status = 401;
    throw error;
  }

  const productData = req.body;
  const images = mergeUploadedImages(productData, req.files);

  const newProductData = {
    ...productData,
    farmer: currentUserId,
    ...(images ? { images } : {}),
  };

  const newProduct = new Product(newProductData);
  await newProduct.save();

  return successResponse(
    res,
    sanitizeDocument(newProduct, ["__v", "createdAt", "updatedAt"]),
    "Product created successfully",
    201,
  );
});

export const getAllProducts = asyncHandler(async (req, res) => {
  // All authenticated users can view products
  const products = await Product.find()
    .select("-__v -createdAt -updatedAt")
    .populate("farmer", "name email phone")
    .lean();

  return successResponse(res, products, "Successfully retrieved products");
});

// Returns category enum values from the schema along with a handful of sample product names for each category
export const getCategoriesWithSamples = asyncHandler(async (req, res) => {
  // grab enum values defined on schema
  const categories = Product.schema.path("category").enumValues;

  // query samples in parallel
  const samplesByCategory = await Promise.all(
    categories.map(async (cat) => {
      const samples = await Product.find({ category: cat })
        .select("name")
        .limit(3)
        .lean();
      return { category: cat, samples: samples.map((p) => p.name) };
    }),
  );

  return successResponse(
    res,
    { categories: samplesByCategory },
    "Successfully retrieved categories",
  );
});

export const getAllMyProducts = asyncHandler(async (req, res) => {
  if (req.user.role !== "farmer") {
    const error = new Error("Access denied. Insufficient permissions");
    error.status = 403;
    throw error;
  }

  const products = await Product.find({ farmer: req.user.id })
    .select("-__v -createdAt -updatedAt")
    .populate("farmer", "name email phone")
    .lean();

  return successResponse(
    res,
    products,
    "Successfully retrieved farmer products",
  );
});

export const getProductByID = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .select("-__v")
    .populate("farmer", "name email phone")
    .lean(); // return plain JS objects for performance

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return successResponse(res, product, "Successfully retrieved product");
});

export const updateProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  // Authorization check: only farmer (if owner) or admin
  if (req.user.role === "farmer" && product.farmer.toString() !== req.user.id) {
    const error = new Error("Access denied. You do not own this product");
    error.status = 403;
    throw error;
  }
  if (req.user.role !== "farmer" && req.user.role !== "admin") {
    const error = new Error("Access denied. Insufficient permissions");
    error.status = 403;
    throw error;
  }

  // Whitelist allowed fields
  const allowedFields = [
    "name",
    "category",
    "description",
    "price",
    "unit",
    "quantity",
    "images",
    "available",
    "harvestDate",
    "organic",
    "tags",
  ];

  const filteredUpdates = pickAllowedFields(updates, allowedFields);

  // Preserve existing images and append any newly uploaded files
  const uploadedImages = Array.isArray(req.files)
    ? req.files
        .map((file) => file.path || file.secure_url || file.url)
        .filter(Boolean)
    : [];
  if (uploadedImages.length) {
    const existingImages = Array.isArray(filteredUpdates.images)
      ? filteredUpdates.images
      : [];
    filteredUpdates.images = [...existingImages, ...uploadedImages];
  }

  // Update product
  Object.assign(product, filteredUpdates);
  await product.save();

  return successResponse(
    res,
    sanitizeDocument(product, ["__v", "createdAt", "updatedAt"]),
    "Product updated successfully",
  );
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  // Authorization checks
  if (req.user.role === "broker") {
    const error = new Error("Brokers are not allowed to delete products");
    error.status = 403;
    throw error;
  }

  if (req.user.role === "farmer" && product.farmer.toString() !== req.user.id) {
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
