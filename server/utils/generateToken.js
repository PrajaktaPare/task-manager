const jwt = require('jsonwebtoken');

// "remember me" gets a long lived token, otherwise it expires in a day
const generateToken = (userId, rememberMe = false) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : '1d',
  });
};

module.exports = generateToken;
