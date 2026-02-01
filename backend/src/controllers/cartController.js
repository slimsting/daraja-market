import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { sanitizeDocument } from "../utils/sanitizer.js";
import { successResponse } from "../utils/responseHandler.js";
import logger from "../utils/logger.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId).select("price");
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();

  return successResponse(
    res,
    sanitizeDocument(cart, ["__v", "createdAt", "updatedAt"]),
    "Item added to cart successfully",
    200,
  );
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price unit category",
  );

  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  const safeCart = sanitizeDocument(cart, ["__v", "createdAt", "updatedAt"]);

  return successResponse(res, safeCart, "Cart retrieved successfully", 200);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price unit category",
  );

  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  // Locate the item in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId,
  );

  if (itemIndex === -1) {
    const error = new Error("Product not found in cart");
    error.status = 404;
    throw error;
  }

  // Update or remove item
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();

  // Sanitize response
  const safeCart = sanitizeDocument(cart, ["__v", "createdAt", "updatedAt"]);

  return successResponse(res, safeCart, "Cart item updated successfully", 200);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    const error = new Error("Item not found in cart");
    error.status = 404;
    throw error;
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  const safeCart = sanitizeDocument(cart, ["__v", "createdAt", "updatedAt"]);

  return successResponse(
    res,
    safeCart,
    "Item removed from cart successfully",
    200,
  );
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  cart.items = []; // empty the cart
  await cart.save();

  const safeCart = sanitizeDocument(cart, ["__v", "createdAt", "updatedAt"]);

  return successResponse(res, safeCart, "Cart cleared successfully", 200);
});

export const checkoutCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find the user's cart and populate product details
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price unit category",
  );

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty or not found");
    error.status = 400;
    throw error;
  }

  // Calculate total price dynamically
  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  // Create a new order from the cart
  const order = new Order({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    totalPrice,
    status: "pending", // can later be updated to 'paid', 'shipped', etc.
  });

  await order.save();

  // Clear the cart after checkout
  cart.items = [];
  await cart.save();

  return successResponse(
    res,
    {
      orderId: order._id,
      totalPrice,
      items: order.items,
      status: order.status,
    },
    "Checkout successful, order created",
    200,
  );
});
