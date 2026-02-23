const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
  turfName: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  ownerContact: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  turfDescription: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 150
  },
  turfPrice: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: String,
    required: true,
    maxlength: 50
  },
  turfTimings: {
    type: [
      {
        day: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true }
      }
    ],
    required: true
  },
  turfSportCategory: {
    type: String,
    required: true,
  },
  turfThumbnail: {
    type: String,
    required: true,
    match: /^(http|https):\/\/[^ "]+$/
  },
  turfImages: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    match: /^(http|https):\/\/[^ "]+$/
  },
  userID: {
    type: String,
    required: true
  }
});

// Custom validator for array limit
function arrayLimit(val) {
  return val.length <= 5;
}

// Use module.exports to export the model
module.exports = mongoose.model('Turf', TurfSchema);
