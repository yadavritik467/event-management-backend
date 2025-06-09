import winston from "winston";
import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

if (process.env.NODE_ENV === "development") {
  logger.add(new winston.transports.Console());
}

export default logger;
