const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

// Initialize Logtail
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? 'info' : 'debug';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define the format for logging
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports based on environment
const getTransports = () => {
  const transports = [
    // Always write to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.json(),
    }),
    
    // Write error logs to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    }),
  ];

  // Add Logtail in production and staging
  if (['production', 'staging'].includes(process.env.NODE_ENV)) {
    transports.push(new LogtailTransport(logtail));
  }

  return transports;
};

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: getTransports(),
});

// Export a stream object for Morgan middleware
const stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = { logger, stream };
