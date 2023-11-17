const winston = require('winston');

global.logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.simple()
  ),
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});

if (process.env.NODE_ENV == 'dev') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }