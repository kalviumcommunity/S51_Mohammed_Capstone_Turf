const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    turfID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: true
    },
    userID: {
        type: String, // Appwrite User ID
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        start: { type: String, required: true }, // e.g., "09:00"
        end: { type: String, required: true }   // e.g., "10:00"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
