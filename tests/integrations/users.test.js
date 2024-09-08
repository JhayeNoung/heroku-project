const request = require('supertest');
const { User } = require('../../models/user');
const { default: mongoose } = require('mongoose');
const { before } = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;

describe('api/users', ()=>{
    let server;
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async ()=>{
        await User.deleteMany({});
        await server.close();
    });
    
    describe('GET/ ', ()=>{
        it('should return all users', async ()=>{
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
        })
    });

    describe('POST/ ', ()=>{
        let userObj, userId, user;

        const execPost = async ()=>{
            return await request(server).post('/api/users').send(userObj);
        }

        beforeEach(()=>{
            // mock user document to test 'user is already registered or not'
            userId = new mongoose.Types.ObjectId();
            user = new User({
                _id: userId,
                name: 'scarlet', 
                email: 'scarlet@gmail.com',
                password: 'password',
                isAdmin: false,
            })
            user.save();

            // mock object
            userObj = {
                name: 'james',
                email: 'james@gmail.com',
                password: 'password',
                isAdmin: true,
            }
        })

        it('sould return 400 if validation failed', async ()=>{
            userObj = { };
            const res = await execPost();
            expect(res.status).toBe(400);
        }),

        it('sould return 400 if user is already registered', async ()=>{
            userObj.email = 'scarlet@gmail.com';
            const res = await execPost();
            expect(res.status).toBe(400);
        }),

        it('should return 200 if everyting fines', async ()=>{
            const res = await execPost();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('isAdmin', true);
        })
    });

    describe('POST/LOGIN ', ()=>{
        let userObj;

        const execPost = async ()=>{
            return await request(server).post('/api/users/login').send(userObj);
        }

        beforeEach(async ()=>{
            userObj = {
                email: 'james@gmail.com',
                password: '12345'
            }

            let hash = await bcrypt.hash('12345', saltRounds);
            let user = new User({
                name: 'james',
                email: 'james@gmail.com',
                password: hash,
                isAdmin: true,
            })
            await user.save();
        });
        
        // validate email and password
        it('should return 400 if infos are not provided', async()=>{
            userObj = { }
            const res = await execPost();
            expect(res.status).toBe(400);
        });
        
        // find user by email and check 404
        it('should return 404 if the user is not found', async()=>{
            userObj.email = 'joe@gmail.com'
            const res = await execPost();
            expect(res.status).toBe(404);
        })

        // check password
        it('should return 400 if the password is invalid', async()=>{
            userObj.password = '123456'
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        // generate token
        it('should return 200 if everyting is passed', async()=>{
            const res = await execPost();
            expect(res.status).toBe(200);
        })
    })
    
    describe('POST/LOGIN/DELETE ', ()=>{
        let userObj;

        const execPost = async ()=>{
            return await request(server).delete('/api/users/login/delete').send(userObj);
        }

        beforeEach(async ()=>{
            userObj = {
                email: 'james@gmail.com',
                password: '12345'
            }

            let hash = await bcrypt.hash('12345', saltRounds);
            let user = new User({
                name: 'james',
                email: 'james@gmail.com',
                password: hash,
                isAdmin: true,
            })
            await user.save();
        });
        
        // validate email and password
        it('should return 400 if infos are not provided', async()=>{
            userObj = { }
            const res = await execPost();
            expect(res.status).toBe(400);
        });
        
        // find user by email and check 404
        it('should return 404 if the user is not found', async()=>{
            userObj.email = 'joe@gmail.com'
            const res = await execPost();
            expect(res.status).toBe(404);
        })

        // check password
        it('should return 400 if the password is invalid', async()=>{
            userObj.password = '123456'
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        // generate token
        it('should return 200 if everyting is passed', async()=>{
            const res = await execPost();
            expect(res.status).toBe(200);
        })
    })
}); 