import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server is running http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
};

startServer();
