import User from "../models/userModel.js";

import logger from "../utils/logger.js";

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    try {
      const user = await User.findById(req.user.id).select("role");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Your role (${user.role}) is not authorized for this action`,
        });
      }

      next();
    } catch (error) {
      logger.error("Authorization middleware error", {
        error: error.message,
        stack: error.stack,
      });
      return res.status(500).json({
        success: false,
        message: "Internal server error during authorization",
      });
    }
  };
};

export default authorize;
