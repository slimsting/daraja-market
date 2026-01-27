import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    //extract token from cookies
    const { token } = req.cookies;
    // if token does not exist return error
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // verify and decode jwt token
    let decodedToken;
    try {
      decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again",
        });
      }

      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again",
        });
      }

      // Generic JWT error
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Please login again",
      });
    }

    // Verify user still exists in database (security best practice)
    const userExists = await User.findById(decodedToken.id).select("_id");

    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again",
      });
    }

    // Attach user ID to request object for use in controllers
    // req.body.userId = decodedToken.id;
    req.user = { id: decodedToken.id }; // Standard practice: also attach to req.user

    // Proceed to next middleware
    next();
  } catch (error) {
    console.error("authentication middleware error: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal error during authenticaton" });
  }
};

export default userAuth;
