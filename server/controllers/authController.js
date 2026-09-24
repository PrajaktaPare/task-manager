const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

const sendAuthResponse = (res, status, user, rememberMe = false) => {
  res.status(status).json({
    token: generateToken(user._id, rememberMe),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character',
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // role is never taken from the request body, everyone who signs up is a normal user
    const user = await User.create({ name, email, password });
    sendAuthResponse(res, 201, user);
  } catch (err) {
    next(err);
  }
};

// POST /api/login
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    const passwordMatches = user && (await user.comparePassword(password));

    if (!passwordMatches) {
      // same message for both cases so nobody can guess which emails exist
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendAuthResponse(res, 200, user, Boolean(rememberMe));
  } catch (err) {
    next(err);
  }
};

// GET /api/me
const getMe = (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { id: _id, name, email, role } });
};

// GET /api/users  (used for the "assign to" dropdown)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role').sort('name');
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, getUsers };
