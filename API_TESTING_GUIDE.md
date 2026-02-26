# Expense Tracking API Reference & Testing Guide

This document outlines the complete RESTful backend API suite for the system. Use this as a guide for importing into Postman, cURL, or writing automated tests.

---

## 🔐 Authentication APIs

Base URL: `http://localhost:8080/api/auth`

### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/register`
- **Body** (JSON):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": ["user"] 
}
```

### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/login`
- **Body** (JSON):
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```
**Response**: Returns your `token`. You **MUST** include this token as a Bearer Token in the `Authorization` header for all subsequent requests:
`Authorization: Bearer <your_token>`

---

## 📁 Project APIs

Base URL: `http://localhost:8080/api/projects`
**Requires Auth Header**

### 1. Create Project
- **Method**: `POST`
- **Endpoint**: `/`
- **Body** (JSON):
```json
{
  "name": "Q3 Marketing Launch",
  "description": "Campaign deliverables and tracking"
}
```

### 2. Get All Projects
- **Method**: `GET`
- **Endpoint**: `/`
- **Response**: Returns a list of projects belonging to the authenticated user.

### 3. Delete Project (Admin Only)
- **Method**: `DELETE`
- **Endpoint**: `/{id}`
- **Note**: Deleting a project triggers a cascading deletion of all associated Tasks and Expenses.

---

## ✅ Task APIs

Base URL: `http://localhost:8080/api/tasks`
**Requires Auth Header**

### 1. Create Task
- **Method**: `POST`
- **Endpoint**: `/`
- **Body** (JSON):
```json
{
  "title": "Design Landing Page",
  "description": "Figma mockups for the Q3 launch",
  "status": "TODO",
  "dueDate": "2026-11-01",
  "projectId": 1
}
```
*Status Enums: `TODO`, `IN_PROGRESS`, `DONE`*

### 2. Get Tasks by Project
- **Method**: `GET`
- **Endpoint**: `/?projectId={id}`

### 3. Update Task
- **Method**: `PUT`
- **Endpoint**: `/{id}`
- **Body** (JSON): Same format as Create Task.

### 4. Delete Task
- **Method**: `DELETE`
- **Endpoint**: `/{id}`

---

## 💰 Expense & Income APIs

Base URL: `http://localhost:8080/api/expenses`
**Requires Auth Header**

### 1. Log an Expense / Income
- **Method**: `POST`
- **Endpoint**: `/`
- **Body** (JSON):
```json
{
  "amount": 450.00,
  "type": "EXPENSE",
  "category": "Software",
  "date": "2026-10-15",
  "description": "Adobe Subscription",
  "taskId": 1 
}
```
*Type Enums: `INCOME`, `EXPENSE`*
*Note: `taskId` is optional.*

### 2. Get All User Expenses
- **Method**: `GET`
- **Endpoint**: `/`

### 3. Get Monthly Financial Summary
- **Method**: `GET`
- **Endpoint**: `/monthly-summary?month=10&year=2026`
- **Response**: Aggregates total monthly income and total monthly expenses, calculating the mathematical balance.

### 4. Delete Expense
- **Method**: `DELETE`
- **Endpoint**: `/{id}`

---

## 📈 Activity Log APIs

Base URL: `http://localhost:8080/api/activities`
**Requires Auth Header**

### 1. Get Recent Activities
- **Method**: `GET`
- **Endpoint**: `/`
- **Response**: Returns the 50 most recent auditable system events (creations, deletions, updates) to populate the frontend Timeline.

---

## 👥 User Management APIs

Base URL: `http://localhost:8080/api/users`
**Requires Auth Header**

### 1. Get All Users (Admin Only)
- **Method**: `GET`
- **Endpoint**: `/`
- **Response**: Returns a structured list of all users, hiding passwords but exposing their `.blocked` boolean status.

### 2. Block/Unblock User (Admin Only)
- **Method**: `PUT`
- **Endpoint**: `/{id}/block`
- **Description**: Dynamically toggles the user's login privileges. If blocked, Spring Security instantly rejects new token generation.

---

## 🛠 Testing with Postman (Quick Start)

1. **Create a Variable**: Set a collection variable in Postman called `jwt_token`.
2. **Execute Login**: Send the login request (`/api/auth/login`).
3. **Capture Token**: In the Postman *Tests* tab for login, add:
   ```javascript
   var jsonData = pm.response.json();
   pm.collectionVariables.set("jwt_token", jsonData.token);
   ```
4. **Authorize Collection**: Go to the Collection's Authorization tab, select "Bearer Token", and set the value to `{{jwt_token}}`.
5. Now all endpoints will automatically authenticate seamlessly.
