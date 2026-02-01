import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { setCookie, clearCookie } from "../utils/cookieUtils.js";
import CONFIG from "../config/constants.js";
import logger from "../utils/logger.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";

/**
 * Register a new user
 * @description creates new user account and sets authentication cookie
 * @access Public
 * @route POST /api/auth/register
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message or error
 */
export const register = asyncHandler(async (req, res) => {
  const registeringUserData = req.body;
  //does user the email exist in db
  const userExists = await User.findOne({ email: registeringUserData.email });
  //exit with an error if they do
  if (userExists) {
    const error = new Error("User already exists with that email");
    error.status = 409;
    throw error;
  }

  //if user role is admin check if they have provided the correct admin reg code else return error
  if (registeringUserData.role === "admin") {
    const adminRegCodeIsValid =
      registeringUserData.adminRegCode === process.env.ADMIN_REG_CODE;
    if (!adminRegCodeIsValid) {
      const error = new Error("Invalid admin registration code");
      error.status = 401;
      throw error;
    }
  }

  //else create the user and store it in db
  // first hash the password hash password
  const hashedPassword = await bcrypt.hash(
    registeringUserData.password,
    CONFIG.BCRYPT.ROUNDS,
  );
  // create new user object with updated hashed password
  const newUser = new User({
    ...registeringUserData,
    password: hashedPassword,
  });
  //save new user
  await newUser.save();
  // generate jwt token
  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: CONFIG.JWT.EXPIRY,
    },
  );
  //set authentication cookie
  setCookie(res, token);

  return successResponse(res, null, "user registered successfully", 201);
});

/**
 * Login user
 * @description Authenticates user and sets authentication cookie
 * @access Public
 * @route POST /api/auth/login
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message or error
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user is in db
  const userExists = await User.findOne({ email });
  //return error if not
  if (!userExists) {
    const error = new Error("wrong username or password");
    error.status = 401;
    throw error;
  }
  //else compare password with hashed password in db
  const passwordsIsMatch = await bcrypt.compare(password, userExists.password);
  //if no match return error
  if (!passwordsIsMatch) {
    const error = new Error("wrong username or password");
    error.status = 401;
    throw error;
  }
  //else create token and set authentication cookie
  const token = jwt.sign(
    { id: userExists._id, role: userExists.role },
    process.env.JWT_SECRET,
    {
      expiresIn: CONFIG.JWT.EXPIRY,
    },
  );

  setCookie(res, token);
  //return success
  const { name, userEmail, role, phone, location } = userExists;
  return successResponse(
    res,
    { name, userEmail, role, phone, location },
    "Logged in successfully",
    200,
  );
});

/**
 * Logout user
 * @description Clears authentication cookie
 * @access Public
 * @route POST /api/auth/logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
export const logout = asyncHandler(async (req, res) => {
  clearCookie(res);

  return successResponse(res, null, "Logged out successfully", 200);
});

/**
 * Get current user
 * @description
 * @access Private
 * @route Get /api/auth/me
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message with current user ifo or an error
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  const currentUser = await User.findById(currentUserId).select(
    " -_id -createdAt -updatedAt -__v -password",
  );

  if (!currentUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return successResponse(
    res,
    currentUser,
    "Current user retrieved successfully",
    200,
  );
});
