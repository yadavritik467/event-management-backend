import fs from "fs";
import winston from "winston";
// Check environment
const isDev = process.env.NODE_ENV === "development";

const transports = [];

// ✅ Log to file only in development
if (isDev) {

  const logDir = "logs";
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  transports.push(new winston.transports.File({ filename: "logs/app.log" }));
}

// ✅ Always log to console
transports.push(new winston.transports.Console());

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports,
});

export default logger;
