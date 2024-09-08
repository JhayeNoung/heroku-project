const request = require('supertest');
const {Movie} = require('../../models/movie');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

describe('/api/movies', ()=>{
    let server;

    beforeEach(()=>{
        server = require('../../index');
    });

    afterEach(async ()=>{
        await Movie.deleteMany({});
        await Genre.deleteMany({});
        await server.close();
    })

    describe('GET/ ', ()=>{
        it('should return 200 if all items are got', async ()=>{
            const res = await request(server).get('/api/movies');
            expect(res.status).toBe(200);
        } )
    })

    describe('GET/:id', ()=>{
        it('should return 400 if invalid id', async ()=>{
            id = '123'
            const res = await request(server).get('/api/movies/'+ id);
            expect(res.status).toBe(400);
        })

        it('should return 404 if movie is not found', async ()=>{
            id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/movies/'+ id);
            expect(res.status).toBe(404);
        })

        it('should return 200 if item is found', async ()=>{
            const movie = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await movie.save();
            id = movie._id;
            const res = await request(server).get('/api/movies/'+ id);
            expect(res.status).toBe(200);
        } )
    })

    describe('POST/ ', ()=>{
        let movie, token;
        const execPost = async ()=>{
            return await request(server).post('/api/movies').set('x-auth-token', token).send(movie);
        };

        beforeEach(async ()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            
            let genreId = new mongoose.Types.ObjectId();
            movie = {
                title: 'movie', 
                genre: genreId,
                numberInStock: 10,
                dailyRentalRate: 100,
            };
        })

        it('should return 401 if authentication failed', async()=>{
            token = ' ';
            const res = await execPost();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execPost();
            expect(res.status).toBe(403);
        })

        it('should return 400 if validation failed', async ()=>{
            movie= { };// give wrong object format
            const res = await execPost();
            expect(res.status).toBe(400);
        });

        it('should return 404 if genre is not found', async ()=>{
            const res = await execPost();
            expect(res.status).toBe(404);
        })

        it('should return 200 if everything fines', async ()=>{
            let genre = new Genre({name: 'genre'});
            await genre.save();
            movie.genre = genre._id;
            const res = await execPost();
            expect(res.status).toBe(200);
        })
    })

    describe('PUT/:id ', ()=>{
        let movie, id, token;
        const execPut = async ()=>{
            return await request(server).put('/api/movies/'+id).set('x-auth-token', token).send(movie);
        };

        beforeEach(async ()=>{
            id = new mongoose.Types.ObjectId();
            token = new User({isAdmin: true}).generateAuthToken();

            movie = {title: 'movie'};
        })

        it('should return 401 if authentication failed', async()=>{
            token = ' ';
            const res = await execPut();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execPut();
            expect(res.status).toBe(403);
        })

        it('should return 400 if movie id malformed', async ()=>{
            id= '1';// give wrong object format
            const res = await execPut();
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre id malformed', async ()=>{
            // mock movie id to pass 404 movie is not found
            const moviedb = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await moviedb.save();
            id = moviedb._id;

            movie = {genre: "123"}
            const res = await execPut();
            expect(res.status).toBe(400);
        })

        it('should return 404 if movie is not found', async ()=>{
            id = new mongoose.Types.ObjectId(); // give mock object id
            const res = await execPut();
            expect(res.status).toBe(404);
        })

        it('should return 404 if genre is not found', async ()=>{
            // mock movie id to pass 404 movie is not found
            const moviedb = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await moviedb.save();
            id = moviedb._id;

            // mock genre id
            movie = {genre: new mongoose.Types.ObjectId()};

            const res = await execPut();
            expect(res.status).toBe(404);
        })

        it('should have update object (200) inside movie document', async ()=>{
            const moviedb = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await moviedb.save();

            id = moviedb._id;

            movie = {
                title: 'update-title'
            };

            const res = await execPut();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', 'update-title');
        });
    })

    describe('DELETE/:id ', ()=>{
        let movie, id, token;
        const execDelete = async ()=>{
            return await request(server).delete('/api/movies/'+id).set('x-auth-token', token).send(movie);
        };

        beforeEach(async ()=>{
            id = new mongoose.Types.ObjectId();
            token = new User({isAdmin: true}).generateAuthToken();

            movie = {title: 'movie'};
        })

        it('should return 401 if authentication failed', async()=>{
            token = ' ';
            const res = await execDelete();
            expect(res.status).toBe(401);
        })

        it('should return 403 if authorization failed', async()=>{
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await execDelete();
            expect(res.status).toBe(403);
        })

        it('should return 400 if invalid id format', async ()=>{
            id= '1';// give wrong object format
            const res = await execDelete();
            expect(res.status).toBe(400);
        })

        it('should return 404 if movie is not found', async ()=>{
            id = new mongoose.Types.ObjectId(); // give mock object id
            const res = await execDelete();
            expect(res.status).toBe(404);
        })

        it('should return (200) if delete success', async ()=>{
            const moviedb = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await moviedb.save();

            id = moviedb._id;

            movie = {
                title: 'update-title'
            };

            const res = await execDelete();
            expect(res.status).toBe(200);
        });
    })
})    