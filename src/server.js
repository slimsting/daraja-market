import express from "express";
import connectDB from "./config/db.js";

import "dotenv/config";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import productRouter from "./routes/productRoutes.js";
import statsRouter from "./routes/statsRoutes.js";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import loggerWinston from "./utils/logger.js";
import CONFIG from "./config/constants.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting: prevent brute-force attacks
const limiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.MAX_REQUESTS,
  message: { success: false, message: CONFIG.RATE_LIMIT.MESSAGE },
});
app.use(limiter);
app.use(
  cors({
    origin: CONFIG.CORS.ORIGIN,
    methods: CONFIG.CORS.METHODS,
    credentials: CONFIG.CORS.CREDENTIALS,
  }),
);

const stream = {
  write: (message) => {
    loggerWinston.info(message.trim()); // send Morgan logs to Winston
  },
};

// Use Morgan with Winston
app.use(morgan("combined", { stream }));
app.use(helmet()); //security
app.use(express.json({ limit: CONFIG.REQUEST.JSON_LIMIT }));
app.use(
  express.urlencoded({
    extended: true,
    limit: CONFIG.REQUEST.URL_ENCODED_LIMIT,
  }),
);
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/stats", statsRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server is running http://localhost:${PORT} \n`),
    );
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
};

startServer();
