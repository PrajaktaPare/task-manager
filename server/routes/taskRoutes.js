const express = require('express');
const {
  getTasks,
  getStats,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every task route needs a valid JWT

// /stats has to come before /:id or express treats "stats" as an id
router.get('/stats', getStats);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
