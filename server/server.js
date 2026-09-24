require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // no origin = Postman / curl / server-to-server, let those through
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Task Manager API is running' }));

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
