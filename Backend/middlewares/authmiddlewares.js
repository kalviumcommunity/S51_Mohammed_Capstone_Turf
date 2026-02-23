// middleware/authMiddleware.js
const { Client, Users } = require('node-appwrite');

const verifyAppwriteToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Initialize Appwrite client
    const client = new Client();
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_ID)
      .setJWT(token); // Set the JWT token

    // Verify token by making a request
    const users = new Users(client);
    const account = await users.get('me'); // This will fail if token is invalid

    // Attach user info to request
    req.appwriteUser = account;
    req.userId = account.$id;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyAppwriteToken;