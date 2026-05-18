import express from 'express';
import User from '../models/user.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);


/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees fetched successfully
 *       403:
 *         description: Access denied
 */

// GET /api/employees — admin, hr, manager can view all employees
router.get('/', restrictTo('admin', 'hr', 'manager'), async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const data = employees.map(emp => ({
      _id:         emp._id,
      name:        emp.name,
      email:       emp.email,
      designation: emp.designation,
      department:  emp.department,
      taskStats:   emp.taskStats,
      tasks:       emp.tasks,
    }));
    res.json({ employees: data });
  } catch (err) { next(err); }
});


/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee fetched successfully
 *       404:
 *         description: Employee not found
 */
// GET /api/employees/:id — detail view
router.get('/:id', restrictTo('admin', 'hr', 'manager'), async (req, res, next) => {
  try {
    const emp = await User.findById(req.params.id);
    if (!emp || emp.role !== 'employee')
      return res.status(404).json({ error: 'Employee not found' });
    res.json({ employee: { ...emp.toObject(), taskStats: emp.taskStats } });
  } catch (err) { next(err); }
});

export default router;
