import express from "express";
import asyncHandler from "express-async-handler";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart,
} from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";
import authorize from "../middleware/authorize.js";
import { cartValidationRules } from "../middleware/validators/cartValidator.js";

const cartRouter = express.Router();

cartRouter.post(
  "/",
  userAuth,
  authorize("broker"),
  cartValidationRules,
  asyncHandler(addToCart),
);
cartRouter.get("/", userAuth, asyncHandler(getCart));
cartRouter.put(
  "/",
  userAuth,
  cartValidationRules,
  asyncHandler(updateCartItem),
);
cartRouter.delete(
  "/",
  userAuth,
  cartValidationRules,
  asyncHandler(removeCartItem),
);
cartRouter.delete("/clear-cart", userAuth, asyncHandler(clearCart));
cartRouter.post("/checkout", userAuth, asyncHandler(checkoutCart));

export default cartRouter;
