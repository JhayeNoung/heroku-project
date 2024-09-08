const mongoose = require('mongoose');
const config = require('config');
const {msgLogger} = require('../middlewares/logger');
const fixieData = process.env.FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));

const db = config.get('db');
module.exports = function(){
    mongoose.connect(db, {
            proxyUsername: fixieData[0],
            proxyPassword: fixieData[1],
            proxyHost: fixieData[2],
            proxyPort: fixieData[3]
        }
    )
    .then(()=>msgLogger.info(`Connect to ${db}`))
    .catch(err => msgLogger.error(err.message));   
}