const request = require('supertest');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const { default: mongoose } = require('mongoose');
const { Customer } = require('../../models/customer');
const moment = require('moment');
const { Movie } = require('../../models/movie');

describe('POST/', ()=>{
    let server, rental, moviedb, rentaldb, customerId, movieId;
    const execPost = async ()=>{
        return await request(server).post('/api/returns').set('x-auth-token', token).send(rental);
    }
    beforeEach(async ()=>{
        server = require('../../index');
        token = new User({isAdmin: true}).generateAuthToken();
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        rental = {customer: customerId, movie: movieId};

        moviedb = new Movie({
            _id: movieId,
            title: 'movie',
            genre: new mongoose.Types.ObjectId(),
            numberInStock: 10,
            dailyRentalRate: 100,
        });
        await moviedb.save();
        
        rentaldb = new Rental({
            customer: {
                _id: customerId,
                name: 'james',
                isGold: true,
                phone: "123456",
            },
            movie: {
                _id: movieId,
                title: 'movie',
                genre: new mongoose.Types.ObjectId(),
                numberInStock: 10,
                dailyRentalRate: 100,
            },
        });
        await rentaldb.save();
    });
    afterEach(async ()=>{
        await server.close();
        await Rental.deleteMany({});
    });
    
    it('should return 400 if customer field is not provided', async()=>{
        rental = {movie: movieId};
        const res = await execPost();
        expect(res.status).toBe(400);
    })

    it('should return 400 if moive field is not provided', async()=>{
        rental = {customer: customerId};
        const res = await execPost();
        expect(res.status).toBe(400);
    })

    it('should return 404 if not found the rental with provided customer and movie id', async ()=>{
        rental = {customer: new mongoose.Types.ObjectId(), movie: new mongoose.Types.ObjectId()};
        const res = await execPost();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental retunred is true', async ()=>{
        rentaldb.dateReturned = new Date();
        await rentaldb.save();
        const res = await execPost();
        expect(res.status).toBe(400);
    });

    it('should return 200', async ()=>{
        const res = await execPost();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('dateReturned');
        expect(res.body).toHaveProperty('dateOut');
    });

    it('should be 700 for rentalFee and movie should restock', async ()=>{
        rentaldb.dateOut = moment().add(-7, 'days').toDate();
        await rentaldb.save();
        const res = await execPost();
        expect(res.body.rentalFee).toBe(700);
        const movie = await Movie.findById(movieId);
        expect(movie.numberInStock).toBe(11);
    });

})