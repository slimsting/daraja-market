import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "daraja-market/products",
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    format: async (req, file) => {
      const parts = file.mimetype?.split("/");
      return parts?.[1] || "jpg";
    },
    public_id: (req, file) => {
      const name = file.originalname ? file.originalname.replace(/\.[^/.]+$/, "") : "product";
      // Add a timestamp to avoid collisions
      return `${Date.now()}-${name}`;
    },
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image uploads are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
    files: 5,
  },
});

export const uploadProductImages = upload.array("images", 5);

export const attachUploadedImagesToBody = (req, res, next) => {
  if (Array.isArray(req.files) && req.files.length > 0) {
    const urls = req.files.map((file) => file.path || file.secure_url || file.url);

    // Preserve any existing images array in the body
    const existing = Array.isArray(req.body?.images) ? req.body.images : [];

    req.body = {
      ...req.body,
      images: [...existing, ...urls],
    };
  }
  next();
};
