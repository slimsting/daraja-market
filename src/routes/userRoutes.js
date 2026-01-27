import express from "express";
import { getAllFarmers, getAllBrokers } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get("/farmers", userAuth, getAllFarmers);
userRouter.get("/brokers", userAuth, getAllBrokers);

export default userRouter;
