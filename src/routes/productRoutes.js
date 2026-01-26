import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
