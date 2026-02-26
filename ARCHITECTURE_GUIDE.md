# Task Ledger - Complete Architecture Guide

This guide gives a clear, file-by-file breakdown of what every component in this full-stack application does. It is designed to be copy-pasteable so you can keep it as internal reference documentation or share it with recruiters/team members.

---

## 1. The Backend (Spring Boot + Java)
*Location: `expense-tracking/` directory.*

The backend provides the secure REST API for the frontend to consume. It is built using the **Controller-Service-Repository** pattern, an industry-standard architectural style that separates concerns cleanly.

### `expense-tracking/src/main/java/com/blaze/expense/tracking/`

#### `config/` (Application Configuration)
*   **`OpenApiConfig.java`**: Sets up Swagger/OpenAPI documentation. If you visit `/swagger-ui/index.html` locally, this file generates the interactive API testing webpage.
*   **`PasswordConfig.java`**: Defines the `BCryptPasswordEncoder` bean. By putting this in its own file, we avoid circular dependency errors between Spring Security and user registration logic.

#### `controller/` (The Endpoints)
Controllers receive HTTP requests (GET, POST, PUT, DELETE) from the React UI, translate the JSON data, and pass it to the Services.
*   **`AuthController.java`**: Handles `/api/auth/login` and `/api/auth/register`. 
*   **`ProjectController.java`**: Handles CRUD requests for creating and retrieving Projects.
*   **`TaskController.java`**: Handles CRUD requests for Tasks.
*   **`ExpenseController.java`**: Handles CRUD requests for Expenses, and aggregating dashboard statistics (e.g., getting total expenses for a specific task).

#### `dto/` (Data Transfer Objects)
DTOs are simple Java classes used to ensure the JSON coming *in* from the frontend matches exact security and validation rules before it ever reaches the database.
*   **`/request/RegisterRequest.java`**: Uses strict Regex to ensure incoming passwords contain uppercase, lowercase, numbers, and are 6+ characters.
*   **`/request/ExpenseRequest.java`**: Ensures expenses have an amount, type (`INCOME`/`EXPENSE`), and category.
*   **`/response/JwtResponse.java`**: The object returned when a user successfully logs in, containing their JWT token to store in the browser.
*   **`/response/MonthlySummaryResponse.java`**: Used for the Dashboard charts to format income/expense data by month.

#### `entity/` (Database Models)
Entities represent the actual SQL tables generated inside your PostgreSQL database via Hibernate (JPA).
*   **`User.java`**: Represents `users` table. Contains explicit Java getters/setters instead of Lombok to bypass Windows compiler bugs.
*   **`Project.java` & `Task.java`**: A Task belongs to a Project (`@ManyToOne`), and both belong to a User.
*   **`Expense.java`**: Records money. Crucially, it has an optional `@ManyToOne` relationship to a `Task` allowing users to see exactly which task cost money.
*   **`Role.java`, `ExpenseType.java`, `TaskStatus.java`**: Enums constraining database values strictly (e.g., `USER`/`ADMIN` or `TODO`/`IN_PROGRESS`/`DONE`).

#### `repository/` (Database Access)
Repositories are interfaces extending `JpaRepository`. They write SQL queries for us automatically.
*   **`ExpenseRepository.java`**: Contains custom JPA queries like `findByUserIdAndDateBetween` (used for the charts) or `findByTaskId` (used to get a single task's expenses).
*   **`UserRepository.java`**: Contains `existsByEmail` to prevent duplicate accounts.

#### `security/` (The Vault)
This locks down the API using Stateless JWTs.
*   **`WebSecurityConfig.java`**: Tells Spring Boot that `/api/auth/**` is public (anyone can register), but *every* other path requires a valid token. Configures CORS to allow React (`localhost:5173`) to talk to it.
*   **`jwt/JwtUtils.java`**: The engine that signs and encrypts the JSON Web Token using the master secret key located in `application.properties`.
*   **`jwt/AuthTokenFilter.java`**: Intercepts every single HTTP request. If the user attached a Bearer Token in their Headers, this filter validates it and logs them in temporarily for that single request.

#### `service/` (Business Logic)
Services do the heavy lifting. They take data from the Controllers, perform logic, and save it using the Repositories.
*   **`AuthService.java`**: Encrypts the raw password via BCrypt, saves the new `User` entity, and generates the JWT upon login.
*   **`TaskService.java`**: Contains logic to find a Project by ID, attach a new Task to it, and handle optional assignments.
*   **`ExpenseService.java`**: Calculates dashboard aggregations (e.g., generating 6-month historical graph data) and task-specific ledger sums.

---

## 2. The Frontend (React + Vite + TypeScript)
*Location: `frontend/` directory.*

The frontend is a fast Single Page Application (SPA). It manages routing internally, providing a fluid desktop-like experience without page reloads.

### `frontend/src/`

#### `api/`
*   **`axiosConfig.ts`**: The central HTTP client. It contains an **Interceptor**. Every single time React wants to talk to the backend, `axiosConfig` automatically injects the `Bearer <token>` from Local Storage into the request headers.

#### `components/`
*   **`ProtectedRoute.tsx`**: A wrapper component used in `App.tsx`. If a user is NOT logged in, this route forcefully kicks them back to the Login page.

#### `context/`
*   **`AuthContext.tsx`**: Global State Management. It holds the current `user` object and `token`. Because it wraps the whole app, any component (Navbar, Dashboard, etc.) can instantly know if the user is authenticated.

#### `layouts/`
*   **`MainLayout.tsx`**: The overarching visual frame. It contains a persistent side-navigation bar for core features and a top header housing user profile and security dropdowns. All dashboard and list pages render *inside* this layout framework.

#### `pages/` (The Views)
*   **`Login.tsx` & `Register.tsx`**: Uses Tailwind CSS "Glassmorphism" for a visually stunning authentication portal. Post data to `AuthContext`.
*   **`Dashboard.tsx`**: The core analytics page. Fetches summary data and feeds it into *Recharts* (a charting library) to render the Task Status Pie Chart and the Monthly Income vs Expenses graph.
*   **`Projects.tsx` & `Tasks.tsx`**: Interfaces mapping out the user's workload. Tasks utilizes color-coded badges based on their status (`TODO`(gray), `IN_PROGRESS`(blue), `DONE`(green)).
*   **`Expenses.tsx`**: The financial ledger. Includes a form to submit new expenses and a dropdown to optionally bind the expense to an existing Task ID via the backend interlinking we set up.

---

## 3. How the Application Flows (Example: Adding an Expense)
1. **Frontend UI (`Expenses.tsx`)**: User types `150.00` for "Figma Subscription" and clicks submit.
2. **Frontend HTTP (`axiosConfig.ts`)**: Automatically grabs the JWT token and fires a `POST /api/expenses` request to the backend.
3. **Backend Filter (`AuthTokenFilter.java`)**: Reads the HTTP request header, verifies the token signature, and says "Yes, user 1 is authorized."
4. **Backend Route (`ExpenseController.java`)**: Receives the JSON mapping it to `ExpenseRequest.java` DTO to validate fields aren't null.
5. **Backend Logic (`ExpenseService.java`)**: Grabs User 1 from the DB, takes the payload, builds an `Expense` object.
6. **Backend DB (`ExpenseRepository.java`)**: Saves the object securely into PostgreSQL.
7. **Frontend Update`: Controller returns `200 OK`, `Expenses.tsx` refreshes the ledger instantly.
