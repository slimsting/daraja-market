// src/lib/logger.ts
import pino from "pino";

const isServer = typeof window === "undefined";
const isDevelopment = process.env.NODE_ENV === "development";

const logger = pino({
  level: isDevelopment ? "debug" : "info",

  // Only use pino-pretty in development on the server
  ...(isDevelopment && isServer
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:HH:MM:ss",
          },
        },
      }
    : {}),

  // Browser-safe logging
  browser: {
    asObject: true,
    write: {
      info: (obj) => {
        console.log("%c[INFO]", "color: #6366f1; font-weight: bold", obj);
      },
      error: (obj) => {
        console.error("%c[ERROR]", "color: #ef4444; font-weight: bold", obj);
      },
      warn: (obj) => {
        console.warn("%c[WARN]", "color: #f59e0b; font-weight: bold", obj);
      },
      debug: (obj) => {
        console.log("%c[DEBUG]", "color: #94a3b8; font-weight: bold", obj);
      },
      fatal: (obj) => {
        console.error("%c[FATAL]", "color: #7f1d1d; font-weight: bold", obj);
      },
      trace: (obj) => {
        console.log("%c[TRACE]", "color: #cbd5e1; font-weight: bold", obj);
      },
    },
  },
});

export default logger;
