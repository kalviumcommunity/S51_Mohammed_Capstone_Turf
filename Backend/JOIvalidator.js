const Joi = require('joi');

const validator = (schema) => (data) =>
  schema.validate(data, { abortEarly: false });

const turfUploadSchema = Joi.object({
  turfName: Joi.string().required().min(3).max(15),
  turfDescription: Joi.string().required().min(0).max(50),
  ownerContact: Joi.string().required().length(10),
  address: Joi.string().required().max(40),
  turfDistrict: Joi.string().required(),
  turfTimings: Joi.number().required(),
  turfSportCategory: Joi.string().required(), 
  turfPrice: Joi.number().required().max(9999),
});

const turfUploadValidator = validator(turfUploadSchema);

module.exports = turfUploadValidator;
