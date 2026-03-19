// src/lib/loggers.ts
import logger from "./logger";
import { ZodError } from "zod";

// Scoped loggers for each module
export const apiLogger = logger.child({ module: "api-client" });
export const authLogger = logger.child({ module: "auth-service" });
export const productsLogger = logger.child({ module: "products-service" });
export const cartLogger = logger.child({ module: "cart-service" });

// Zod error helper function
export function logZodError(
  scopedLogger: typeof logger,
  context: string,
  error: ZodError,
  data?: unknown,
) {
  scopedLogger.error(
    {
      context,
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
      sample: data,
    },
    "Zod validation failed",
  );
}
