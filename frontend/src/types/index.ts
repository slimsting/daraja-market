// src/types/index.ts
import { z } from "zod";
import * as schemas from "./schemas";

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof schemas.userSchema>;
export type UserRole = z.infer<typeof schemas.userRoleSchema>;
export type Product = z.infer<typeof schemas.productSchema>;
export type CartItem = z.infer<typeof schemas.cartItemSchema>;
export type Cart = z.infer<typeof schemas.cartSchema>;
export type Stats = z.infer<typeof schemas.statsSchema>;

// Auth types
export type LoginCredentials = z.infer<typeof schemas.loginSchema>;
export type RegisterData = z.infer<typeof schemas.registerSchema>;
export type AuthResponse = z.infer<typeof schemas.authResponseSchema>;

// API types
export type ApiError = z.infer<typeof schemas.apiErrorSchema>;
export type ProductsResponse = z.infer<typeof schemas.productsResponseSchema>;
export type ProductResponse = z.infer<typeof schemas.productResponseSchema>;

// category sample returned from backend
export type CategorySample = {
  category: string;
  samples: string[];
};

// Export all schemas
export * from "./schemas";
