import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", getCurrentUser);

export default authRouter;
