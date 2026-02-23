const Joi = require('joi');

const userValidationSchema = Joi.object({
    userName: Joi.string().trim().required(),
    userPhNo: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Please enter a valid 10-digit phone number'
    }),
    userDistrict: Joi.string().trim().required(),
    userLocation: Joi.string().trim().required(),
    userFavourites: Joi.array().items(Joi.string()).default([])
});

module.exports = userValidationSchema;
     