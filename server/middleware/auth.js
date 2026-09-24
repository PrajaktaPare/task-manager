const jwt = require('jsonwebtoken');
const User = require('../models/User');

// checks the Bearer token and attaches the user to req
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User for this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    // jwt errors (expired / malformed) are handled in the error middleware
    next(err);
  }
};

module.exports = { protect };
