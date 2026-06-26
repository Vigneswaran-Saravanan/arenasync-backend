# ArenaSync — Backend

REST API for the ArenaSync Soccer Matchmaking Platform

---

## About

This repository contains the Node.js and Express backend for ArenaSync. It handles authentication, match management, join requests, notifications, venue listings and the admin panel. All data is stored in MongoDB Atlas.

---

## Tech Stack

- Node.js with Express 5
- ES Modules (import/export)
- MongoDB Atlas + Mongoose
- bcryptjs — password hashing
- JSON Web Tokens (JWT) — authentication
- express-validator — input validation
- Deployed on Render

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### Installation

```bash
git clone https://github.com/Vigneswaran-Saravanan/arenasync-backend.git
cd arenasync-backend
npm install
```

### Environment Variables

Create a `.env` file in the root folder:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run Locally

```bash
node server.js
```

API runs on http://localhost:5000

---

## Deployment

Deployed on Render. Start command: `node server.js`

MongoDB connection string and JWT secret are configured as environment variables in the Render dashboard.

---

## Related

Frontend Repository: https://github.com/Vigneswaran-Saravanan/arenasync-frontend

---

## Author

Vigneswaran Saravanan
HTTP 5310 — Capstone Project
Humber Polytechnic, Summer 2026
