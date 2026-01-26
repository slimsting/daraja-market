import User from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    console.error("user registration error: ", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user, please try again later",
    });
  }
};

export const login = (req, res) => {
  console.log("brrrrrr");
};

export const getCurrentUser = (req, res) => {};
