# Rate My Management (RMM) - Backend

This repository contains the backend for **Rate My Management (RMM)** — a platform that enables employees to anonymously rate and review their managers.  
The system aggregates ratings at the manager and company levels, helping organizations improve transparency and workplace culture.

---

## 🚀 Features
- **User Authentication**
  - Email-based signup/login
  - JWT-based authentication
- **Manager Reviews**
  - Submit anonymous reviews for managers
  - Like/dislike reviews
  - Edit/delete own reviews
- **Manager Profiles**
  - Manager details (name, department, position)
  - Average rating updates in real time
- **Company Profiles**
  - Aggregated ratings derived from manager ratings
  - Factors like location & workplace environment included
- **Secure Data**
  - Role-based access (user/admin)
  - Protected routes with middleware

---

## 🛠️ Tech Stack
- **Node.js** + **Express.js** – API & routing
- **MongoDB** + **Mongoose** – Database & models
- **JWT** – Secure authentication
- **Bcrypt** – Password hashing
- **CORS** & **Helmet** – Security middleware

---

## 📂 Project Structure
