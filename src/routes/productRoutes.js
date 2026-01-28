import express from "express";
import {
  createProduct,
  getAllProducts,
  getAllMyProducts,
  getProductByID,
  updateProductById,
  deleteProductById,
} from "../controllers/productController.js";
import userAuth from "../middleware/userAuth.js";
import { productValidationRules } from "../middleware/productValidation.js";
import authorize from "../middleware/authorize.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  userAuth,
  authorize("farmer"), // can authorize admin and broker or multiple roles if need be
  productValidationRules("create"),
  createProduct,
);
productRouter.get("/all", userAuth, getAllProducts);
productRouter.get("/my-products", userAuth, getAllMyProducts);
productRouter.get("/:itemId", userAuth, getProductByID);
productRouter.put(
  "/:itemId",
  userAuth,
  productValidationRules("update"),
  updateProductById,
);
productRouter.delete("/:itemId", userAuth, deleteProductById);

export default productRouter;
