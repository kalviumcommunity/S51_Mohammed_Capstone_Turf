const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Account, ID, Client } = require('appwrite');
const cookieParser = require('cookie-parser');
const user = require('./models/userModel');
const owner = require('./models/ownerModel');

const router = express.Router();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_ID);

const account = new Account(client);

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

router.post('/userdetails', async (req, res)=>{
  const {name, location} = req.body
  const newUser = new user({
    name,
    location
  });
  await newUser.save();
  res.status(200).json({ newUser });
})

router.post('/ownerdetails', async (req, res)=>{
  const {name, location} = req.body
  const newOwner = new owner({
    name,
    location
  });
  await newOwner.save();
  res.status(200).json({ newOwner });
})



router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await account.create(ID.unique(), email, password);
    const authToken = generateToken(response.$id);
    res.status(201).json({ message: "Signup Successful", token: authToken, email:email });
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ message: "Email is already registered" });
    } else {
      res.status(400).json({ message: "Signup error", error: error.message });
    }
    console.log("Signup error:", error.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await account.createEmailPasswordSession(email, password);
    console.log("Appwrite response:", response);
    const authToken = generateToken(response.$id);
    res.status(200).json({ message: "Login successful", token: authToken });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(400).json({ message: "Login error", error: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});

module.exports = { router };
