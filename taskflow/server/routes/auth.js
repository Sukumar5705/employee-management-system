import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  /**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user._id);

    // Build response object with taskStats
    const userObj = user.toObject();

    res.json({
      token,
      user: {
        _id:         userObj._id,
        name:        userObj.name,
        email:       userObj.email,
        role:        userObj.role,
        designation: userObj.designation,
        department:  userObj.department,
        tasks:       userObj.tasks,
        taskStats:   user.taskStats,
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Unauthorized
 */

// GET /api/auth/me — returns fresh data from DB
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const userObj = user.toObject();
    res.json({
      user: {
        _id:         userObj._id,
        name:        userObj.name,
        email:       userObj.email,
        role:        userObj.role,
        designation: userObj.designation,
        department:  userObj.department,
        tasks:       userObj.tasks,
        taskStats:   user.taskStats,
      }
    });
  } catch (err) { next(err); }
});

// POST /api/auth/seed — dev only
router.post('/seed', async (req, res, next) => {
  if (process.env.NODE_ENV === 'production')
    return res.status(403).json({ error: 'Not allowed in production' });
  try {
    await User.deleteMany({});

    await User.create({
      name: 'Admin', email: 'admin@example.com',
      password: '123456', role: 'admin', designation: 'System Administrator',
    });

    await User.create({
      name: 'HR', email: 'hr@example.com',
      password: '123456', role: 'hr', designation: 'HR Manager', department: 'Human Resources',
    });

    await User.create({
      name: 'Manager', email: 'manager@example.com',
      password: '123456', role: 'manager', designation: 'Engineering Manager', department: 'Engineering',
    });

    await User.create([
      {
        name: 'Sukumar', email: 'employee1@example.com', password: '123456',
        role: 'employee', designation: 'Sales Executive', department: 'Sales',
        tasks: [
          { title: 'Prepare monthly report',  description: 'Compile sales data for July.',              date: '2025-07-28', category: 'Reporting',         priority: 'high',   status: 'completed', completedAt: new Date('2025-07-27') },
          { title: 'Update team roster',       description: 'Ensure all employee records are updated.',  date: '2025-07-15', category: 'Administration',     priority: 'low',    status: 'completed', completedAt: new Date('2025-07-14') },
          { title: 'Client follow-up',         description: 'Reach out to pending client for feedback.', date: '2025-07-20', category: 'Customer Service',   priority: 'high',   status: 'failed' },
          { title: 'Q3 Planning Doc',          description: 'Draft quarterly planning documentation.',   date: '2025-07-30', category: 'Planning',           priority: 'medium', status: 'new' },
          { title: 'Quarterly review prep',    description: 'Prepare slides for Q3 review meeting.',    date: '2025-08-05', category: 'Reporting',           priority: 'medium', status: 'active' },
        ],
      },
      {
        name: 'Harshith', email: 'employee2@example.com', password: '123456',
        role: 'employee', designation: 'Full Stack Developer', department: 'Engineering',
        tasks: [
          { title: 'Deploy new feature',       description: 'Push feature update to production.',        date: '2025-07-27', category: 'Development',        priority: 'high',   status: 'completed', completedAt: new Date('2025-07-26') },
          { title: 'Fix login bug',            description: 'Resolve user authentication flow issue.',   date: '2025-07-22', category: 'Bug Fixing',          priority: 'high',   status: 'completed', completedAt: new Date('2025-07-21') },
          { title: 'Refactor codebase',        description: 'Optimize performance and readability.',     date: '2025-07-18', category: 'Maintenance',         priority: 'medium', status: 'completed', completedAt: new Date('2025-07-18') },
          { title: 'Integrate payment API',    description: 'Connect payment gateway for transactions.', date: '2025-07-25', category: 'Integration',         priority: 'high',   status: 'failed' },
          { title: 'Write unit tests',         description: 'Add coverage for core modules.',            date: '2025-07-31', category: 'QA',                  priority: 'medium', status: 'active' },
          { title: 'Code review sprint 4',     description: 'Review PRs for sprint 4 tasks.',           date: '2025-08-02', category: 'Development',          priority: 'low',    status: 'new' },
        ],
      },
      {
        name: 'Muqsith', email: 'employee3@example.com', password: '123456',
        role: 'employee', designation: 'UI/UX Designer', department: 'Design',
        tasks: [
          { title: 'Design homepage',          description: 'Create a new layout using Tailwind CSS.',   date: '2025-07-28', category: 'Design',              priority: 'high',   status: 'active' },
          { title: 'Review UI feedback',       description: 'Analyze user suggestions on design.',      date: '2025-07-24', category: 'UX Research',          priority: 'medium', status: 'completed', completedAt: new Date('2025-07-23') },
          { title: 'Update brand assets',      description: 'Deliver updated logos and icons.',         date: '2025-07-22', category: 'Branding',             priority: 'medium', status: 'failed' },
          { title: 'Prototype mobile app',     description: 'Create Figma prototype for mobile.',       date: '2025-07-31', category: 'Design',               priority: 'high',   status: 'new' },
        ],
      },
      {
        name: 'Anjali', email: 'employee4@example.com', password: '123456',
        role: 'employee', designation: 'HR Executive', department: 'Human Resources',
        tasks: [
          { title: 'Prepare training module',  description: 'Create onboarding content for new hires.', date: '2025-07-26', category: 'HR',                  priority: 'high',   status: 'completed', completedAt: new Date('2025-07-25') },
          { title: 'Conduct team survey',      description: 'Gather employee feedback on work culture.', date: '2025-07-21', category: 'Employee Engagement', priority: 'medium', status: 'completed', completedAt: new Date('2025-07-20') },
          { title: 'Schedule appraisals',      description: 'Arrange reviews for each team member.',    date: '2025-07-20', category: 'Performance Review',   priority: 'high',   status: 'failed' },
          { title: 'Policy compliance check',  description: 'Audit internal processes.',                date: '2025-07-29', category: 'Compliance',           priority: 'medium', status: 'active' },
          { title: 'Hiring pipeline update',   description: 'Update candidate tracking sheet.',        date: '2025-08-01', category: 'Recruitment',           priority: 'low',    status: 'new' },
        ],
      },
      {
        name: 'Pranathi', email: 'employee5@example.com', password: '123456',
        role: 'employee', designation: 'DevOps Engineer', department: 'Engineering',
        tasks: [
          { title: 'Optimize DB queries',      description: 'Improve query efficiency for reports.',    date: '2025-07-25', category: 'Database',             priority: 'high',   status: 'completed', completedAt: new Date('2025-07-24') },
          { title: 'Backup recovery test',     description: 'Simulate disaster recovery scenarios.',   date: '2025-07-23', category: 'IT Operations',         priority: 'high',   status: 'failed' },
          { title: 'Server security audit',    description: 'Scan for vulnerabilities and patch.',     date: '2025-07-28', category: 'Security',              priority: 'high',   status: 'completed', completedAt: new Date('2025-07-27') },
          { title: 'CI/CD pipeline setup',     description: 'Automate build and deployment.',          date: '2025-07-31', category: 'DevOps',                priority: 'medium', status: 'active' },
          { title: 'K8s cluster upgrade',      description: 'Upgrade Kubernetes to latest LTS.',       date: '2025-08-03', category: 'Infrastructure',        priority: 'high',   status: 'new' },
        ],
      },
    ]);

    const allUsers = await User.find({}).select('email role');
    res.json({ message: 'Database seeded ✅', users: allUsers.map(u => `${u.email} (${u.role})`) });
  } catch (err) {
    next(err);
  }
});

export default router;
