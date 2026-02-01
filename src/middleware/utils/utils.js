import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../../models/userModel.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

export const validateUserAndObjectId = (paramName) => {
  return async (req, res, next) => {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      const error = new Error("Unauthorized. Please login first");
      error.status = 401;
      throw error;
    }

    const objectId = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      const error = new Error(`Invalid ${paramName} ID`);
      error.status = 400;
      throw error;
    }

    next();
  };
};

export const pickAllowedFields = (obj, allowedFields) => {
  const result = {};
  allowedFields.forEach((field) => {
    if (obj.hasOwnProperty(field)) {
      result[field] = obj[field];
    }
  });
  return result;
};
