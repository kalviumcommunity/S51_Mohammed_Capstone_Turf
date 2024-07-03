const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name:String,
    location:String
})

const owner = mongoose.model('owner', ownerSchema)

module.exports = owner;