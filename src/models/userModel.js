import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["farmer", "broker", "admin"],
      default: "farmer",
    },
    phone: { type: String, required: true },
    location: {
      county: String,
      subCounty: String,
      ward: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
