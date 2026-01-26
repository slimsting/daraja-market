import express from "express";
import { getAllFarmers, getAllBrokers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/farmers", getAllFarmers);
userRouter.get("/brokers", getAllBrokers);

export default userRouter;
