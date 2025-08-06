# MERN To-Do List Application

A full-stack to-do list manager built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can register, log in, and manage their personal to-do lists and items.

## Live Demo

<https://ansrsource-todo-app.vercel.app/login>

## Features

- User Authentication (JWT-based)
- Register & Login functionality
- Create, Read, Update, Delete (CRUD) for:
  - To-do lists
  - To-do items inside lists
- Mark to-do items as completed
- Protected routes for authenticated users

## 🛠️ Tech Stack

**Frontend:**

- React (with Vite + SWC)
- Tailwind CSS
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- dotenv for environment configs
- CORS and security middleware

## 🧪 How to Run Locally

### Prerequisites

- Node.js and npm
- MongoDB (local or MongoDB Atlas)

### Environment variables

```bash
# server/.env.local
MONGO_URI=mongodb_connection_string
JWT_SECRET=secret_key
```

```bash
# client.env
VITE_API_BASE_URL=https://backend-url.com/api

```

### Backend

```bash
cd server
npm install
# Create .env.local and add MONGO_URI and JWT_SECRET
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev

```
