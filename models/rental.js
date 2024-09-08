const mongoose = require('mongoose');
const { movieSchema } = require('./movie');
const {customerSchema} = require('./customer');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    movie: {
        type: movieSchema,
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0,
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customer: Joi.objectId().required(),
        movie: Joi.objectId().required(),
        dateOut: Joi.date(),
        dateReturned: Joi.date(),
        rentalFee: Joi.number()
    })

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
exports.validateRental = validateRental;