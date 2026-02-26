# Task Ledger - Project Walkthrough & User Guide

Welcome to the **Task Ledger**! This guide will walk you through the core features, how to navigate the application, and the mechanics driving the system from a user and technical perspective.

---

## 1. Authentication Flow

### The Login Experience
When you boot up the frontend and navigate to `http://localhost:5173/login`, you are greeted with a highly modern, glassmorphism-styled login card. 
- **Feature**: Hover your mouse over the card to experience the **3D Tilt Effect**. The card dynamically reacts to your mouse pointer to give a depth-of-field perspective using CSS transforms.
- **Action**: Enter your credentials or click "Create an account" if you are a new user. 

### Password Management
- **Forgot Password?**: If you forget your password, click the "Forgot password?" link. It invokes a secure backend API that natively verifies your email and simulates sending a reset token.
- **Reset Password**: Utilize the token to lock in a new hashed password.
- **Change Password**: From within the dashboard, users can safely update their existing credentials.

---

## 2. Navigating the Task Ledger Dashboard

Once authenticated, the frontend React Router redirects you to the main layout. The application utilizes a sidebar (left-aligned) for core modules and a sticky **Top Navigation Bar** for Contextual user actions (Profile & Security) without forcing page reloads (SPA functionality).

### 📊 The Dashboard Module
The entry point of the protected route provides high-level analytics.
- **Features**: Visualizations powered by `Recharts` analyze backend-provided Monthly Summaries mapping Income vs. Expense. 

### 🗂 The Projects Module
Projects are the foundational structure of the application. Everything else lives within a Project.
- **Action**: Click "New Project" to define a workspace. 
- **Under the Hood**: The `ProjectController` creates a relational PostgreSQL entity attached directly to your specific `User` ID. No other user can modify or view your project list due to strict Backend Authorization filtering.

### ☑️ The Tasks Module
Once projects exist, you can track deliverables. 
- **Action**: Use the dropdown filter at the top to select the Project you wish to manage. Add tasks, write descriptions, and update their statuses (To Do / In Progress / Done).
- **Financial Integration**: In the task list, you will see a badge representing the total **Expense Cost** linked to that specific task. This pulls directly from the aggregated `ExpenseController` endpoint.

### 🧾 The Expenses Module (Ledger)
A dedicated financial tracker determining the profitability and overhead of your projects.
- **Action**: Click "Add Record". You can log Income or Expense. 
- **Task Linkage**: If logging an Expense, a dynamic dropdown sequence activates. First, select the Project, then select a specific Task within that Project. 
- **Under the Hood**: This action links the relational IDs natively on the Backend. In the ledger view, the frontend gracefully renders the explicit Name (`taskTitle`) of the associated task via mapped JSON responses (avoiding Lazy Initialization errors).

### 👥 The Users Module (Admin Context)
- **Action**: View the list of all registered users on the system.
- **Under the Hood**: Hits the `UserController`. Notice that the passwords are not exposed. We strictly map raw database rows into a `UserResponse` DTO that trims sensitive variables before dispatching JSON across the wire.

---

## 3. Technical Walkthrough (How it ties together)

If you intend to extend this application, here is how a complete transaction flows through the system:

1. **Frontend Axio Interceptor**: Every API call originating from the React views automatically injects the stored JWT token into the HTTP Headers.
2. **Spring Security Filter**: As the request hits Spring Boot `http://localhost:8080`, the `AuthTokenFilter` captures it, decodes the JWT, and verifies the user exists.
3. **Controller Execution**: If authorized, execution passes to the targeted Controller (e.g. `ExpenseController`).
4. **Service Logic**: The Controller delegates validation and entity lookups to the `ExpenseService`. The logic confirms the User ID requesting the modification matches the Owner ID of the entity.
5. **JPA Repositories**: Hibernate executes automated SQL queries against PostgreSQL.
6. **DTO Mapping**: Before returning success to the frontend, the raw entity is passed through a builder (e.g. `mapToExpenseResponse()`) to ensure the frontend only receives what it visually requires to paint the UI.

Enjoy tracking your productivity and expenses!
