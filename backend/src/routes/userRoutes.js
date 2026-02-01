import express from "express";
import asyncHandler from "express-async-handler";
import { getAllFarmers, getAllBrokers } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get("/farmers", userAuth, asyncHandler(getAllFarmers));
userRouter.get("/brokers", userAuth, asyncHandler(getAllBrokers));

export default userRouter;
