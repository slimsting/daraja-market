import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { trusted } from "mongoose";

export const register = async (req, res) => {
  try {
    const data = req.body;
    //does user the email exist in db
    const userExists = await User.findOne({ email: data.email });
    //exit with an error if they do
    if (userExists) {
      return res.status(404).json({
        success: false,
        message: "User already exists with that email",
      });
    }
    //else create the user and store it in db
    // first hash the password hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // create new user object with updated hashed password
    const newUser = new User({ ...data, password: hashedPassword });
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

export const getCurrentUser = (req, res) => {};
