# Task Management Application

## About

This repository contains a full-stack Task Management Application with user authentication and a dynamic Kanban board.
Built using the MERN stack (MongoDB, Express.js, React, Node.js) with modern tools like Vite, Tailwind CSS, and Zustand.
Features include secure JWT-based login, task CRUD, drag-and-drop task movement, responsive design, and deployment-ready configurations.
The project follows a sprint-based roadmap for structured development and CI/CD integration.

A full-stack task board with user authentication (JWT), task CRUD, and responsive UI (React + Tailwind).

## Repository Structure

/task-board-app
/backend → Node.js + Express + MongoDB
/frontend → React + Vite + Tailwind
README.md

## Branching Strategy

- **main** → Stable production-ready code
- **develop** → Ongoing development branch
- **feature/** → For new features (`feature/auth`, `feature/task-crud`)
- **hotfix/** → For urgent fixes on `main`
- **release/** → For preparing a version release

## Contribution Workflow

1. Clone the repository

```bash
   git clone https://github.com/your-username/task-board-app.git
   cd task-board-app
```

2. Create a new branch

```bash
    git checkout -b feature/<branch-name>
```

3. Commit and push

```bash
    git add .
    git commit -m "feat: <short description>"
    git push origin feature/<branch-name>
    Open a Pull Request into develop
```

4. Open a pull Request into `develop`

## Quick Start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Open the app at the URL printed by Vite (typically `http://localhost:5173`).

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_board
JWT_SECRET=replace-with-a-long-random-string
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000
```

---

## Scripts

- **backend**: `npm run dev` (with Nodemon) or `npm start`
- **frontend**: `npm run dev`

---

## Deployment Notes

- Deploy backend to Render/Railway/Fly.io.
- Deploy frontend to Vercel/Netlify.
- Set environment variables appropriately on both.
