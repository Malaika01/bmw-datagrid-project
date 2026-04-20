# 🚗 BMW IT Internship: Generic Data Management Hub

## 📝 Project Description
This project is a **high-performance, full-stack data management solution** developed for the BMW Battery Cell Competence Center internship aptitude test.

Beyond a simple car inventory system, this application functions as a **Generic Data Hub**. It features a **data-agnostic DataGrid** that dynamically adapts to any dataset structure (N-columns).

The system includes **enterprise-grade security**, such as:
- Role-Based Access Control (RBAC)
- Google OAuth 2.0 authentication
- Multi-grid architecture for handling multiple datasets

Users can seamlessly explore:
- Live database records  
- Temporary CSV imports  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- AG Grid (Quartz Theme)  
- Material UI (MUI)  
- React Router  
- Axios  
- PapaParse (CSV Parsing)  

### Backend
- Node.js  
- Express.js  
- JWT (JSON Web Tokens)  
- Bcrypt.js (Password Hashing)  
- Google Auth Library  

### Database
- MySQL  

### Documentation
- Swagger UI (OpenAPI 3.0)  

### Design
- Custom Dark Mode  
- Glassmorphism UI  
- BMW Brand Alignment  

---

## ✅ Features Implemented

- 🔹 **Generic DataGrid**  
  Automatically generates columns using dynamic key mapping  

- 🔹 **Server-Side Search**  
  Efficient global search using Express + MySQL  

- 🔹 **Advanced Filtering**  
  Backend-powered filtering (>, <, = conditions)  

- 🔹 **Administrative Control (RBAC)**  
  Full CRUD access restricted to Admin users  

- 🔹 **Detailed Record View**  
  Drill-down view for individual data entries  

- 🔹 **Multi-Dataset Support**  
  "Data Hub" workspace for switching between multiple datasets  

- 🔹 **Authentication & Security**
  - JWT-based authentication  
  - Google Sign-In integration  

---


## 🚀 Getting Started

### 1️⃣ Database Setup

1. Open **MySQL Workbench**
2. Run `database_setup.sql` to create:
   - `bmw_datagrid` database
   - Required tables (`cars`, `users`)
3. Ensure at least one **admin user** exists  
   *(or create one via Signup)*

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
1. Create .env file from .env.example
2. Add:
• MySQL credentials
• JWT secret
• Google Client ID

node server.js
• Server runs at:
👉 http://localhost:5000
• Swagger API Docs:
👉 http://localhost:5000/api-docs
￼
3️⃣ Frontend Setup
'''
cd client
npm install
'''
1. Create .env from .env.example
2. Add:
• VITE_API_URL
• VITE_GOOGLE_CLIENT_ID

'''
npm run dev
'''
• App runs at:
👉 http://localhost:5173
￼
🔐 Authentication Flow
• Username/Password login (JWT-based)
• Google OAuth 2.0 login
• Role-based access:
• Admin → Full CRUD access
• User → Read-only access

📊 API Documentation
Swagger UI available at:
Copy
http://localhost:5000/api-docs
Includes:
• Auth endpoints
• Cars CRUD APIs
• Search & filtering APIs
￼
🎯 Key Highlights
• Data-agnostic architecture (works with ANY dataset)
• Clean separation of frontend & backend
• Scalable API design
• Production-style authentication & security
• Professional UI aligned with BMW design principles

👩‍💻 Author
Malaika Waheed
Developed for the BMW Group IT Internship Aptitude Test