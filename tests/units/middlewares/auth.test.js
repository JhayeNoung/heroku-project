const request = require('supertest');
const { User , generateAuthToken} = require('../../../models/user');
const auth = require('../../../middlewares/auth');
const { default: mongoose } = require('mongoose');

describe('auth middlewares', ()=>{
    it('req object should contain test key with _id and is admin values', async ()=>{
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        }
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token) // mock req.header
        };
        const res = { };
        const next = jest.fn(); // mock function
        auth(req, res, next);

        expect(req.test).toMatchObject(user);
    })
})