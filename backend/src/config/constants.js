const isProd = process.env.NODE_ENV === "production";

export const CONFIG = {
  // JWT Configuration
  JWT: {
    EXPIRY: "7d",
    EXPIRY_DAYS: 7,
    EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
    SECRET: process.env.JWT_SECRET,
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    MESSAGE: "Too many requests, try again later.",
  },

  // Cookie Configuration
  COOKIE: {
    HTTP_ONLY: true,
    SECURE: isProd,
    SAME_SITE: isProd ? "none" : "strict",
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Password Hashing
  BCRYPT: {
    ROUNDS: 10,
  },

  // Database
  DB: {
    TIMEOUT_MS: 5000,
    SOCKET_TIMEOUT_MS: 45000,
  },

  // Request Size Limits
  REQUEST: {
    JSON_LIMIT: "10mb",
    URL_ENCODED_LIMIT: "10mb",
  },

  // User Roles
  ROLES: {
    FARMER: "farmer",
    BROKER: "broker",
    ADMIN: "admin",
  },

  // Product Categories
  PRODUCT_CATEGORIES: ["vegetables", "fruits", "grains", "dairy", "poultry"],

  // Product Units
  PRODUCT_UNITS: ["kg", "piece", "bag", "crate"],

  // CORS Configuration
  CORS: {
    ORIGIN: process.env.FRONTEND_URL || "http://localhost:3000",
    METHODS: ["GET", "POST", "PUT", "DELETE"],
    CREDENTIALS: true,
  },
};

export default CONFIG;
