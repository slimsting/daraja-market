import User from "../models/userModel.js";

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { role: currentUserRole } = await User.findById(req.user.id).select(
      "role",
    );

    if (!allowedRoles.includes(currentUserRole)) {
      return res.status(403).json({
        success: false,
        message: `Role ${currentUserRole} not authorized for this action`,
      });
    }

    next();
  };
};

export default authorize;
