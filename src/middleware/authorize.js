const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error(`Access denied. Your role (${req.user.role}) is not authorized for this action`);
      error.status = 403;
      throw error;
    }

    next();
  };
};

export default authorize;
