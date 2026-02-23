const express = require('express');
const turfUploadValidator = require('../JOIvalidator');
const turfUpload = require('../models/turfModel');


const router = express.Router();


router.post('/upload', async (req, res) => {
  try {
    const { error, value } = turfUploadValidator(req.body);
    if (error) {
      console.log(error);
      console.log(error.details);
      return res.status(400).json(error.details);
    }

    const {turfThumbnail, turfImages, turfName, turfDescription, ownerContact, address, turfDistrict, turfTimings, turfSportCategory, turfPrice, userID } = req.body;
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


 //////////
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

//////////////////

router.put('/updateTurfData', async (req,res)=>{
  try {
    const userID = req.cookies.userID;
    console.log("userId cookie fetched", userID, "from update turdf")

    const {data} = req.body
    const _id = data._id;
    
    const updateTurf = await turfUpload.findOneAndUpdate({_id}, { $set: data }, { new: true });
    if (!updateTurf) {
      return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Successfully updated turf', updateTurf});
  } catch (error) {
    console.error('PUT error', error);
    res.status(500).json({ error: 'Internal Server Error' });  }
})

router.delete('/deleteTurf', async (req, res) => {
  try {
    const userID = req.cookies.userID;
    console.log("userId cookie fetched", userID, "from delete turf");

    const { _id } = req.body;
    
    if (!userID) {
      return res.status(400).json({ message: 'User ID not found in cookies' });
    }

    const deleteTurf = await turfUpload.findOneAndDelete({ _id, userID });

    if (!deleteTurf) {
      return res.status(404).json({ message: 'Turf not found or user does not have permission to delete this turf' });
    }

    res.status(200).json({ message: 'Successfully Deleted turf', deleteTurf });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/////////////////// 

router.get('/getAllTurfs', async(req, res)=>{
  try {
    const allTurfs = await turfUpload.find()
    console.log(allTurfs)
    if (allTurfs.length === 0) {
      return res.status(404).json({ message: "No details found" });
    }
    res.status(200).json(allTurfs);

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Internal Server Error" });

  }
})


module.exports = router;
