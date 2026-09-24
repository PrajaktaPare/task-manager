const mongoose = require('mongoose');

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot be longer than 1000 characters'],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: 'Priority must be low, medium or high' },
      default: 'medium',
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Status must be pending, in-progress or completed' },
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign the task to a user'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ title: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
module.exports.STATUSES = STATUSES;
module.exports.PRIORITIES = PRIORITIES;
