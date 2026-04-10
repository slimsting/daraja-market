// src/types/schemas.ts
import { z } from "zod";

// ==================== USER SCHEMAS ====================
export const userRoleSchema = z.enum(["farmer", "broker", "admin"]);

export const userSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string(),
    location: z
      .object({
        county: z.string().optional(),
        subCounty: z.string().optional(),
        ward: z.string().optional(),
      })
      .optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    role: userRoleSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough(); // Allow extra fields

// ==================== PRODUCT SCHEMAS ====================
export const productCategorySchema = z.enum([
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "poultry",
  "other",
]);

export const productUnitSchema = z.enum(["kg", "piece", "bag", "crate"]);

export const productSchema = z
  .object({
    _id: z.string().or(z.any()).transform(String).optional(), // ObjectId might come as object, convert to string
    farmer: z
      .union([
        z.string(), // ObjectId as string
        userSchema, // Populated user object
      ])
      .optional(),
    name: z.string(),
    category: productCategorySchema.optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0), // Coerce strings to numbers from FormData
    unit: productUnitSchema.optional(),
    quantity: z.coerce.number().min(0), // Coerce strings to numbers from FormData
    images: z
      .union([z.array(z.string()), z.array(z.instanceof(File))])
      .optional()
      .default([]),
    available: z.boolean().optional().default(true),
    harvestDate: z
      .string()
      .or(z.date())
      .optional()
      .transform((val) => (val ? String(val) : undefined)), // Handle Date objects
    organic: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
  })
  .passthrough(); // Allow extra fields that might come from backend

// ==================== CART SCHEMAS ====================
export const cartItemSchema = z.object({
  _id: z.string(),
  productId: z.string(),
  product: productSchema.optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const cartSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().optional(),
  items: z.array(cartItemSchema),
  total: z.number().nonnegative(),
});

// ==================== STATS SCHEMA ====================
export const statsSchema = z.object({
  totalFarmers: z.number().int().nonnegative(),
  totalBrokers: z.number().int().nonnegative(),
  totalProducts: z.number().int().nonnegative(),
  totalOrders: z.number().int().nonnegative().optional(),
});

// ==================== AUTH SCHEMAS ====================
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  role: userRoleSchema,
});

// ==================== API RESPONSE SCHEMAS ====================
export const apiErrorSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number().optional(),
});

export const authResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: userSchema.optional(),
});

export const productsResponseSchema = z.object({
  success: z.boolean().optional(),
  products: z.array(productSchema),
  total: z.number().optional(),
});

export const productResponseSchema = z.object({
  success: z.boolean().optional(),
  product: productSchema,
});
