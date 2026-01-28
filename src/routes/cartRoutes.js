import express from "express";
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

const cartRouter = express.Router();

cartRouter.post("/", userAuth, authorize("broker"), addToCart);
cartRouter.get("/", userAuth, getCart);
cartRouter.put("/", userAuth, updateCartItem);
cartRouter.delete("/", userAuth, removeCartItem);
cartRouter.delete("/clear-cart", userAuth, clearCart);
cartRouter.post("/checkout", userAuth, checkoutCart);

export default cartRouter;
