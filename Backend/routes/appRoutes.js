const express = require('express');
const multer = require('multer');
const turfUploadValidator = require('../JOIvalidator');
const turfUpload = require('../models/turfModel');


const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
  }
});

router.post('/upload', upload.fields([
  { name: 'turfThumbnail', maxCount: 1 },
  { name: 'turfImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { error, value } = turfUploadValidator(req.body);
    if (error) {
      console.log(error);
      console.log(error.details);
      return res.status(400).json(error.details);
    }

    if (!req.files['turfThumbnail']) {
      return res.status(400).json({ message: 'turfThumbnail is required' });
    }
    if (!req.files['turfImages'] || req.files['turfImages'].length === 0) {
      return res.status(400).json({ message: 'turfImages are required' });
    }

    const { turfName, turfDescription, ownerContact, address, turfDistrict, turfTimings, turfSportCategory, turfPrice, userID } = req.body;

    let turfThumbnail = null;
    let turfImages = [];

    if (req.files['turfThumbnail'] && req.files['turfThumbnail'][0]) {
      turfThumbnail = {
        data: req.files['turfThumbnail'][0].buffer,
        contentType: req.files['turfThumbnail'][0].mimetype,
      };
    }

    if (req.files['turfImages']) {
      turfImages = req.files['turfImages'].map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
    }

    const newTurf = new turfUpload({
      turfThumbnail,
      turfImages,
      turfName,
      turfDescription,
      ownerContact,
      address,
      turfDistrict,
      turfTimings,
      turfSportCategory,
      turfPrice,
      userID
    });

    await newTurf.save();
    res.status(200).send('Turf information and images saved successfully.');
  } catch (error) {
    console.log(error.message, "POST error('cant post your data')");
    res.status(500).send('Error saving turf information and images.');
  }
});

// File size error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File size too large. Maximum allowed size is 5MB.');
    }
  }
  if (err.message === 'Invalid file type. Only image files are allowed.') {
    return res.status(400).send(err.message);
  }
  next(err);
});

router.get('/yourTurfs', async (req, res) => {
  try {
    const userID = req.cookies.userID;
    console.log('Retrieved User ID from cookies:', userID);

    if (!userID) {
      return res.status(400).json({ message: 'User ID not found in cookies' });
    }

    const turfs = await turfUpload.find({ userID });
    console.log('Found Turfs:', turfs);

    if (turfs.length === 0) {
      return res.status(200).json({ message: 'No turfs found for this user' });
    }

    res.json(turfs);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while fetching the turfs');
  }
});


module.exports = router;
