import express from "express";
import authorize from "../middleware/authorize.js";
import { getStats } from "../controllers/statsController.js";
import userAuth from "../middleware/userAuth.js";

const statsRouter = express.Router();

statsRouter.get("/", userAuth, authorize("admin"), getStats);

export default statsRouter;
