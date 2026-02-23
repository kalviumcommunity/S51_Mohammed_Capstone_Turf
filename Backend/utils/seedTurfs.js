const mongoose = require('mongoose');
const Turf = require('../models/turfModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dummyTurfs = [
    {
        turfName: "Green Valley Arena",
        email: "contact@greenvalley.com",
        ownerContact: "9876543210",
        turfDescription: "Premium grass turf for soccer and cricket matches. Excellent lighting for night games.",
        turfPrice: 1500,
        address: "123 Sports Road, Silicon Valley",
        turfTimings: [
            { day: "Everyday", start: "06:00", end: "23:00" }
        ],
        turfSportCategory: "Soccer",
        turfThumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        turfImages: [
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
            "https://images.unsplash.com/photo-1529900748604-07564a03e7a6"
        ],
        userID: "dummy_owner_1"
    },
    {
        turfName: "Asphalt Kings Court",
        email: "info@asphaltkings.com",
        ownerContact: "9887766554",
        turfDescription: "Professional basketball and tennis court with shock-absorbent flooring.",
        turfPrice: 1200,
        address: "45 Court Lane, Downtown",
        turfTimings: [
            { day: "Everyday", start: "07:00", end: "22:00" }
        ],
        turfSportCategory: "Basketball",
        turfThumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        turfImages: [
            "https://images.unsplash.com/photo-1546519638-68e109498ffc",
            "https://images.unsplash.com/photo-1504450758481-7338ef752496"
        ],
        userID: "dummy_owner_2"
    },
    {
        turfName: "Cricket Central",
        email: "play@cricketcentral.in",
        ownerContact: "9112233445",
        turfDescription: "Indoor cricket nets with automatic bowling machines and high-grade nets.",
        turfPrice: 800,
        address: "78 Cricket Enclave, West End",
        turfTimings: [
            { day: "Everyday", start: "05:00", end: "23:00" }
        ],
        turfSportCategory: "Cricket",
        turfThumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
        turfImages: [
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
            "https://images.unsplash.com/photo-1624526267442-af54e2caae4b"
        ],
        userID: "dummy_owner_3"
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to:", process.env.DATABASE_URI);
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to MongoDB for seeding...");
        
        await Turf.deleteMany({}); // Optional: clear existing
        await Turf.insertMany(dummyTurfs);
        
        console.log("Dummy turfs seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
