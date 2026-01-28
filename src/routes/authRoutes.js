import express from "express";
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
} from "../middleware/authValidation.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidationRules, register);
authRouter.post("/login", loginValidationRules, login);
authRouter.post("/logout", logout);
authRouter.get("/me", userAuth, getCurrentUser);

export default authRouter;
