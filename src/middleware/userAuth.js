import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const userAuth = asyncHandler(async (req, res, next) => {
  //extract token from cookies
  const { token } = req.cookies;
  // if token does not exist return error
  if (!token) {
    const error = new Error("Authentication required. Please login");
    error.status = 401;
    throw error;
  }

  // verify and decode jwt token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // Verify user still exists in database (security best practice)
  const userExists = await User.findById(decodedToken.id).select("_id");

  if (!userExists) {
    const error = new Error("User not found. Please login again");
    error.status = 401;
    throw error;
  }

  // Attach user ID to request object for use in controllers
  // req.body.userId = decodedToken.id;
  req.user = { id: decodedToken.id, role: decodedToken.role }; // Standard practice: also attach to req.user

  // Proceed to next middleware
  next();
});

export default userAuth;
