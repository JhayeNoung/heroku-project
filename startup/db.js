const mongoose = require('mongoose');
const config = require('config');
const {msgLogger} = require('../middlewares/logger');

const db = config.get('db');
module.exports = function(){
    mongoose.connect(db)
    .then(()=>msgLogger.info(`Connect to ${db}`))
    .catch(err => msgLogger.error(err.message));   
}