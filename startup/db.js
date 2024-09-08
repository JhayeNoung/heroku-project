// const mongoose = require('mongoose');
// const config = require('config');
// const {msgLogger} = require('../middlewares/logger');
// const fixieData = process.env.FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));

// const db = config.get('db');
// module.exports = function(){
//     mongoose.connect(db, {
//             proxyUsername: fixieData[0],
//             proxyPassword: fixieData[1],
//             proxyHost: fixieData[2],
//             proxyPort: fixieData[3]
//         }
//     )
//     .then(()=>msgLogger.info(`Connect to ${db}`))
//     .catch(err => msgLogger.error(err.message));   
// }

const mongoose = require('mongoose');
const SocksProxyAgent = require('socks-proxy-agent');
const config = require('config');
const { msgLogger } = require('../middlewares/logger');

const fixieData = process.env.FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));

const db = config.get('db');
const proxyUrl = `socks://${fixieData[0]}:${fixieData[1]}@${fixieData[2]}:${fixieData[3]}`;

const agent = new SocksProxyAgent(proxyUrl);

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    agent: agent
})
.then(() => {
    console.log('Connected to database');
    msgLogger.info(`Connected to ${db}`);
})
.catch(err => {
    console.error(`Cannot connect to the database ${err.message}`);
    msgLogger.error(`Cannot connect to the database ${err.message}`);
});
