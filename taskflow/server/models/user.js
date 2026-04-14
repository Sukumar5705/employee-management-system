import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  date:        { type: String, required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status:      { type: String, enum: ['new', 'active', 'completed', 'failed'], default: 'new' },
  completedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, required: true, minlength: 6, select: false },
    role:        { type: String, enum: ['admin', 'hr', 'manager', 'employee'], default: 'employee' },
    designation: { type: String, default: '' },
    department:  { type: String, default: '' },
    avatar:      { type: String, default: '' },
    tasks:       [taskSchema],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Virtual: task stats
userSchema.virtual('taskStats').get(function () {
  const tasks = this.tasks || [];
  const completed = tasks.filter(t => t.status === 'completed');
  const failed    = tasks.filter(t => t.status === 'failed');
  const total     = tasks.length;

  // Completion rate
  const completionRate = total > 0
    ? Math.round((completed.length / total) * 100)
    : 0;

  // Average completion time in days (for completed tasks with completedAt)
  const completionTimes = completed
    .filter(t => t.completedAt && t.createdAt)
    .map(t => (new Date(t.completedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24));
  const avgCompletionDays = completionTimes.length > 0
    ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
    : 0;

  // Performance score: weighted formula
  const score = total > 0
    ? Math.round(
        (completed.length * 10 - failed.length * 4) / total * 10
      )
    : 0;

  return {
    total,
    newTask:         tasks.filter(t => t.status === 'new').length,
    active:          tasks.filter(t => t.status === 'active').length,
    completed:       completed.length,
    failed:          failed.length,
    completionRate,
    avgCompletionDays,
    performanceScore: Math.max(0, Math.min(100, score)),
  };
});

userSchema.set('toJSON',   { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', userSchema);