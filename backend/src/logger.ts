// src/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Define log directory relative to the project root (adjust if needed)
const logDir = path.join(process.cwd(), 'logs');

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log levels for Winston
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3, // Specific level for HTTP request logs
  debug: 4,
};

// Set level based on environment, default to 'info'
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info'; // Be more verbose in dev
};

// Define colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// --- Define Log Formats ---

// Console format: Colorized, timestamp, level, message, stack trace for errors
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}` +
      (info.stack ? `\n${info.stack}` : '')
  ),
  winston.format.errors({ stack: true }) // Ensure stack traces are logged
);

// File format: JSON for easier parsing later, include timestamp and stack trace
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Log stack trace in files
  winston.format.json() // Log as JSON
);

// --- Define Transports ---

const transports = [
  // Always log to the console
  new winston.transports.Console({
    level: level(), // Log level based on environment
    format: consoleFormat,
    handleExceptions: true, // Log uncaught exceptions
    handleRejections: true, // Log unhandled promise rejections
  }),

  // Transport for all logs (info level and above) into a rotating file
  new winston.transports.DailyRotateFile({
    level: 'info', // Log info, warn, error
    dirname: logDir,
    filename: 'app-combined-%DATE%.log', // Filename pattern
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compress old log files
    maxSize: '20m', // Max size before rotation
    maxFiles: '14d', // Keep logs for 14 days
    format: fileFormat,
    handleExceptions: true,
    handleRejections: true,
  }),

  // Transport specifically for error logs into a separate rotating file
  new winston.transports.DailyRotateFile({
    level: 'error', // Only log errors
    dirname: logDir,
    filename: 'app-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d', // Keep error logs longer
    format: fileFormat,
    handleExceptions: true,
    handleRejections: true,
  }),

  // Transport specifically for HTTP logs (if you want them separate)
  new winston.transports.DailyRotateFile({
    level: 'http', // Only log http level
    dirname: logDir,
    filename: 'app-http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d', // Keep HTTP logs for a week
    format: fileFormat, // Usually JSON or a simpler format is fine here
  }),
];

// --- Create the Logger Instance ---

const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(winston.format.errors({ stack: true })),
  transports,
  exitOnError: false,
});

const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

export { logger, morganStream };
