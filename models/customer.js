const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50, 
        required: true,
    },
    isGold: { 
        type: Boolean,
        required: true,
    },
    phone: {
        type: String,
        minlength: 5, 
        maxlength: 15, 
        required: true,
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(cus) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(5).max(15).required(), 
    });

    return schema.validate(cus);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validateCustomer = validateCustomer;
