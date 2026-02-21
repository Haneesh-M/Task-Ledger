# Productivity & Expense Intelligence System (Full Stack)

A professional full-stack application designed to manage complex tasks, associate expenses with specific projects, and track financial/productivity analytics. This application leverages a modern React-based frontend with Recharts for dynamic data visualization and a robust Spring Boot backend to provide a seamless, highly secure user experience with interview-level architectural principles.

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Project Structure](#-project-structure)
* [Frontend Documentation](#-frontend-documentation)
* [Backend Documentation](#-backend-documentation)
* [Setup & Installation](#-setup--installation)
* [Running the Application (Full Stack)](#-running-the-application-full-stack)
* [Design Decisions](#-design-decisions)
* [Security Highlights](#-security-highlights)

---

## 🚀 Overview

This application acts as a central hub for personal or team productivity and financial management. It allows users to create overarching **Projects**, break them down into actionable **Tasks**, and log **Expenses** that can be globally tracked or optionally linked to specific tasks. The system ensures robust data integrity through a strictly layered Spring Boot architecture, JWT-based security, and a beautiful sleek monolithic dashboard providing realtime expense and completion analytics.

---

## 📂 Project Structure

```text
├── expense-tracking/         # Backend Folder (Spring Boot + Java)
│   ├── src/main/java/com/blaze/expense/tracking/
│   │   ├── config/           # Application Configuration (Password Bean, OpenAPI)
│   │   ├── controller/       # REST API Endpoints (Auth, Project, Task, Expense)
│   │   ├── dto/              # Data Transfer Objects with Strict Validation
│   │   ├── entity/           # JPA Entities (User, Project, Task, Expense, Enums)
│   │   ├── exception/        # Global Error Handling
│   │   ├── repository/       # Data Access Layer (JPA Repositories)
│   │   ├── security/         # JWT Authentication Filters and Context Providers
│   │   └── service/          # Core Business Logic Layer
│   ├── src/main/resources/
│   │   └── application.properties # Server and PostgreSQL Configurations
│   └── pom.xml               # Maven Dependencies
├── frontend/                 # Frontend Folder (React + Vite)
│   ├── public/
│   └── src/
│       ├── api/              # API Client (Axios + JWT Interceptors)
│       ├── assets/           # Static Assets
│       ├── components/       # Reusable UI (Protected Routes, Cards)
│       ├── context/          # React Context (Auth State Management)
│       ├── layouts/          # Structural Layouts (Sidebar navigation)
│       ├── pages/            # View Components (Dashboard, Projects, Tasks, Expenses)
│       ├── App.tsx           # Global Router
│       ├── index.css         # Tailwind & Custom Aesthetic Variables
│       └── main.tsx          # React Entry Point
├── .gitignore                # Root Git Ignore
└── README.md                 # Project Documentation
```

---

## 💻 Frontend Documentation

### Frontend Overview

The frontend is a visually stunning, responsive Single Page Application (SPA) built with **React**, **TypeScript**, and **Vite**. It employs modern design aesthetics such as glassmorphism, dark-mode styling, and smooth micro-animations. 

### Frontend Features

* **Advanced Dashboard**: Real-time KPI metrics and varied visualizations (Pie Charts, Line Graphs, Bar Charts) via Recharts.
* **Component Tracking**: Robust Kanban-style list views for Projects and Tasks.
* **Financial Ledger**: Sleek interface for tracking expenses with optional dropdowns linking expenses to specific tasks.
* **Secured Routing**: Protected routes evaluating JWT context locally to prevent unauthorized access.

### Frontend Tech Stack

* **Framework**: React.js 18+
* **Language**: TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS & Vanilla CSS Modules
* **HTTP Client**: Axios (with Auth Interceptors)
* **Visualization**: Recharts
* **Icons**: Lucide React

---

## ⚙️ Backend Documentation

### Backend Overview

A RESTful, production-ready backend service. It employs an **Interview-Level Controller-Service-Repository Architecture** to ensure clean separation of concerns and maintainability.

### Backend Features

* **Encapsulated Authentication**: Decoupled AuthService generating Bcrypt hashed credentials and JWT tokens.
* **Complex Data Mappings**: Tasks belong to Projects; Expenses can belong directly to Users or specifically linked to Tasks for granular cost tracking.
* **Strict Validation Requirements**: Regex-level DTO validations ensuring minimum password complexity standards directly at the controller layer.
* **Cross-Origin Security**: Customized CORS definitions handling secure local handshakes.

### Backend Tech Stack

* **Runtime**: Java 21
* **Framework**: Spring Boot 3.x
* **Security**: Spring Security + JJWT (JSON Web Tokens)
* **Database**: PostgreSQL
* **ORM**: Hibernate / Spring Data JPA
* **Build Tool**: Maven

---

## 🛠 Setup & Installation

### Prerequisites

* Java 21+
* Node.js v18+
* PostgreSQL 14+ (Running on localhost:5432)

### 1. Database Setup

Open pgAdmin or your preferred PostgreSQL client and execute:
```sql
CREATE DATABASE productivity_db;
```
Ensure your `application.properties` correlates to your local `postgres` username and password.

### 2. Backend Installation

```bash
# From the backend directory
cd expense-tracking
./mvnw clean install
```

### 3. Frontend Installation

```bash
# From the frontend directory
cd frontend
npm install
```

---

## 🚀 Running the Application (Full Stack)

The application requires both services to run simultaneously.

### Step 1: Start the Backend

```bash
# In the expense-tracking folder
./mvnw spring-boot:run
```
*Backend runs on: **http://localhost:8080***

### Step 2: Start the Frontend

```bash
# In a new terminal window inside the frontend folder
cd frontend
npm run dev
```
*Frontend runs on: **http://localhost:5173***

---

## 🧠 Design Decisions

* **Explicit Bean Entities**: Bypassed local Lombok metadata generation issues by manually building out constructor bindings and Getters/Setters—guaranteeing 100% stable cross-platform compilation.
* **Separation of Concerns**: Extracted business logic universally into Service classes, ensuring Controllers are purely responsible for REST transport and routing.
* **Stateless JWT**: Eliminated session state server-side enabling scalable API requests where the Client proves identity upon every interaction.
* **Optional Entity Interlinking**: Built an architecture where Expenses are fully functional as standalone records but cleanly attachable to dimensional Tasks for complex aggregations.

---

## 🔒 Security Highlights

* **BCrypt Hashing**: All User passwords encoded prior to persistence.
* **Regex Filtering**: Strict enforcement of Uppercase, Lowercase, Number, and length permutations enforced automatically on Request payloads.
* **Stateless Token Verification**: Spring Security Interceptor filters all requests to ensure a valid JWT signature exists within the `Authorization: Bearer` Header prior to reaching controllers.
