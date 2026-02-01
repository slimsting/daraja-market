import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connected successfully");
    });
    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error", {
        error: error.message,
        stack: error.stack,
      });
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info("Database connection established", {
      database: process.env.DB_NAME,
      host: mongoose.connection.host,
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

export default connectDB;
