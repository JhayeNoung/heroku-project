const {User} = require('../../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('GenerateAuthToken', ()=>{
    it('should decoded name to be james',async ()=>{
        const user = new User({isAdmin: true});

        const token = await user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('privateKey'));

        expect(decoded.isAdmin).toBe(true);
    })
})