import express from 'express';
import User from '../models/user.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// GET /api/tasks/my — employee's own tasks + stats
router.get('/my', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ tasks: user.tasks, stats: user.taskStats });
  } catch (err) { next(err); }
});

// PATCH /api/tasks/:taskId/status — employee updates own task
router.patch('/:taskId/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['active', 'completed', 'failed'];
    if (!allowed.includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const user = await User.findById(req.user._id);
    const task = user.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status    = status;
    task.updatedAt = Date.now();
    if (status === 'completed') task.completedAt = Date.now();

    await user.save();
    res.json({ task, stats: user.taskStats });
  } catch (err) { next(err); }
});

// POST /api/tasks — admin/manager creates task for employee
router.post('/', restrictTo('admin', 'manager'), async (req, res, next) => {
  try {
    const { employeeId, title, description, category, date, priority = 'medium' } = req.body;
    if (!employeeId || !title || !description || !category || !date)
      return res.status(400).json({ error: 'All fields required' });

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee')
      return res.status(404).json({ error: 'Employee not found' });

    employee.tasks.push({ title, description, category, date, priority, status: 'new' });
    await employee.save();

    res.status(201).json({ message: 'Task created', stats: employee.taskStats });
  } catch (err) { next(err); }
});

// DELETE /api/tasks/:employeeId/:taskId — admin/manager deletes task
router.delete('/:employeeId/:taskId', restrictTo('admin', 'manager'), async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    employee.tasks.pull({ _id: req.params.taskId });
    await employee.save();

    res.json({ message: 'Task deleted', stats: employee.taskStats });
  } catch (err) { next(err); }
});

export default router;