// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  console.log(token);
  try {
    // Decode token (without verification)
    const decodedToken = jwt.decode(token, { complete: true });
    // console.log("decode", decodedToken);

    // Verify token
    const verifiedToken = jwt.verify(token, 'jhgfdsawqertyuimnbvcxzghjktyufgsser', { algorithms: ['HS256'] });
    // console.log("verify",verifiedToken);

    // Set user information in req
    req.user = verifiedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
};




module.exports = { requireAuth };
