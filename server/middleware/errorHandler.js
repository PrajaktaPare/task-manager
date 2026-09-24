const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// one place where every error ends up, so the frontend always gets { message }
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    message = 'An account with this email already exists';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Session expired, please log in again';
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token, please log in again';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  }

  if (status === 500) console.error(err);

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
