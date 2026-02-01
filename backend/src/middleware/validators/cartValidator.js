import { body } from "express-validator";
import { handleValidationErrors } from "../utils/utils.js";

export const cartValidationRules = [
  // productId must be a valid MongoDB ObjectId
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  // quantity must be a positive integer
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  handleValidationErrors,
];
