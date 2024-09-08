const logger = require('./logger');

// caught erros from express-async-erros will throw this function
module.exports = function (err, req, res, next){
    logger.error({
        service: 'user-service',
        level: err.level,
        message: err.message,
        stack: err.stack,
    });
    res.status(500).send(err);
};