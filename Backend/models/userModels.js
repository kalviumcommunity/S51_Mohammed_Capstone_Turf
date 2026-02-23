const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    appwriteId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'],
        default: 'user'
    },
    userName: {
        type: String,
        trim: true
    },
    userPhNo: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    userDistrict: {
        type: String,
        trim: true
    },
    userLocation: {
        type: String,
        trim: true
    },
    userFavourites: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
