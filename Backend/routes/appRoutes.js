// // routes/appRoutes.js
// const express = require('express');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET;

// // router.post('/userdetails', async (req, res) => {
// //   try {
// //     const { name, location } = req.body;
    
// //     const newUser = new user({
// //       name,
// //       location
// //     });

// //     await newUser.save();
// //     res.status(200).json({ user: newUser });
// //   } catch (error) {
// //     console.error("Error saving user:", error);
// //     res.status(500).json({ error: 'Failed to save user' });
// //   }
// // });

// // router.post('/ownerdetails', async (req, res) => {
// //   const { name, location } = req.body;
// //   try {
// //     const newOwner = new owner({
// //       name,
// //       location
// //     });
// //     await newOwner.save();
// //     res.status(200).json({ owner: newOwner });
// //   } catch (error) {
// //     console.error("Error saving owner:", error);
// //     res.status(500).json({ error: 'Failed to save owner' });
// //   }
// // });

// // const authenticateToken = (req, res, next) => {
// //   const token = req.header('Authorization')?.split(' ')[1];
// //   if (!token) return res.sendStatus(401);

// //   jwt.verify(token, JWT_SECRET, (err, user) => {
// //     if (err) return res.sendStatus(403);
// //     req.user = user;
// //     next();
// //   });
// // };

// // router.get('/protected', authenticateToken, (req, res) => {
// //   res.status(200).json({ message: 'This is a protected route' });
// // });

// // router.post

// module.exports = router;
