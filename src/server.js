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

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting: prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { success: false, message: "Too many requests, try again later." },
});
app.use(limiter);
app.use(
  cors({
    origin: ["http://localhost:3000"], // whitelist frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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
