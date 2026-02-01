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
import { validateUserAndObjectId } from "../middleware/utils/utils.js";

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
productRouter.get(
  "/:productId",
  userAuth,
  validateUserAndObjectId("productId"),
  asyncHandler(getProductByID),
);
productRouter.put(
  "/:productId",
  userAuth,
  validateUserAndObjectId("productId"),
  productValidationRules("update"),
  asyncHandler(updateProductById),
);
productRouter.delete(
  "/:productId",
  userAuth,
  validateUserAndObjectId("productId"),
  asyncHandler(deleteProductById),
);

export default productRouter;
