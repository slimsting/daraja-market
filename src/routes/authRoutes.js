import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import {
  validateLogin,
  validateRegister,
} from "../middleware/authValidation.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout", logout);
authRouter.get("/me", userAuth, getCurrentUser);

export default authRouter;
