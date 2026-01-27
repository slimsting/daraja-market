import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductByID,
  updateProductById,
  deleteProductById,
} from "../controllers/productController.js";
import userAuth from "../middleware/userAuth.js";

const productRouter = express.Router();

productRouter.post("/", userAuth, createProduct);
productRouter.get("/", userAuth, getAllProducts);
productRouter.get("/:productId", userAuth, getProductByID);
productRouter.put("/:productId", userAuth, updateProductById);
productRouter.delete("/:productId", userAuth, deleteProductById);

export default productRouter;
