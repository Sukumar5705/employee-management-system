# Employee Task Management System

## Overview

The **Employee Task Management System** is a modern, web-based application designed to streamline task assignment, tracking, and management within an organization. Built using **React** and **Tailwind CSS**, this project provides an intuitive interface for administrators and employees to manage tasks efficiently. Administrators can create and assign tasks, while employees can view, accept, and update the status of their tasks. The system leverages **localStorage** for persistent data storage, ensuring seamless task and user management without a backend server.

This application is ideal for small to medium-sized teams looking to organize workflows, monitor task progress, and maintain accountability. Its modular architecture and use of modern web technologies make it easy to extend and customize for specific organizational needs.

## Importance of Employee Task Management

Effective task management is critical for organizational success. This system addresses key challenges in workforce management by:

- **Enhancing Productivity**: Provides a clear overview of tasks, enabling employees to focus on priorities and meet deadlines.
- **Improving Accountability**: Tracks task statuses (new, active, completed, failed), ensuring transparency and responsibility.
- **Streamlining Communication**: Facilitates task assignment and status updates, reducing miscommunication between administrators and employees.
- **Data-Driven Insights**: Offers task statistics for performance evaluation and resource allocation.
- **Scalability**: Modular design allows for future enhancements, such as integration with a backend API or additional features like notifications.

By centralizing task management, the system fosters collaboration, optimizes workflows, and supports organizational growth.

## Features

- **User Authentication**: Secure login for administrators and employees with role-based access control.
- **Task Creation**: Admins can create tasks with details like title, description, category, date, and assignee.
- **Task Management**: Employees can accept tasks, mark them as completed or failed, and view their task history.
- **Task Statistics**: Displays task counts (new, active, completed, failed) for individual employees and across the organization.
- **Responsive UI**: Built with Tailwind CSS for a professional, mobile-friendly interface.
- **Real-Time Updates**: Uses custom events to synchronize task data across components.
- **Local Storage**: Persists employee and task data using browser `localStorage`.

## Project Structure

The project is organized into modular components, contexts, and utilities for maintainability and scalability:

```
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.jsx           # Login form for user authentication
│   │   ├── others/
│   │   │   ├── Header.jsx          # Displays user info and logout button
│   │   │   ├── TaskList.jsx        # Displays tasks in different states
│   │   │   ├── TaskListNumber.jsx  # Shows task statistics for an employee
│   │   │   ├── NewTaskList.jsx     # Displays new tasks with accept option
│   │   │   ├── AcceptTasklist.jsx  # Displays active tasks with status update options
│   │   │   ├── CompleteTaskList.jsx # Displays completed tasks
│   │   │   ├── FailedTaskList.jsx  # Displays failed tasks
│   │   │   └── CreateTask.jsx      # Form for creating new tasks
│   │   └── AllTask.jsx             # Table summarizing tasks for all employees
│   ├── context/
│   │   ├── AuthContext.jsx         # Context for authentication state
│   │   └── AuthProvider.jsx        # Provides auth state and methods
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx      # Admin dashboard (placeholder)
│   │   └── EmployeeDashboard.jsx   # Employee dashboard with task views
│   ├── utils/
│   │   └── LocalStorage.jsx        # Utility for managing localStorage data
│   ├── App.jsx                     # Main app component with routing logic
│   ├── main.jsx                    # Entry point for React rendering
│   ├── App.css                     # Global styles
│   ├── index.css                   # Tailwind CSS imports
│   └── style.css                   # Custom styles for task components
```

## Technologies Used

- **React**: Frontend library for building modular, component-based UI.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern styling.
- **React Context API**: Manages authentication and user state across components.
- **LocalStorage**: Stores employee and task data persistently in the browser.
- **JavaScript (ES6+)**: Modern JavaScript for dynamic functionality.
- **Vite**: Build tool for fast development and production builds (assumed, based on modern React projects).

## Installation and Setup

Follow these steps to set up and run the project locally:

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A modern web browser (e.g., Chrome, Firefox)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/employee-task-management.git
   cd employee-task-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

5. **Default Credentials**:
   - **Admin**: Email: `admin@example.com`, Password: `123`
   - **Employees**: Email: `employee1@example.com` to `employee5@example.com`, Password: `123`

## Usage

### Admin Workflow
1. Log in with admin credentials (`admin@example.com`, `123`).
2. Access the Admin Dashboard (currently a placeholder; extend with task creation and employee management features).
3. Create tasks using the `CreateTask` component, specifying the title, description, category, date, and assignee.
4. View task statistics for all employees in the `AllTask` component.
5. Log out when done.

### Employee Workflow
1. Log in with employee credentials (e.g., `employee1@example.com`, `123`).
2. View assigned tasks in the `TaskList` component, categorized as New, Active, Completed, or Failed.
3. Accept new tasks, mark active tasks as completed or failed, and review task history.
4. Monitor personal task statistics in the `TaskListNumber` component.
5. Log out when done.

## Sample Data

The `LocalStorage.jsx` file initializes `localStorage` with sample data, including:

- **Admin**: `{ id: 101, email: "admin@example.com", password: "123" }`
- **Employees**: 5 employees with IDs, names, emails, passwords, task statistics, and tasks (e.g., Sukumar, Harshith, Muqsith, etc.).
- **Tasks**: Each employee has 3–4 tasks with varying statuses (new, active, completed, failed) and categories (e.g., Reporting, Development, HR).

## Extending the Project

To enhance the application, consider the following:

- **Backend Integration**: Replace `localStorage` with a REST API or database (e.g., Firebase, MongoDB) for scalability.
- **Admin Dashboard**: Add features like employee management, task analytics, and bulk task assignment.
- **Input Validation**: Implement form validation in `CreateTask` and `Login` for better UX and security.
- **Notifications**: Add alerts or emails for task updates using a notification service.
- **Testing**: Introduce unit tests with Jest and React Testing Library to ensure reliability.

## Limitations

- **LocalStorage Dependency**: Data is stored in the browser, limiting scalability and persistence across devices.
- **Security**: Passwords are stored in plain text in `localStorage`. For production, use secure authentication (e.g., JWT, OAuth).
- **Admin Dashboard**: Currently a placeholder; requires additional development for full functionality.
- **Error Handling**: Limited feedback for `localStorage` errors; consider adding user notifications.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and ensure code adheres to ESLint and Prettier standards.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please open an issue on GitHub or contact the maintainer at [erugadindlasukumar5@example.com].
