const winston = require('winston');

// Define custom log format
const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    // Include stack trace if available
    return `${message}`;
});
  

const logger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize(),
    ),

    defaultMeta: { service: 'user-service' },

    transports: [
        new winston.transports.Console({
            // format: winston.format.combine(
            //     customFormat,
            // )
        })
    ],

    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'log/exceptions.log'}),
    ],

    rejectionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'log/rejections.log'}),
    ]
});

const msgLogger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize(),
    ),

    defaultMeta: { service: 'user-service' },

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                customFormat,
            )
        })
    ]
});

// exitOnError cannot be true with no exception handlers: new winston.transports.Console(), new winston.transports.File(), new winston.transports.DB(),
// logger.exitOnError = false;  

exports.logger = logger;
exports.msgLogger = msgLogger;