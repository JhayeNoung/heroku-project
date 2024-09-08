const express = require('express');
const movies = require('../routes/movies');
const genres = require('../routes/genres');
const users = require('../routes/users');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middlewares/error');
const auth = require('../middlewares/auth');
const morgan = require('morgan');

module.exports = function(app){
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('tiny'));
    
    app.use('/api/movies', movies);
    app.use('/api/genres', genres);
    app.use('/api/users', users);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use(error);
    app.use(auth);
} 
