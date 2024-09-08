const logger = require('./logger');

// caught erros from express-async-erros will throw this function
module.exports = function (err, req, res, next){
    logger.error(err.message, err);
    res.status(500).send(err.message);
};