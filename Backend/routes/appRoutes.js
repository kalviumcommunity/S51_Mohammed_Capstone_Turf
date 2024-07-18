const express = require('express');
const multer = require('multer');
const TurfUpload = require('../models/turfModel');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
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
  const { turfName, turfDescription, ownerContact, address, turfDistrict, turfTimings, turfSportcategory, turfPrice } = req.body;
  
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

  const newTurf = new TurfUpload({
    turfThumbnail,
    turfImages,
    turfName,
    turfDescription,
    ownerContact,
    address,
    turfDistrict,
    turfTimings,
    turfSportcategory,
    turfPrice,
  });

  try {
    await newTurf.save();
    res.status(200).send('Turf information and images saved successfully.');
  } catch (error) {
    res.status(500).send('Error saving turf information and images.');
  }
});

module.exports = router;
