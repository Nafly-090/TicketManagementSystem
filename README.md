
# QTechy — Role-Based Ticket Management System

An enterprise-grade, secure, role-based Full-Stack MERN (MongoDB, Express, React, Node.js) application designed to manage, assign, track, and resolve support tickets. This system implements strict **Role-Based Access Control (RBAC)** to deliver targeted, context-aware dashboards and control panels for **Administrators**, **Support Engineers (Agents)**, and **Clients (Users)**.

Developed as a highly structured, scalable, production-ready showcase of modern full-stack development.

---

## 🚀 Live Deployment Links

*   **Frontend Live Application (Vercel):** `https://your-frontend-deployed-url.vercel.app` 
*   **Backend API Gateway (Render/Railway):** `https://your-backend-api-gateway.onrender.com`
*   **Database Cluster:** Cloud MongoDB Atlas (Connected)

---

## 👨‍💻 Developer Profile

*   **Software Solution By:** **AJ NAFLAN**
*   **Clearance:** MERN Stack Developer | AI Developer | Mobile App Developer
*   **Academic Credential:** BICT (Hons) Special in Software Technologies
*   **Contact Number:** `+94 76 659 3949`
*   **Email Address:** [naflan265@gmail.com](mailto:naflan265@gmail.com)
*   **Professional Connection:** [LinkedIn Profile](https://www.linkedin.com/in/aj-naflan)

---

## 🏛 Architectural Design Decisions

To achieve strict code isolation, clean testability, and enterprise-grade maintainability, this project completely avoids coupling HTTP requests directly with database operations.

### 1. The Backend Layered Architecture (De-coupled)
We implement a **3-Layer Architecture** on the server-side:
```text
  Client Request (HTTP)
         │
         ▼
  [Routing Layer]  ──► Enforces middlewares (Auth, Rate Limit, Input Validator)
         │
         ▼
  [Controller Layer] ──► Handles request parameter extraction, parses cookies, sends standardized JSON payloads
         │
         ▼
  [Service Layer]  ──► Core Business Logic. Executes database actions, hashes passwords, performs status history calculations
         │
         ▼
  [Database Layer] (Mongoose models connecting to MongoDB Atlas)

2. State Synchronization & Frontend Cache (Redux Toolkit)

The React client operates on a unified, unidirectional global state pattern
managed via Redux Toolkit:

  - Global Persistence: User authentication states, JWT tokens, and metadata are
    persisted securely in local browser caches on successful login.
  - Real-time Optimistic Updates: State updates (posting comments, modifying
    ticket parameters, user assignments) update the UI state directly. This
    eliminates page reloads, satisfying the requirement: "Do not refresh the
    page after create, update, or delete."
  - Vite & Tailwind CSS v4 Build pipeline: Compiled utilizing high-performance
    Vite bundles combined with the native @tailwindcss/vite first-party plugin,
    resulting in instant startup and highly responsive layouts.

🔑 Operational Access clearance (User Roles)

| User Role | Dashboard Actions                                               | Ticket Operations                                                       | Comments Access                                | Account Operations                                     |
| :-------- | :-------------------------------------------------------------- | :---------------------------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------- |
| **Admin** | Full system metrics, real-time activity logs, visual charts.    | Read all, update metadata, assign agents, patch status, delete tickets. | Post replies to any ticket comments section.   | Create, Read, Update, Delete (CRUD) any user accounts. |
| **Agent** | Target workload cards, resolution percentage ring indicators.   | Read only assigned tickets, patch status transitions.                   | Post replies strictly to assigned tickets.     | Read profile.                                          |
| **User**  | Rapid submission panel, support queue status list, Portal FAQs. | Create tickets, view only self-submitted tickets, edit metadata.        | Post replies strictly to self-created tickets. | Register, log in                                       |

📂 Project Directory Structure

TicketManagementSystem/
├── backend/
│   ├── src/
│   │   ├── config/          # Mongoose Atlas and system integrations
│   │   ├── controllers/     # Controller layer (Extracts params, calls services, sends JSON)
│   │   ├── middleware/      # Auth JWT checks, RBAC validation, input validators
│   │   ├── models/          # Mongoose Schemas (User, Ticket, Comment, History)
│   │   ├── routes/          # Express Router endpoints (Auth, Tickets, Users)
│   │   ├── services/        # Service layer (Database queries, hashes, business computations)
│   │   ├── utils/           # Helper utilities (Standardized JSON payload generator)
│   │   └── app.js           # Express app instance, CORS configurations, 404 handler
│   ├── .env.example         # Template for environment configuration
│   ├── package.json         # Node scripts & server dependency tracking
│   └── server.js            # Main entry point (Connects database and starts server)
└── frontend/
    ├── src/
    │   ├── api/             # Central Axios instance with automated request headers interceptor
    │   ├── assets/          # Static asset files (Linkedln.png, brand logos)
    │   ├── components/      # Shared reusable components (ProtectedRoute)
    │   ├── layouts/         # Layout grids (Responsive DashboardLayout with role-based Sidebar)
    │   ├── pages/           # Visual UI screens (Landing, Login, Register, Dashboard, Details, Create, Edit, User Management)
    │   ├── store/           # Redux Toolkit global store config
    │   │   ├── slices/      # Redux Slices (authSlice, ticketSlice, userSlice)
    │   │   └── index.js     # Redux store aggregator
    │   ├── App.jsx          # React Router map (Enforces role permissions inside Router DOM)
    │   ├── index.css        # Tailwind CSS v4 import entry point
    │   └── main.jsx         # React bootstrapping file
    ├── vite.config.js       # Vite compiler plugin configurations (Tailwind v4 native plugin)
    ├── .env                 # Frontend local variables configuration
    ├── .env.example         # Template for environment configuration
    └── package.json         # Frontend package lists and scripts

🛠️ Local Installation & Setup Guide

Prerequisites

  - Node.js (v18+ recommended)
  - NPM or YARN package manager
  - A free MongoDB Atlas cloud account (or local MongoDB database instance)

Step 1: Clone the Repository

git clone https://github.com/Nafly-090/TicketManagementSystem.git
cd TicketManagementSystem

Step 2: Configure the Backend Server

1.  Navigate into the backend/ directory:

    cd backend

2.  Install all required dependencies:

    npm install

3.  Create a local environment variables configuration file:

    cp .env.example .env

4.  Open the newly created .env file and configure your credentials:

    PORT=5000
    MONGODB_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_cryptographically_secure_jwt_secret_key
    FRONTEND_URL=http://localhost:5173
    NODE_ENV=development

    (To generate a highly secure JWT_SECRET key, run node -e
    "console.log(require('crypto').randomBytes(32).toString('hex'))" in your
    terminal).

5.  Start your backend server in development mode:

    npm run dev

    Expected Console Output:

    [nodemon] starting `node server.js`
    MongoDB Connected: cluster0-shard-00-xx.mongodb.net
    Server running in development mode on port 5000

Step 3: Configure the Frontend Client

1.  Open a new terminal window and navigate into the frontend/ directory:
    cd ../frontend
2.  Install all required React, Redux, Router, and Tailwind dependencies:
    npm install
3.  Create a local variables configuration file inside the root of /frontend:
    touch .env
4.  Open the .env file and insert your API URL:
    VITE_API_URL=http://localhost:5000/api
5.  Run the Vite compiler in development mode:
    npm run dev
    Expected Console Output:
    VITE v5.x.x  ready in 300 ms
    ➜  Local:   http://localhost:5173/
6.  Open http://localhost:5173 in your web browser. You will be greeted by the
    custom QTechy welcome screen.

🌐 Complete REST API Reference (Backend)

All requests and responses use a standardized JSON communication protocol:

  - Success Payload Structure: { "success": true, "message": "Feedback message",
    "data": { ... } }
  - Error Payload Structure: { "success": false, "message": "Failure details",
    "error": "Trace details" }

1. Authentication Endpoints (/api/auth)

User Registration

  - Endpoint: POST /api/auth/register
  - Auth Required: None (Public)
  - Request Body:
    {
      "name": "Support Agent",
      "email": "agent@qtechy.com",
      "password": "password123",
      "role": "agent"
    }
  - Response (201 Created): Returns user details and signing JWT token.

User Login

  - Endpoint: POST /api/auth/login
  - Auth Required: None (Public)
  - Request Body:
    {
      "email": "admin@qtechy.com",
      "password": "password123"
    }
  - Response (200 OK): Returns signed JWT token, name, email, and system role.

2. User Management Endpoints (/api/users) — Admin Only

Retrieve User Index

  - Endpoint: GET /api/users
  - Auth Required: Bearer Token (JWT) + Administrator Role
  - Response (200 OK): Array containing all users, excluding passwords.

Create New User Directly

  - Endpoint: POST /api/users
  - Auth Required: Bearer Token (JWT) + Administrator Role
  - Request Body: (Same parameters as register)
  - Response (201 Created): Returns generated user details.

Modify User Parameters

  - Endpoint: PUT /api/users/:id
  - Auth Required: Bearer Token (JWT) + Administrator Role
  - Request Body: Can include "name", "email", or "role".

Delete User Account

  - Endpoint: DELETE /api/users/:id
  - Auth Required: Bearer Token (JWT) + Administrator Role
  - (Note: The system blocks Administrators from accidentally deleting their own
    active profile).

3. Ticket Endpoints (/api/tickets) — Authenticated Users

Create Ticket

  - Endpoint: POST /api/tickets
  - Auth Required: Bearer Token (JWT)
  - Request Body:
    {
      "title": "React state not resetting",
      "description": "Logouts do not correctly clear state parameters inside user index caches.",
      "category": "Bug",
      "priority": "High"
    }
  - Response (201 Created): Generates ticket with auto-sequenced ID (e.g.,
    TKT-0001), sets status to Open, and appends creator's ID.

List Tickets with Filters & Sorting

  - Endpoint: GET /api/tickets
  - Auth Required: Bearer Token (JWT)
  - Query Parameters:
      - search (Search by ticket number or text fields)
      - category (Bug, Feature Request, etc.)
      - priority (Low, Medium, High, Urgent)
      - status (Open, In Progress, Resolved, Closed)
      - sort (oldest, priority-desc, priority-asc)
      - page (Default: 1)
      - limit (Default: 10)
  - Response (200 OK): Paginated array of matching tickets, filtered
    automatically by the logged-in user's role:
      - User: Sees only self-created tickets.
      - Agent: Sees only assigned tickets.
      - Admin: Sees all tickets across the system.

Fetch Ticket Details

  - Endpoint: GET /api/tickets/:id
  - Auth Required: Bearer Token (JWT)
  - Response (200 OK): Populated ticket details, including comments and status
    logs.

Update Ticket Parameters

  - Endpoint: PUT /api/tickets/:id
  - Auth Required: Bearer Token (JWT) (Creator or Administrator only)
  - Request Body: Can include "title", "description", "category", or "priority".

Update Ticket Status

  - Endpoint: PATCH /api/tickets/:id/status
  - Auth Required: Bearer Token (JWT) + Admin or Assigned Agent Role
  - Request Body: { "status": "In Progress" }
  - Response (200 OK): Updates status and logs the transaction to statusHistory
    automatically.

Assign Ticket to Agent

  - Endpoint: PATCH /api/tickets/:id/assign
  - Auth Required: Bearer Token (JWT) + Administrator Role
  - Request Body: { "agentId": "agent_user_mongodb_id" }

Add Comment to Ticket

  - Endpoint: POST /api/tickets/:id/comments
  - Auth Required: Bearer Token (JWT) (Authorized participant only)
  - Request Body: { "text": "Our engineering staff has initiated hot-fixes." }

Delete Ticket

  - Endpoint: DELETE /api/tickets/:id
  - Auth Required: Bearer Token (JWT) + Administrator Role

Dashboard Statistics

  - Endpoint: GET /api/tickets/stats
  - Auth Required: Bearer Token (JWT)
  - Response (200 OK): Aggregated metrics counts by status, priority, and
    category, filtered automatically by the requester's role.

🔒 Evaluator Test Credentials

To facilitate immediate, local evaluation of the system without requiring
signups, please use these pre-registered test accounts:

1. Administrator Account (Full System Control)

  - Email: admin@qtechy.com
  - Password: password123
  - Role: Administrator (admin)
  - Usage: View full statistics charts, manage and CRUD users/agents, assign
    tickets, update status, and delete records.

2. Support Agent Account (Assigned Queue Action)

  - Email: agent@qtechy.com
  - Password: password123
  - Role: Support Engineer (agent)
  - Usage: View pending workload cards, post comments to assigned tickets, and
    transition statuses.

3. Client User Account (Request Portal)

  - Email: user@qtechy.com
  - Password: password123
  - Role: Customer / Client (user)
  - Usage: Use the public landing page, submit support requests, search own
    tickets, and add comments to open discussions.

🌍 Production Deployment Guide

Backend Deployment (Vercel Serverless)

1. Register/Login on Vercel.
2. Click Add New > Project and import your Git repository.
3. Set the Root Directory to backend.
4. Configure your Environment Variables in the Vercel dashboard:
    MONGODB_URI (Atlas connection string)
    JWT_SECRET (Cryptographic key)
    NODE_ENV=production
    FRONTEND_URL (Your final deployed Netlify URL)
5. Click Deploy. Vercel will build and host your Express API as a serverless service.

Frontend Deployment (Netlify)

1. Register/Login on Netlify.
2. Click Add new site > Import an existing project and link your Git repository.
3. Set the Base directory to frontend.
4. Set your build configurations:
    Build command: npm run build
    Publish directory: frontend/dist
5. Click Add environment variables and insert your backend API link:
    VITE_API_URL (Your live Vercel backend URL, e.g. https://your-backend.vercel.app/api)
6. Click Deploy site. Netlify will compile your Vite project and host it globally.

🛡️ License

This project is submitted to QTechy as part of the Associate MERN Stack Engineer
Full-Stack Task evaluation. All codebase layouts, decoupled service patterns,
and custom responsive canvas sequences are strictly owned by AJ NAFLAN and
licensed under the MIT License.

