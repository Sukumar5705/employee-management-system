import express from 'express';
import User from '../models/user.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, restrictTo('admin', 'hr', 'manager'));

// GET /api/performance — full performance data for all employees
router.get('/', async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' });

    const report = employees.map(emp => {
      const stats = emp.taskStats;
      const tasks = emp.tasks || [];

      // Category breakdown
      const byCategory = tasks.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = { total: 0, completed: 0, failed: 0 };
        acc[t.category].total++;
        if (t.status === 'completed') acc[t.category].completed++;
        if (t.status === 'failed')    acc[t.category].failed++;
        return acc;
      }, {});

      // Priority breakdown
      const byPriority = {
        high:   { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        low:    { total: 0, completed: 0 },
      };
      tasks.forEach(t => {
        const p = t.priority || 'medium';
        if (byPriority[p]) {
          byPriority[p].total++;
          if (t.status === 'completed') byPriority[p].completed++;
        }
      });

      // Recent activity (last 5 tasks by updatedAt)
      const recentActivity = [...tasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(t => ({
          title:  t.title,
          status: t.status,
          category: t.category,
          date:   t.updatedAt,
        }));

      // Performance grade
      const score = stats.performanceScore;
      const grade =
        score >= 85 ? 'A' :
        score >= 70 ? 'B' :
        score >= 50 ? 'C' :
        score >= 30 ? 'D' : 'F';

      return {
        _id:              emp._id,
        name:             emp.name,
        email:            emp.email,
        designation:      emp.designation,
        department:       emp.department,
        stats,
        byCategory,
        byPriority,
        recentActivity,
        grade,
      };
    });

    // Company-wide summary
    const summary = {
      totalEmployees:    employees.length,
      totalTasks:        report.reduce((a, e) => a + e.stats.total, 0),
      totalCompleted:    report.reduce((a, e) => a + e.stats.completed, 0),
      totalFailed:       report.reduce((a, e) => a + e.stats.failed, 0),
      totalActive:       report.reduce((a, e) => a + e.stats.active, 0),
      avgCompletionRate: report.length
        ? Math.round(report.reduce((a, e) => a + e.stats.completionRate, 0) / report.length)
        : 0,
      topPerformer: report.sort((a, b) => b.stats.performanceScore - a.stats.performanceScore)[0]?.name || '',
    };

    res.json({ summary, employees: report });
  } catch (err) { next(err); }
});

// GET /api/performance/:id — single employee deep performance
router.get('/:id', async (req, res, next) => {
  try {
    const emp = await User.findById(req.params.id);
    if (!emp || emp.role !== 'employee')
      return res.status(404).json({ error: 'Employee not found' });

    const tasks = emp.tasks || [];
    const stats = emp.taskStats;

    // Monthly trend (last 6 months)
    const now = new Date();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const monthTasks = tasks.filter(t => {
        const td = new Date(t.createdAt);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });
      monthlyTrend.push({
        month:     monthName,
        total:     monthTasks.length,
        completed: monthTasks.filter(t => t.status === 'completed').length,
        failed:    monthTasks.filter(t => t.status === 'failed').length,
      });
    }

    res.json({
      employee: {
        _id:         emp._id,
        name:        emp.name,
        email:       emp.email,
        designation: emp.designation,
        department:  emp.department,
      },
      stats,
      monthlyTrend,
      tasks: tasks.map(t => ({
        _id:      t._id,
        title:    t.title,
        category: t.category,
        priority: t.priority,
        status:   t.status,
        date:     t.date,
        createdAt:   t.createdAt,
        completedAt: t.completedAt,
      })),
    });
  } catch (err) { next(err); }
});

export default router;