import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Register a new user
 * @description creates new user account and sets authenticaton cookie
 * @access Public
 * @route POST /api/auth/register
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message or error
 */
export const register = async (req, res) => {
  try {
    const registeringUserData = req.body;
    //does user the email exist in db
    const userExists = await User.findOne({ email: registeringUserData.email });
    //exit with an error if they do
    if (userExists) {
      return res.status(404).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    //if user roler is admin check if they have provided the correct admin reg code else return error
    if (registeringUserData.role === "admin") {
      const adminRegCodeIsValid =
        registeringUserData.adminCode === process.env.ADMIN_REG_CODE;
      if (!adminRegCodeIsValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid admin registration code" });
      }
    }

    //else create the user and store it in db
    // first hash the password hash password
    const hashedPassword = await bcrypt.hash(registeringUserData.password, 10);
    // create new user object with updated hashed password
    const newUser = new User({
      ...registeringUserData,
      password: hashedPassword,
    });
    //save new user
    await newUser.save();
    // generate jwt token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    //set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (error) {
    console.error("❌user registration error: ", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user, please try again later",
    });
  }
};

/**
 * Login user
 * @description Authenticates user and sets authentication cookie
 * @access Public
 * @route POST /api/auth/login
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message or error
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if user is in db
    const userExists = await User.findOne({ email });
    //return error if not
    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, message: "wrong username or password" });
    }
    //else compare password with hashed password in db
    const passwordsIsMatch = await bcrypt.compare(
      password,
      userExists.password,
    );
    //if no match return error
    if (!passwordsIsMatch) {
      return res
        .status(401)
        .json({ success: false, message: "wrong username or password" });
    }
    //else create token and set authenticatoin cookie
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    //return success
    const { name, userEmail, role, phone, location } = userExists;
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { name, userEmail, role, phone, location },
    });
  } catch (error) {
    console.error("❌ Error loging in: ", error);
    return res.status(500).json({
      success: false,
      message: "Could not login. Please try again later",
    });
  }
};

/**
 * Logout user
 * @description Clears authentication cookie
 * @access Public
 * @route POST /api/auth/logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout. Please try again later",
    });
  }
};

/**
 * Get current user
 * @description
 * @access Private
 * @route Get /api/auth/me
 * @param {Object} req Express request object
 * @param {Object*} res Express request object
 * @returns {Object} success message with current user ifo or an error
 */
export const getCurrentUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).select(
      " -_id -createdAt -updatedAt -__v -password",
    );

    return res.status(200).json({
      success: true,
      message: "Current user retrieved successfuly",
      data: currentUser,
    });
  } catch (error) {
    console.error("Error getting current user: ", error);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve current user at this time. Try again later",
    });
  }
};
