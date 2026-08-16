import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: 'requests.log' }) // log to file
  ],
});

export default logger;
