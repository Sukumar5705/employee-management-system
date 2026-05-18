# TaskFlow API Platform

Production-grade full-stack task management platform built with React, Node.js, Express, and MongoDB.

TaskFlow provides secure authentication, role-based access control, employee task management, and performance analytics through scalable REST APIs and an interactive frontend dashboard.

---

# 🚀 Live Demo

## Frontend

[https://employee-management-system-fkrh.vercel.app](https://employee-management-system-fkrh.vercel.app)

## Backend API

[https://employee-management-system-4-ji3v.onrender.com](https://employee-management-system-4-ji3v.onrender.com)

## Swagger API Documentation

[https://employee-management-system-4-ji3v.onrender.com/api/docs](https://employee-management-system-4-ji3v.onrender.com/api/docs)

---

# 📌 Features

## Authentication & Security

* JWT Authentication
* Password hashing using bcrypt
* Role-Based Access Control (RBAC)
* Protected API routes
* Rate limiting for API protection
* Helmet security middleware
* CORS protection
* Environment variable configuration

## Task Management

* Create and assign tasks
* Update task status
* Delete tasks
* Employee-specific task dashboard
* Priority-based task management
* Real-time task statistics

## Employee Management

* View all employees
* Employee detail APIs
* Department & designation support
* Employee analytics tracking

## Performance Analytics

* Organization-wide analytics
* Employee performance scoring
* Completion rate tracking
* Monthly productivity trends
* Category & priority breakdowns

## API Architecture

* RESTful API design
* API versioning (`/api/v1`)
* Modular route architecture
* Centralized error handling
* Middleware-based authorization
* Swagger API documentation

## Frontend

* Responsive dashboard UI
* Admin dashboard
* Employee dashboard
* Axios API integration
* JWT session persistence
* Protected routes

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication & Security

* JWT (jsonwebtoken)
* bcryptjs
* Helmet
* express-rate-limit
* CORS

## API Documentation

* Swagger UI
* swagger-jsdoc
* swagger-ui-express

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```bash
TaskFlow/
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── employees.js
│   │   └── performance.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   └── user.js
│   │
│   ├── swagger.js
│   └── index.js
│
├── taskflow/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── Dashboard/
│   │   └── utils/
│   │       └── api.js
│   │
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

# 🔐 Authentication & Authorization

TaskFlow uses JWT-based authentication with role-based access control.

## Supported Roles

| Role     | Permissions                 |
| -------- | --------------------------- |
| Admin    | Full access to all APIs     |
| HR       | Employee & analytics access |
| Manager  | Task assignment & analytics |
| Employee | Personal task management    |

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/v1/auth/login` | Login user       |
| GET    | `/api/v1/auth/me`    | Get current user |

## Tasks

| Method | Endpoint                            | Description        |
| ------ | ----------------------------------- | ------------------ |
| GET    | `/api/v1/tasks/my`                  | Get employee tasks |
| PATCH  | `/api/v1/tasks/:taskId/status`      | Update task status |
| POST   | `/api/v1/tasks`                     | Create task        |
| DELETE | `/api/v1/tasks/:employeeId/:taskId` | Delete task        |

## Employees

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/v1/employees`     | Get all employees  |
| GET    | `/api/v1/employees/:id` | Get employee by ID |

## Performance

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/v1/performance`     | Organization analytics |
| GET    | `/api/v1/performance/:id` | Employee analytics     |

## Health Check

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/v1/health` | API health status |

---

# 📖 Swagger API Documentation

Interactive API documentation is available at:

```bash
https://employee-management-system-4-ji3v.onrender.com/api/docs
```

Features:

* JWT authorization support
* Interactive API testing
* Request/response schemas
* Organized endpoint grouping
* Production-ready API documentation

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://employee-management-system-fkrh.vercel.app
NODE_ENV=development
```

## Frontend `.env`

```env
VITE_API_URL=https://employee-management-system-4-ji3v.onrender.com/api/v1
```

---

# 💻 Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd TaskFlow
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file and add environment variables.

Start backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd taskflow
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 📊 Performance Analytics

TaskFlow includes advanced employee performance tracking:

* Completion rate analysis
* Performance scoring
* Category-wise productivity
* Priority distribution tracking
* Monthly trend analytics
* Organization-wide reporting

---

# 🛡️ Security Features

* JWT-based authentication
* bcrypt password hashing
* Role-based authorization
* Secure HTTP headers using Helmet
* API rate limiting
* Environment variable protection
* Protected API middleware
* Request validation
* MongoDB schema validation

---

# 🧱 Scalable Architecture

TaskFlow follows a modular backend architecture designed for scalability.

## Scalability Features

* API versioning (`/api/v1`)
* Modular route separation
* Centralized middleware system
* Reusable authentication layer
* Structured folder architecture
* Service-ready backend organization
* Production-ready deployment structure

## Future Improvements

* Redis caching
* Docker containerization
* CI/CD pipelines
* WebSocket real-time updates
* Microservice architecture
* Kubernetes deployment

---

# 📷 Screenshots

## Login Page

*Add screenshot here*

## Admin Dashboard

*Add screenshot here*

## Employee Dashboard

*Add screenshot here*

## Swagger Documentation

*Add screenshot here*

---

# 🧪 Testing

TaskFlow APIs can be tested using:

* Swagger UI
* Browser-based API execution
* JWT Authorization support
* Protected route testing

---

# 🌐 Deployment

## Frontend Deployment

* Platform: Vercel
* URL: [https://employee-management-system-fkrh.vercel.app](https://employee-management-system-fkrh.vercel.app)

## Backend Deployment

* Platform: Render
* URL: [https://employee-management-system-4-ji3v.onrender.com](https://employee-management-system-4-ji3v.onrender.com)

---

# 👨‍💻 Author

Sukumar Erugadindla

* Full Stack Developer
* MERN Stack Developer
* Backend & API Development Enthusiast

---

# 📄 License

This project was developed as part of a backend internship assignment and learning initiative.
