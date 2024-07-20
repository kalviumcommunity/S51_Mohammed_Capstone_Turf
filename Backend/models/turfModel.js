const mongoose = require('mongoose')

const turfUploadSchama = new mongoose.Schema({
    turfThumbnail:{
        data:Buffer,
        contentType:String
    },
    turfImages:[{
        data:Buffer,
        contentType:String
    }],
    turfName : String,
    turfDescription:String,
    ownerContact:Number,
    address:String,
    turfDistrict:String,
    turfTimings:Number,
    turfSportcategory:String,
    turfPrice:Number,
    userID:String

})

const turfUpload = mongoose.model('turfUpload', turfUploadSchama)

module.exports = turfUpload