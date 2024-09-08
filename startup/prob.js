const helmet = require('helmet');
const compression = require('compression');
require('express-async-errors');

module.exports = function(app){
    app.use(helmet());
    app.use(compression());
}