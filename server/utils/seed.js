// Run with: npm run seed
// Creates the two test accounts and a few sample tasks.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected, seeding...');

  await Task.deleteMany({});
  await User.deleteMany({ email: { $in: ['testuser@example.com', 'admin@example.com'] } });

  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Test@1234',
    role: 'user',
  });
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@1234',
    role: 'admin',
  });

  await Task.insertMany([
    { title: 'Set up project repository', description: 'Create the GitHub repo and add a README.', priority: 'high', status: 'completed', dueDate: daysFromNow(-2), assignedTo: user._id, createdBy: admin._id },
    { title: 'Design database schema', description: 'Users and tasks collections with references.', priority: 'high', status: 'in-progress', dueDate: daysFromNow(1), assignedTo: user._id, createdBy: admin._id },
    { title: 'Build login page', description: 'Form validation and remember me checkbox.', priority: 'medium', status: 'in-progress', dueDate: daysFromNow(3), assignedTo: admin._id, createdBy: admin._id },
    { title: 'Write API documentation', description: 'Document every endpoint with sample requests.', priority: 'low', status: 'pending', dueDate: daysFromNow(6), assignedTo: user._id, createdBy: user._id },
    { title: 'Deploy backend to Render', description: 'Add env variables and check the health route.', priority: 'medium', status: 'pending', dueDate: daysFromNow(7), assignedTo: admin._id, createdBy: admin._id },
    { title: 'Add dark mode', description: 'Theme toggle that remembers the choice.', priority: 'low', status: 'pending', dueDate: daysFromNow(9), assignedTo: user._id, createdBy: user._id },
  ]);

  console.log('Done. Accounts: testuser@example.com / Test@1234, admin@example.com / Admin@1234');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
