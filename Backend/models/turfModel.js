const mongoose = require('mongoose');

// Turf Database Schema created !!!

const turfUploadSchema = new mongoose.Schema({
  turfThumbnail: String, //thumbnail
  turfImages: [String], // extra images
  turfName: String, //name of the turf
  turfDescription: String,  //extra details about the turf
  ownerContact: Number, // owners contact number
  address: String,  // address of the turf
  turfDistrict: String,  //district 
  turfTimings: Number, //timings
  turfSportCategory: String, //category that turfer can play 
  turfPrice: Number, //price/ hr
  userID: String  // "ID" just to track the turf 
});

const turfUpload = mongoose.model('turfUpload', turfUploadSchema);

module.exports = turfUpload;
