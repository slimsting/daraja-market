import express from "express";
import asyncHandler from "express-async-handler";
import authorize from "../middleware/authorize.js";
import { getStats } from "../controllers/statsController.js";
import userAuth from "../middleware/userAuth.js";

const statsRouter = express.Router();

statsRouter.get("/", userAuth, authorize("admin"), asyncHandler(getStats));

export default statsRouter;
