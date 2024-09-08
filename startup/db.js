const mongoose = require('mongoose');
const config = require('config');
const logger = require('../middlewares/logger');

const db = config.get('db');
module.exports = function(){
    mongoose.connect(db)
        .then(()=>logger.info(`Connects to ${db}`))
        .catch(err => logger.error(`Cannot connect to the database: ${err.message}`));   
}