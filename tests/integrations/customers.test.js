const request = require('supertest');
const { Customer } = require('../../models/customer');
const { User } = require('../../models/user');
const { before } = require('lodash');
const { default: mongoose } = require('mongoose');

describe('/api/customers ', () => {
    let server;
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
        await Customer.deleteMany({});
    });

    describe('GET/ ', () => {
        it('should return 200 if there are customers', async () => {
            // Optionally, add a customer here to verify the response
            const res = await request(server).get('/api/customers');
            expect(res.status).toBe(200);
        });

        it('should return an array of customers', async () => {
            // Optionally, add a customer here to verify the response
            const res = await request(server).get('/api/customers');
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('GET/:id ', ()=>{
        // check validate object id 400
        it('should return 400 if invalid id', async ()=>{
            const id = '123'
            const res = await request(server).get('/api/customers/'+ id);
            expect(res.status).toBe(400);
        })

        // check 404
        it('should return 404 if customer is not found', async()=>{
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/customers/'+id);
            expect(res.status).toBe(404);
        })

        // send item
        it('should return 200', async()=>{
            const customer = new Customer({
                name: "james",
                isGold: true,
                phone: "123456",
            });
            await customer.save();
            const id = customer._id;
            const res = await request(server).get('/api/customers/'+id);
            expect(res.status).toBe(200);
        })
    })

    describe('POST/ ', () =>{
        // check 401, 403
        let token, customer;
        const execPost = async ()=>{
            return await request(server).post('/api/customers').set('x-auth-token', token).send(customer);
        }
        beforeEach(async ()=>{
            token = await User({isAdmin: true}).generateAuthToken()
            customer = {name: "customer"};
        })

        // check validation
        it('should return 400 if validation failed', async()=>{
            customer = { };
            const res = await execPost();
            expect(res.status).toBe(400);
        })

        // post
        it('should return 200', async()=>{
            customer = {
                name: 'james',
                isGold: true,
                phone: '123456',
            }
            const res = await execPost();
            expect(res.status).toBe(200);
        })
    })

    describe('PUT/:id ', ()=>{
        // check validate object id 400
        it('should return 400 if invalid id', async ()=>{
            const id = '123';
            const customer = {name: "james"};
            const res = await request(server).put('/api/customers/'+ id).send(customer);
            expect(res.status).toBe(400);
        })

        // check 404
        it('should return 404 if customer is not found', async()=>{
            const id = new mongoose.Types.ObjectId();
            const customer = {name: "james"};
            const res = await request(server).put('/api/customers/'+id).send(customer);
            expect(res.status).toBe(404);
        })

        // send item
        it('should return 200', async()=>{
            const cusdb = new Customer({
                name: "james",
                isGold: true,
                phone: "123456",
            });
            await cusdb.save();
            const id = cusdb._id;

            const customer = {name: 'james'};

            const res = await request(server).put('/api/customers/'+id).send(customer);
            expect(res.status).toBe(200);
        })
    })

    describe('DELETE/:id ', ()=>{
        // check validate object id 400
        it('should return 400 if invalid id', async ()=>{
            const id = '123';
            const res = await request(server).delete('/api/customers/'+ id);
            expect(res.status).toBe(400);
        })

        // check 404
        it('should return 404 if customer is not found', async()=>{
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).delete('/api/customers/'+id);
            expect(res.status).toBe(404);
        })

        // send item
        it('should return 200', async()=>{
            const customer = new Customer({
                name: "james",
                isGold: true,
                phone: "123456",
            })
            await customer.save();
            const id = customer._id;
            const res = await request(server).delete('/api/customers/'+id);
            expect(res.status).toBe(200);
        })
    })
});
