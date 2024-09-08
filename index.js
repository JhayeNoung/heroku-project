const express = require('express');
const app = express();
const {logger, msgLogger} = require('./middlewares/logger');
const { format } = require('morgan');
require('express-async-errors');

// we need to pass 'app' to startup/routes module(that is connected to port 3000)
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prob')(app);
// const p = Promise.reject(new Error("unhandled rejection."));
// p.then(()=>console.log('OK'));
 
// throw new Error('injecting uncaught exception');

// you can use an express method get(), to know what enviroment
msgLogger.info(`Environment - ${app.get('env')}`);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, ()=>msgLogger.info(`Listening at port ${PORT}.`));  

module.exports = server;