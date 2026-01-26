import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (error) => {
      console.error(error);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(` Database name: ${process.env.DB_NAME}`);
    console.log(` Host Name: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
