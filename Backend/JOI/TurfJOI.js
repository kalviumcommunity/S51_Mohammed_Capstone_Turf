const Joi = require('joi');

const validator = (schema) => (data) =>
  schema.validate(data, { abortEarly: false });

const turfUploadSchema = Joi.object({
  turfName: Joi.string().required().min(4).max(30),
  email: Joi.string().required().email(), // Email validation with Joi
  turfThumbnail: Joi.string().uri({ scheme: ['http', 'https'] }).required(), // Thumbnail should be a valid URL
  turfImages: Joi.array()
    .items(Joi.string().uri({ scheme: ['http', 'https'] }).required())
    .min(1)
    .max(5)
    .required(), // Up to 5 valid URLs with URI validation
  turfDescription: Joi.string().required().min(20).max(150), // Description validation
  ownerContact: Joi.string().required().pattern(/^[0-9]{10}$/), // Exactly 10 digits for contact
  address: Joi.string().required().max(50), // Address validation with max length of 50
  turfTimings: Joi.array().items(
    Joi.object({
      day: Joi.string().required(),
      start: Joi.string().required(), // Could add regex for time validation if necessary
      end: Joi.string().required()
    })
  ).length(7).required(), // 7 days of timing required
  turfSportCategory: Joi.string().required(),
  turfPrice: Joi.number().required().min(0).max(9999), // Price validation
  userID: Joi.string().required(), // User ID validation
});

// Validator function
const turfUploadValidator = validator(turfUploadSchema);

// Export using module.exports
module.exports = turfUploadValidator;
