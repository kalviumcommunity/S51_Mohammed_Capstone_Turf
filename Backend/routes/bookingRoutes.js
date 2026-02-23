const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Turf = require('../models/turfModel');
const verifyAppwriteToken = require('../middlewares/authmiddlewares');

// Get bookings for a specific turf on a specific date (to show availability)
router.get('/availability/:turfId', async (req, res) => {
    try {
        const { turfId } = req.params;
        const { date } = req.query; // date format: YYYY-MM-DD

        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            turfID: turfId,
            bookingDate: { $gte: startTime, $lte: endTime },
            status: { $ne: 'Cancelled' }
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
});

// Create a new booking
router.post('/book', verifyAppwriteToken, async (req, res) => {
    try {
        const { turfId, bookingDate, timeSlot, totalPrice } = req.body;
        const userId = req.userId; // From middleware

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({
            turfID: turfId,
            bookingDate: new Date(bookingDate),
            'timeSlot.start': timeSlot.start,
            status: { $ne: 'Cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'This slot is already booked' });
        }

        const newBooking = new Booking({
            turfID: turfId,
            userID: userId,
            bookingDate: new Date(bookingDate),
            timeSlot,
            totalPrice
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', verifyAppwriteToken, async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await Booking.find({ userID: userId }).populate('turfID');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your bookings', error: error.message });
    }
});

module.exports = router;
