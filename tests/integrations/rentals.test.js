const { before } = require('lodash');
const request = require('supertest');
const { User , generateAuthToken} = require('../../models/user');
const { Rental } = require('../../models/rental');
const { Customer } = require('../../models/customer');
const { Movie } = require('../../models/movie');
const { mongo, default: mongoose } = require('mongoose');

describe('/api/rentals ', ()=>{
    let server;
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async ()=>{
        await server.close();
        await Rental.deleteMany({});
        await Customer.deleteMany({});
        await Movie.deleteMany({});
    });

    describe('POST/ ', ()=>{
        let token, rental;
        let execPost = async()=>{
            return await request(server).post('/api/rentals').set('x-auth-token', token).send(rental);
        };
        beforeEach(()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            rental = { };
        });

        it('should return 400 if customer id is malformed', async()=>{
            rental = {customer: "1234"}
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        it('should return 400 if movie id is malformed', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: "1234"}
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        it('should return 404 if customer is not found', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: new mongoose.Types.ObjectId()};
            const res = await execPost();
            expect(res.status).toBe(404);
        });


        it('should return 404 if movie is not found', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: new mongoose.Types.ObjectId()}
            const res = await execPost();
            expect(res.status).toBe(404);
        });

        it('should return 400 if the customer is already rented', async()=>{
            let customer = new Customer({
                name: 'james',
                isGold: true,
                phone: "123456"
            });
            await customer.save();

            let movie = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await movie.save();

            const rentaldb = new Rental({
                customer: {
                    _id: customer._id,
                    name: 'james',
                    phone: "123456",
                    isGold: true,
                },
                movie: {
                    _id: movie._id,
                    title: 'movie',
                    genre: new mongoose.Types.ObjectId(),
                    numberInStock: 10,
                    dailyRentalRate: 100,
                },
            });
            await rentaldb.save();
            
            rental = {
                customer: customer._id,
                movie: movie._id,
            }

            const res = await execPost();
            expect(res.status).toBe(400);
        });

        it('should return 200 if the customer has no record of renting', async()=>{
            let customer = new Customer({
                name: 'james',
                isGold: true,
                phone: "123456"
            });
            await customer.save();

            let movie = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await movie.save();
            
            rental = {
                customer: customer._id,
                movie: movie._id,
            }

            const res = await execPost();
            expect(res.status).toBe(200);
            expect(res.body.movie.numberInStock).toBe(9);
        });
    })

    describe('DELETE/ ', ()=>{
        let token, rental;
        let execPost = async()=>{
            return await request(server).post('/api/rentals').set('x-auth-token', token).send(rental);
        };
        beforeEach(()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            rental = { };
        });

        it('should return 400 if customer id is malformed', async()=>{
            rental = {customer: "1234"}
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        it('should return 400 if movie id is malformed', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: "1234"}
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        it('should return 404 if customer is not found', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: new mongoose.Types.ObjectId()};
            const res = await execPost();
            expect(res.status).toBe(404);
        });


        it('should return 404 if movie is not found', async()=>{
            rental = {customer: new mongoose.Types.ObjectId(), movie: new mongoose.Types.ObjectId()}
            const res = await execPost();
            expect(res.status).toBe(404);
        });

        it('should return 400 if the customer is already rented', async()=>{
            let customer = new Customer({
                name: 'james',
                isGold: true,
                phone: "123456"
            });
            await customer.save();

            let movie = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await movie.save();

            const rentaldb = new Rental({
                customer: {
                    _id: customer._id,
                    name: 'james',
                    phone: "123456",
                    isGold: true,
                },
                movie: {
                    _id: movie._id,
                    title: 'movie',
                    genre: new mongoose.Types.ObjectId(),
                    numberInStock: 10,
                    dailyRentalRate: 100,
                },
            });
            await rentaldb.save();
            
            rental = {
                customer: customer._id,
                movie: movie._id,
            }

            const res = await execPost();
            expect(res.status).toBe(400);
        });

        it('should return 200 if renal has been deleted', async()=>{
            let customer = new Customer({
                name: 'james',
                isGold: true,
                phone: "123456"
            });
            await customer.save();

            let movie = new Movie({
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            });
            await movie.save();
            
            rental = {
                customer: customer._id,
                movie: movie._id,
            }

            const res = await execPost();
            expect(res.status).toBe(200);
            expect(res.body.movie.numberInStock).toBe(9);
        });
    })

})