const Joi = require('joi');

const validator = (schema) => (data) => 
  schema.validate(data, { abortEarly: false });

const turfUploadSchema = Joi.object({
  turfThumbnail: Joi.string().required(),
  turfImages: Joi.array().items(Joi.string().required()).min(1).required(),
  turfName: Joi.string().required().min(5).max(30),
  turfDescription: Joi.string().required().min(4).max(100),
  ownerContact: Joi.string().required().length(10),
  address: Joi.string().required().max(99),
  turfDistrict: Joi.string().required(),
  turfTimings: Joi.number().required(),
  turfSportCategory: Joi.string().required(),
  turfPrice: Joi.number().required().max(9999),
  userID: Joi.string().required(),
});

const turfUploadValidator = validator(turfUploadSchema);

module.exports = turfUploadValidator;
