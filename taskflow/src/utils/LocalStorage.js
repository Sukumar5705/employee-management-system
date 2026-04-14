const employees = [
  {
    id: 1, name: "Sukumar", email: "employee1@example.com", password: "123456",
    designation: "Sales Executive",
    taskStats: { active: 1, completed: 1, failed: 1, newTask: 1 },
    tasks: [
      { taskNumber: 1, status: 'active',    title: "Prepare monthly report",  description: "Compile sales and performance data for July.", date: "2025-07-28", category: "Reporting" },
      { taskNumber: 2, status: 'completed', title: "Update team roster",      description: "Ensure all employee records are up to date.",  date: "2025-07-15", category: "Administration" },
      { taskNumber: 3, status: 'failed',    title: "Client follow-up",        description: "Reach out to pending client for feedback.",     date: "2025-07-20", category: "Customer Service" },
      { taskNumber: 4, status: 'new',       title: "Q3 Planning Doc",         description: "Draft quarterly planning documentation.",       date: "2025-07-30", category: "Planning" },
    ],
  },
  {
    id: 2, name: "Harshith", email: "employee2@example.com", password: "123456",
    designation: "Full Stack Developer",
    taskStats: { active: 1, completed: 2, failed: 1, newTask: 1 },
    tasks: [
      { taskNumber: 5, status: 'active',    title: "Deploy new feature",      description: "Push feature update to production environment.", date: "2025-07-27", category: "Development" },
      { taskNumber: 6, status: 'completed', title: "Fix login bug",           description: "Resolve issue with user authentication flow.",   date: "2025-07-22", category: "Bug Fixing" },
      { taskNumber: 7, status: 'completed', title: "Refactor codebase",       description: "Optimize performance and readability.",          date: "2025-07-18", category: "Maintenance" },
      { taskNumber: 8, status: 'failed',    title: "Integrate payment API",   description: "Connect payment gateway for transactions.",      date: "2025-07-25", category: "Integration" },
      { taskNumber: 9, status: 'new',       title: "Write unit tests",        description: "Add coverage for core modules.",                 date: "2025-07-31", category: "QA" },
    ],
  },
  {
    id: 3, name: "Muqsith", email: "employee3@example.com", password: "123456",
    designation: "UI/UX Designer",
    taskStats: { active: 1, completed: 1, failed: 1, newTask: 1 },
    tasks: [
      { taskNumber: 10, status: 'active',    title: "Design homepage",         description: "Create a new layout using Tailwind CSS.",         date: "2025-07-28", category: "Design" },
      { taskNumber: 11, status: 'completed', title: "Review UI feedback",      description: "Analyze user suggestions on design elements.",    date: "2025-07-24", category: "UX Research" },
      { taskNumber: 12, status: 'failed',    title: "Update brand assets",     description: "Deliver updated logos and icons.",               date: "2025-07-22", category: "Branding" },
      { taskNumber: 13, status: 'new',       title: "Prototype mobile app",    description: "Create Figma prototype for mobile screens.",     date: "2025-07-31", category: "Design" },
    ],
  },
  {
    id: 4, name: "Anjali", email: "employee4@example.com", password: "123456",
    designation: "HR Manager",
    taskStats: { active: 1, completed: 1, failed: 1, newTask: 1 },
    tasks: [
      { taskNumber: 14, status: 'active',    title: "Prepare training module", description: "Create onboarding content for new hires.",         date: "2025-07-26", category: "HR" },
      { taskNumber: 15, status: 'completed', title: "Conduct team survey",     description: "Gather employee feedback on work culture.",       date: "2025-07-21", category: "Employee Engagement" },
      { taskNumber: 16, status: 'failed',    title: "Schedule appraisals",     description: "Arrange reviews for each team member.",          date: "2025-07-20", category: "Performance Review" },
      { taskNumber: 17, status: 'new',       title: "Policy compliance check", description: "Audit internal processes for regulation adherence.", date: "2025-07-29", category: "Compliance" },
    ],
  },
  {
    id: 5, name: "Pranathi", email: "employee5@example.com", password: "123456",
    designation: "DevOps Engineer",
    taskStats: { active: 1, completed: 1, failed: 1, newTask: 1 },
    tasks: [
      { taskNumber: 18, status: 'completed', title: "Optimize DB queries",     description: "Improve query efficiency for reporting tools.",    date: "2025-07-25", category: "Database" },
      { taskNumber: 19, status: 'failed',    title: "Backup recovery test",    description: "Simulate disaster recovery scenarios.",           date: "2025-07-23", category: "IT Operations" },
      { taskNumber: 20, status: 'active',    title: "Server security audit",   description: "Scan for vulnerabilities and patch them.",        date: "2025-07-28", category: "Security" },
      { taskNumber: 21, status: 'new',       title: "CI/CD pipeline setup",    description: "Automate build and deployment pipeline.",        date: "2025-07-31", category: "DevOps" },
    ],
  },
];

const admin = { id: 101, email: "admin@example.com", password: "123456" };

export const setLocalStorage = () => {
  if (!localStorage.getItem('employees')) localStorage.setItem('employees', JSON.stringify(employees));
  if (!localStorage.getItem('admin'))     localStorage.setItem('admin',     JSON.stringify(admin));
};

export const getLocalStorage = () => ({
  employees: JSON.parse(localStorage.getItem('employees')),
  admin:     JSON.parse(localStorage.getItem('admin')),
});

export const recomputeStats = (tasks) => ({
  newTask:   tasks.filter(t => t.status === 'new').length,
  active:    tasks.filter(t => t.status === 'active').length,
  completed: tasks.filter(t => t.status === 'completed').length,
  failed:    tasks.filter(t => t.status === 'failed').length,
});