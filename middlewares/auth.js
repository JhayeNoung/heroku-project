// req.header('x-auth-token')
// user.isAdmin = true
const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('../models/user');

module.exports = async function(req, res, next){
    // authentication
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Forbidden. Token is not provided');

    // authorization
    const decoded = jwt.verify(token, config.get('privateKey'));
    if(!decoded.isAdmin) return res.status(403).send('Access denied. You have no authorize.');

    // for testing
    req.test = decoded;
    
    next();
};