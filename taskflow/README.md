# TaskFlow — Team Task Management System

A full-stack task management app built with React + Vite (frontend) and Express + MongoDB (backend).

---

## 🗂️ Project Structure

```
taskflow/
├── server/                  ← Express + MongoDB API
│   ├── index.js
│   ├── models/User.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       ├── tasks.js
│       └── employees.js
├── src/                     ← React frontend
│   ├── components/
│   │   ├── auth/Login.jsx
│   │   ├── others/          ← Header, TaskList, TaskListNumber, task cards, CreateTask
│   │   └── AllTask.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   └── utils/
│       ├── api.js           ← Axios instance for backend
│       └── LocalStorage.js  ← Offline fallback
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Quick Start (Frontend only — localStorage mode)

```bash
npm install
npm run dev
```

Login credentials:
- **Admin:** admin@example.com / 123456
- **Employee:** employee1@example.com / 123456 (also 2–5)

---

## 🗄️ Full Stack Setup (with MongoDB)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Seed the database

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

### 3. Frontend (swap to API mode)

In `src/context/AuthProvider.jsx`, replace the localStorage `login` function
with an API call using `authAPI.login(email, password)` from `src/utils/api.js`.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login → returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/seed` | Dev | Seed database |
| GET | `/api/tasks/my` | Employee | Own tasks + stats |
| PATCH | `/api/tasks/:id/status` | Employee | Update task status |
| POST | `/api/tasks` | Admin | Assign task to employee |
| DELETE | `/api/tasks/:eid/:tid` | Admin | Delete task |
| GET | `/api/employees` | Admin | All employees + stats |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0f` |
| Surface | `#13131a` |
| Accent | `#6c63ff` (purple) |
| Accent2 | `#00e5be` (teal) |
| Font | DM Sans |

---

## ✅ Features

- **Admin:** Create tasks, assign to employees, view team overview with live stats and progress bars
- **Employee:** Accept tasks, mark done/failed, filter by status, live stat cards
- **Auth:** localStorage session with JWT-ready backend
- **Security:** Helmet, CORS, rate limiting, bcrypt, JWT
- **Live updates:** CustomEvent `tasksUpdated` keeps all components in sync