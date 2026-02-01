import express from "express";
import asyncHandler from "express-async-handler";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import {
  loginValidationRules,
  registerValidationRules,
} from "../middleware/validators/authValidator.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidationRules, asyncHandler(register));
authRouter.post("/login", loginValidationRules, asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", userAuth, asyncHandler(getCurrentUser));

export default authRouter;
