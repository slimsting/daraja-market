import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["vegetables", "fruits", "grains", "dairy", "poultry"],
    },
    description: { type: String },
    price: { type: Number, required: true },
    unit: { type: String, enum: ["kg", "piece", "bag", "crate"] },
    quantity: { type: Number, required: true },
    images: [String],
    available: { type: Boolean, default: true },
    harvestDate: Date,
    organic: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
