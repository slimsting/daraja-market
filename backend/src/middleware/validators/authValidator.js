import { body, validationResult } from "express-validator";
import { handleValidationErrors } from "../utils/utils.js";

// Register validation
export const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  body("role").notEmpty().withMessage("Role is required"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 to 15 digits"),
  body("adminRegCode")
    .optional()
    .isString()
    .withMessage("admin registration code must be a string"),
  handleValidationErrors,
];

// Login validation
export const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];
