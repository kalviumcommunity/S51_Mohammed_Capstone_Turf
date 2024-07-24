const mongoose = require('mongoose');

const turfUploadSchema = new mongoose.Schema({
  turfThumbnail: String,
  turfImages: [String],
  turfName: String,
  turfDescription: String,
  ownerContact: Number,
  address: String,
  turfDistrict: String,
  turfTimings: Number,
  turfSportCategory: String,
  turfPrice: Number,
  userID: String
});

const turfUpload = mongoose.model('turfUpload', turfUploadSchema);

module.exports = turfUpload;
