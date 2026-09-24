const Task = require('../models/Task');
const User = require('../models/User');
const { STATUSES, PRIORITIES } = require('../models/Task');
const { escapeRegex } = require('../utils/validators');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  dueAsc: { dueDate: 1 },
  dueDesc: { dueDate: -1 },
};

const populateUsers = (query) =>
  query.populate('assignedTo', 'name email').populate('createdBy', 'name email');

const isAdmin = (user) => user.role === 'admin';
const idOf = (ref) => String(ref._id || ref);

// GET /api/tasks?search=&status=&priority=&sort=&page=&limit=
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, assignedTo, sort = 'newest' } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status filter. Use: ${STATUSES.join(', ')}` });
    }
    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: `Invalid priority filter. Use: ${PRIORITIES.join(', ')}` });
    }
    if (!SORT_OPTIONS[sort]) {
      return res.status(400).json({ message: `Invalid sort. Use: ${Object.keys(SORT_OPTIONS).join(', ')}` });
    }

    const filter = {};
    if (search && search.trim()) filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const [tasks, total] = await Promise.all([
      populateUsers(Task.find(filter).sort(SORT_OPTIONS[sort]).skip((page - 1) * limit).limit(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({ tasks, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats  -> numbers for the dashboard cards
const getStats = async (req, res, next) => {
  try {
    const grouped = await Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]));

    const pending = counts.pending || 0;
    const inProgress = counts['in-progress'] || 0;
    const completed = counts.completed || 0;

    res.json({ total: pending + inProgress + completed, pending, inProgress, completed });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await populateUsers(Task.findById(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    if (!title || !dueDate || !assignedTo) {
      return res.status(400).json({ message: 'Title, due date and assigned user are required' });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(400).json({ message: 'Assigned user does not exist' });

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json({ task: await populateUsers(Task.findById(task._id)) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const allowed =
      isAdmin(req.user) ||
      idOf(task.createdBy) === String(req.user._id) ||
      idOf(task.assignedTo) === String(req.user._id);
    if (!allowed) {
      return res.status(403).json({ message: 'You can only edit tasks you created or that are assigned to you' });
    }

    if (req.body.assignedTo && req.body.assignedTo !== idOf(task.assignedTo)) {
      const assignee = await User.findById(req.body.assignedTo);
      if (!assignee) return res.status(400).json({ message: 'Assigned user does not exist' });
    }

    // only copy over the fields we actually allow to change
    ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo'].forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save(); // runs the schema validators
    res.json({ task: await populateUsers(Task.findById(task._id)) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!isAdmin(req.user) && idOf(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the creator or an admin can delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getStats, getTask, createTask, updateTask, deleteTask };
