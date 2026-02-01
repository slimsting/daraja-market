import express from "express";
import asyncHandler from "express-async-handler";
import {
  createProduct,
  getAllProducts,
  getAllMyProducts,
  getProductByID,
  updateProductById,
  deleteProductById,
} from "../controllers/productController.js";
import userAuth from "../middleware/userAuth.js";
import { productValidationRules } from "../middleware/validators/productValidator.js";
import authorize from "../middleware/authorize.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  userAuth,
  authorize("farmer"),
  productValidationRules("create"),
  asyncHandler(createProduct),
);
productRouter.get("/all", userAuth, asyncHandler(getAllProducts));
productRouter.get("/my-products", userAuth, asyncHandler(getAllMyProducts));
productRouter.get("/:productId", userAuth, asyncHandler(getProductByID));
productRouter.put(
  "/:productId",
  userAuth,
  productValidationRules("update"),
  asyncHandler(updateProductById),
);
productRouter.delete("/:productId", userAuth, asyncHandler(deleteProductById));

export default productRouter;
