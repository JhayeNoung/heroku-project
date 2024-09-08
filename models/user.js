const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5, 
        maxlength: 10,
        required: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        min: 5,
        max: 255,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    }
})

userSchema.methods.generateAuthToken = function() {
    // The 'this' context refers to the document, so no need to pass the user as a parameter
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin }, config.get('privateKey'));
}

const User = mongoose.model('User', userSchema);



function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(10).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
      isAdmin: Joi.boolean().required(),
    });
  
    return schema.validate(user);
}

function validateAuth(user) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
  
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;