const express = require('express');
const { User, validateUser, validateAuth } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', async (req, res)=>{
    const user = await User.find();
    res.status(200).send(user);
});

// register user
router.post('/', async (req, res)=>{
    // validate the request body and check 400
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check existed user or not
    const email = await User.findOne({email: req.body.email});
    if(email) return res.status(400).send('email has been used.');

    // create user and hash user password
    const user = new User(req.body);
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hashPassword;
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).status(200).send(user);
});

// login
router.post('/login', async (req, res)=>{
    // validate email and password
    const {error} = validateAuth(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find user by email and check 404
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send('Not found user with this email');

    // check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');

    // generate token
    const token = user.generateAuthToken();
    res.status(200).send(token);
});

// delete
router.delete('/login/delete', async (req, res)=>{
    // validate email and password
    const {error} = validateAuth(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find user by email and check 404
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send('Not found user with this email');

    // check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');

    // generate token
    await user.deleteOne();
    res.status(200).send('User has been deleted');
});

module.exports = router;