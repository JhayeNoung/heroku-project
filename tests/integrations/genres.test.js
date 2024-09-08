const { before } = require('lodash');
const { default: mongoose } = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');


describe('/api/genres ', ()=>{
    let server;
    beforeEach(()=>{
        server = require('../../index');
    })
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany({});
    })
    describe('GET/ ', ()=>{
        it('should return 200 for all genre', async ()=>{
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
        })
    })

    describe('GET/:id ', ()=>{
        it('should return 400 if invalid id', async ()=>{
            let id = '123'
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(400);
        })

        it('should return 404 if no genre with this id', async ()=>{
            let id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(404);
        })

        it('should return 200 if everyting is good', async ()=>{
            let genre = new Genre({name: 'genre'})
            await genre.save();
            let id = genre._id;
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(200);
        })
    })

    describe('POST/ ', ()=>{
        let token, name;
        const execPost = async ()=>{
            return request(server).post('/api/genres').set('x-auth-token', token).send({name});
        }
        beforeEach(async ()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            name = 'genre';
        })
        it('should return 401 if authorization failed', async ()=>{
            token = ' ';
            const res = await execPost();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async ()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execPost();
            expect(res.status).toBe(403);
        })

        it('should return 400 if validation failed', async ()=>{
            name = ' ';
            const res = await execPost();
            expect(res.status).toBe(400);       
        })

        it('should return 200 if everything is ok', async ()=>{
            const res = await execPost();
            expect(res.status).toBe(200);
        })
    })

    describe('PUT/ ', ()=>{
        let token, name, id;
        const execPut = async ()=>{
            return request(server).put('/api/genres/'+id).set('x-auth-token', token).send({name});
        }
        beforeEach(async ()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            id = new mongoose.Types.ObjectId();
            name = 'genre';
        })
        it('should return 400 if invalid id', async ()=>{
            id = '123'
            const res = await execPut();
            expect(res.status).toBe(400);
        })

        it('should return 401 if authorization failed', async ()=>{
            token = ' ';
            const res = await execPut();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async ()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execPut();
            expect(res.status).toBe(403);
        })

        it('should return 400 if validation failed', async ()=>{
            name = ' ';
            const res = await execPut();
            expect(res.status).toBe(400);       
        })

        it('should return 404 if genre is not found', async ()=>{
            id = new mongoose.Types.ObjectId();
            const res = await execPut();
            expect(res.status).toBe(404);       
        })

        it('should return 200 if everything is ok', async ()=>{
            const genre = new Genre({name: 'genre'});
            await genre.save();
            id = genre._id;
            const res = await execPut();
            expect(res.status).toBe(200);
        })
    })

    describe('DELETE/ ', ()=>{
        let token, id;
        const execDelete = async ()=>{
            return request(server).delete('/api/genres/'+id).set('x-auth-token', token);
        }
        beforeEach(async ()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            id = new mongoose.Types.ObjectId();
        })
        it('should return 400 if invalid id', async ()=>{
            id = '123'
            const res = await execDelete();
            expect(res.status).toBe(400);
        })

        it('should return 401 if authorization failed', async ()=>{
            token = ' ';
            const res = await execDelete();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async ()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execDelete();
            expect(res.status).toBe(403);
        })

        it('should return 404 if genre is not found', async ()=>{
            id = new mongoose.Types.ObjectId();
            const res = await execDelete();
            expect(res.status).toBe(404);       
        })

        it('should return 200 if everything is ok', async ()=>{
            const genre = new Genre({name: 'genre'});
            await genre.save();
            id = genre._id;
            const res = await execDelete();
            expect(res.status).toBe(200);
        })
    })

});