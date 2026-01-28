import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first",
      });
    }

    const productData = req.body;
    const newProductData = { ...productData, farmer: currentUserId };

    const newProduct = new Product(newProductData);
    await newProduct.save();

    const safeProduct = newProduct.toObject();
    delete safeProduct.__v;
    delete safeProduct.createdAt;
    delete safeProduct.updatedAt;
    delete safeProduct._id;

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: safeProduct,
    });
  } catch (error) {
    console.error("❌Error creating new prodcut: ", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate product entry",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error while creating product. Try again later",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first",
      });
    }

    const { role: currentUserRole } =
      await User.findById(currentUserId).select("role");
    if (!currentUserRole) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!["admin", "broker"].includes(currentUserRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
    }

    const products = await Product.find()
      .select("-__v -createdAt -updatedAt") // exclude internal version key
      .populate("farmer", "name email phone")
      .lean(); // return plain JS objects for performance

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved products",
      data: products,
    });
  } catch (error) {
    console.error("❌ Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving products. Try again later",
    });
  }
};

export const getAllMyProducts = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first",
      });
    }

    const { role: currentUserRole } =
      await User.findById(currentUserId).select("role");
    if (!currentUserRole) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUserRole !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
    }

    const products = await Product.find()
      .select("-__v -createdAt -updatedAt") // exclude internal version key
      .populate("farmer", "name email phone")
      .lean(); // return plain JS objects for performance

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved products",
      data: products,
    });
  } catch (error) {
    console.error("❌ Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving products. Try again later",
    });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const { productId } = req.params;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login first" });
    }
    // check if theproduct Id is a valid mongodb id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const currentUser = await User.findById(currentUserId).select("role");
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId)
      .select("-__v")
      .populate("farmer", "name email phone")
      .lean(); // return plain JS objects for performance

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Authorization check. if the current user role is farmer and the product does not belong to them deny access
    if (
      ["farmer", "broker"].includes(currentUser.role) &&
      product.farmer._id.toString() !== currentUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not own this product",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved product",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error retrieving product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving product",
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const { productId } = req.params;
    const updates = req.body;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const currentUser = await User.findById(currentUserId).select("role");
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Authorization check
    if (
      ["farmer", "broker"].includes(currentUser.role) &&
      product.farmer.toString() !== currentUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not own this product",
      });
    }

    // Update product
    Object.assign(product, updates);
    const updatedProduct = await product.save();
    const safeProduct = updatedProduct.toObject();

    delete safeProduct.__v;
    delete safeProduct.createdAt;
    delete safeProduct.updatedAt;

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: safeProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while updating product" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const { productId } = req.params;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const currentUser = await User.findById(currentUserId).select("role");
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Authorization checks
    if (currentUser.role === "broker") {
      return res.status(403).json({
        success: false,
        message: "Brokers are not allowed to delete products",
      });
    }

    if (
      currentUser.role === "farmer" &&
      product.farmer.toString() !== currentUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own products",
      });
    }

    // Admin or authorized farmer → delete
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { _id: productId }, // return minimal info
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while deleting product" });
  }
};
