import { body } from "express-validator";
import { handleValidationErrors } from "../utils/utils.js";

export const productValidationRules = (mode = "create") => {
  const isCreate = mode === "create";

  return [
    isCreate
      ? body("name")
          .notEmpty()
          .withMessage("Product name is required")
          .isString()
          .withMessage("Product name must be a string")
      : body("name")
          .optional()
          .isString()
          .withMessage("Product name must be a string"),

    isCreate
      ? body("category")
          .notEmpty()
          .isIn(["vegetables", "fruits", "grains", "dairy", "poultry"])
          .withMessage("Invalid category")
      : body("category")
          .optional()
          .isIn(["vegetables", "fruits", "grains", "dairy", "poultry"])
          .withMessage(
            "Invalid category, category can only be one among vegetables, fruits, grains, dairy, and poultry",
          ),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    isCreate
      ? body("price")
          .notEmpty()
          .isFloat({ gt: 0 })
          .withMessage("Price must be positive")
      : body("price")
          .optional()
          .isFloat({ gt: 0 })
          .withMessage("Price must be positive"),

    isCreate
      ? body("unit")
          .notEmpty()
          .isIn(["kg", "piece", "bag", "crate"])
          .withMessage("Invalid unit")
      : body("unit")
          .optional()
          .isIn(["kg", "piece", "bag", "crate"])
          .withMessage("Invalid unit"),

    isCreate
      ? body("quantity")
          .notEmpty()
          .isInt({ gt: 0 })
          .withMessage("Quantity must be positive")
      : body("quantity")
          .optional()
          .isInt({ gt: 0 })
          .withMessage("Quantity must be positive"),

    body("images")
      .optional()
      .isArray()
      .withMessage("Images must be an array of strings"),
    body("images.*")
      .optional()
      .isString()
      .withMessage("Each image must be a string"),
    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean"),
    body("harvestDate")
      .optional()
      .isISO8601()
      .withMessage("Harvest date must be a valid date"),
    body("organic")
      .optional()
      .isBoolean()
      .withMessage("Organic must be a boolean"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),
    body("tags.*")
      .optional()
      .isString()
      .withMessage("Each tag must be a string"),
    handleValidationErrors,
  ];
};
