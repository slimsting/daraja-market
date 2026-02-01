import winston from "winston";

// Create Winston logger
const logger = winston.createLogger({
  level: "info", // default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), //
    winston.format.json(), // structured JSON logs
  ),
  transports: [
    new winston.transports.File({ filename: "combined.log" }), // log all levels
    new winston.transports.File({ filename: "errors.log", level: "error" }), // log only errors
  ],
});

// Add console transport only in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // colorful output
        winston.format.simple(), // human-readable
      ),
    }),
  );
}

export default logger;
