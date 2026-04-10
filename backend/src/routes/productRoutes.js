import express from "express";
import asyncHandler from "express-async-handler";
import {
  createProduct,
  getAllProducts,
  getAllMyProducts,
  getProductByID,
  updateProductById,
  deleteProductById,
  getCategoriesWithSamples,
} from "../controllers/productController.js";
import userAuth from "../middleware/userAuth.js";
import { productValidationRules } from "../middleware/validators/productValidator.js";
import authorize from "../middleware/authorize.js";
import { validateUserAndObjectId } from "../middleware/utils/utils.js";
import {
  uploadProductImages,
  attachUploadedImagesToBody,
} from "../middleware/upload.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  userAuth,
  authorize("farmer"),
  uploadProductImages,
  attachUploadedImagesToBody,
  productValidationRules("create"),
  asyncHandler(createProduct),
);

// expose a simple category list with samples
productRouter.get("/categories", asyncHandler(getCategoriesWithSamples));

productRouter.get("/", asyncHandler(getAllProducts));
productRouter.get("/my-products", userAuth, asyncHandler(getAllMyProducts));
productRouter.get("/:productId", asyncHandler(getProductByID));
productRouter.put(
  "/:productId",
  userAuth,
  validateUserAndObjectId("productId"),
  uploadProductImages,
  attachUploadedImagesToBody,
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
