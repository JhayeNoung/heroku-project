const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const validObjectId = require('../middlewares/validObjectId');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req,res)=>{
    const customers = await Customer.find();
    res.status(200).send(customers);
});

router.get('/:id', validObjectId, async (req,res)=>{
    // check validate object id 400
    // check 404
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(customer);

    // send item
    res.status(200).send(customer);
});

router.post('/', async (req, res)=>{
    // check 401, 403
    // check validation 400
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // post
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    })
    await customer.save();

    res.status(200).send(customer);

});

router.put('/:id', validObjectId, async(req, res)=>{
    // check 400 valid id
    // check 404
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(customer);

    // update
    customer.name = req.body.name || customer.name;
    customer.isGold = req.body.isGold || customer.isGold;
    customer.phone = req.body.phone || customer.phone;
    await customer.save();

    res.status(200).send(customer);

})

router.delete('/:id', validObjectId, async(req, res)=>{
    // check 400 valid id
    // check 404
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(customer);

    // delete
    await customer.deleteOne();

    res.status(200).send(customer);

})

module.exports = router;