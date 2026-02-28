# Task Management Application - Architecture

## Overview

This is a full-stack task management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). It provides users with a Kanban-board interface for managing tasks across multiple columns (To-Do, In-Progress, Completed) with drag-and-drop functionality, user authentication, and persistent ordering.

**Key Features:**
- User authentication with JWT
- Kanban board with drag-and-drop (react-beautiful-dnd)
- Task CRUD operations
- Real-time task reordering with position persistence
- Responsive design with Tailwind CSS
- State management with Zustand

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API)
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **HTTP:** CORS, Morgan (logging)
- **Environment:** dotenv

### Frontend
- **UI Framework:** React 18
- **Build Tool:** Vite (fast bundler & dev server)
- **State Management:** Zustand (lightweight store)
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + PostCSS
- **Drag-and-Drop:** react-beautiful-dnd

---

## Architecture Overview

```md
┌─────────────────────────────────────────────────────────┐
│                 Frontend (React + Vite)                 │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Pages (Dashboard, Login, Register)        │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Components (TaskBoard, TaskCard, etc.)      │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Zustand Stores (Auth, Task, Board, UI)      │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Axios API Client (with interceptors)      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↑
                       HTTP/REST
                           │
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Routes (/api/*)                     │   │
│  │  • /api/auth (register, login)                   │   │
│  │  • /api/tasks (CRUD, reorder)                    │   │
│  │  • /api/boards (CRUD)                            │   │
│  │  • /api/users (profile)                          │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Controllers (Logic for each route)             │   │
│  │  • auth.controller.js                            │   │
│  │  • task.controller.js                            │   │
│  │  • board.controller.js                           │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │       Models (Mongoose Schemas)                  │   │
│  │  • User                                          │   │
│  │  • Task (with position field)                    │   │
│  │  • Board                                         │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │       Middleware                                 │   │
│  │  • auth.middleware (JWT verification)            │   │
│  │  • errorHandler (error catching)                 │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          ↓                              │
│                   MongoDB Database                      │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure
```
backend/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Auth logic (register, login)
│   │   ├── task.controller.js    # Task CRUD + reorder logic
│   │   └── board.controller.js   # Board CRUD logic
│   ├── models/
│   │   ├── User.js               # User schema (email, password, username)
│   │   ├── Task.js               # Task schema (title, status, position, etc.)
│   │   └── Board.js              # Board schema (name, tasks list)
│   ├── routes/
│   │   ├── auth.routes.js        # POST /register, /login
│   │   ├── task.routes.js        # GET/POST/PUT/DELETE tasks, PUT /reorder/bulk
│   │   ├── board.routes.js       # Board endpoints
│   │   └── user.routes.js        # User endpoints
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── errorHandler.js       # Error handling
│   └── utils/
│       └── generateToken.js      # JWT token generation
├── package.json
└── .env                          # Environment variables
```

### Data Models

#### User Schema
```javascript
{
  email: String (unique),
  username: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Schema
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: "to-do", "in-progress", "completed"),
  priority: String (enum: "low", "medium", "high"),
  position: Number (ordering within status column),
  user_id: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Board Schema
```javascript
{
  name: String,
  tasks: [ObjectId] (ref: Task),
  user_id: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### API Routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Tasks
- `GET /api/tasks` - Fetch all user tasks (sorted by status, position)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task (title, description, status, priority, position)
- `PUT /api/tasks/reorder/bulk` - Batch update task positions for reordering
- `DELETE /api/tasks/:id` - Delete a task

#### Boards
- `GET /api/boards` - Fetch user boards
- `POST /api/boards` - Create a board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Authentication Flow
1. User registers or logs in with credentials
2. Backend hashes password with bcrypt and stores in MongoDB
3. Server generates JWT token (signed with JWT_SECRET)
4. Frontend stores token in localStorage
5. Subsequent requests include token in `Authorization: Bearer <token>` header
6. `auth.middleware.js` verifies token and extracts user ID
7. Protected routes check token before proceeding

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Root component + routing
│   ├── index.css                 # Global styles
│   ├── app/                      # TBD (component library setup)
│   ├── components/
│   │   ├── TaskBoard.jsx         # Main Kanban board with DnD
│   │   ├── TaskCard.jsx          # Individual task card
│   │   ├── TaskFormModal.jsx     # Modal for create/edit tasks
│   │   ├── Column.jsx            # Column component (TBD refactor)
│   │   ├── ThemeToggele.jsx      # Theme toggle
│   │   └── RouteChangeHandler.jsx # Route change handling
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main board page (with drag handlers)
│   │   ├── LoginPage.jsx         # Login page
│   │   └── RegisterPage.jsx      # Registration page
│   ├── lib/
│   │   └── apiClient.js          # Axios instance with interceptors
│   └── stores/
│       ├── authStore.js          # Auth state (user, token, login/logout)
│       ├── taskStore.js          # Task state (CRUD, reorder)
│       ├── boardStore.js         # Board state (TBD)
│       └── uiStore.js            # UI state (modals, editingTask)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env
```

### State Management (Zustand)

#### `authStore.js`
```javascript
{
  user: { username, email },
  token: String,
  loading: Boolean,
  error: String,
  // Actions:
  login(email, password),
  register(email, username, password),
  logout(),
  setToken(token)
}
```

#### `taskStore.js`
```javascript
{
  tasks: Task[],
  loading: Boolean,
  error: String,
  // Actions:
  fetchTasks(),
  addTask(taskData),
  updateTask(id, updates),
  deleteTask(id),
  reorderTasks(status, sourceIndex, destinationIndex), // Local reorder
  reorderTasksPersist(tasks), // Persist to backend
  clearTasks()
}
```

#### `uiStore.js`
```javascript
{
  modals: { taskForm: Boolean },
  editingTask: Task | null,
  // Actions:
  openModal(modalKey),
  closeModal(modalKey),
  setEditingTask(task),
  clearEditingTask()
}
```

#### `boardStore.js`
```javascript
{
  // TBD for multi-board support
}
```

### Component Hierarchy

```
App
├── RoleChangeHandler
├── Routes
│   ├── LoginPage
│   │   └── FormComponent
│   ├── RegisterPage
│   │   └── FormComponent
│   └── Dashboard
│       ├── TaskBoard (DnD wrapper)
│       │   └── Droppable(col.key)
│       │       └── Draggable(task._id)
│       │           └── TaskCard
│       ├── TaskFormModal
│       └── ThemeToggle
└── RouteChangeHandler
```

---

## Drag-and-Drop (DnD) Implementation

### Technology: dnd-kit

**Key Components:**
- `DragDropContext` - Wraps the entire board, handles drag-end events
- `Droppable` - Marks a column as droppable (id: status key)
- `Draggable` - Marks a task card as draggable (id: task._id)

### Workflow

1. **User Drags Task:**
   - React Beautiful DnD captures the drag event
   - Visual feedback (highlight column, shadow on card)

2. **User Drops Task:**
   - `onDragEnd` fired in Dashboard.jsx
   - Two scenarios:

   **A) Same Column (Reorder):**
   - Call `reorderTasks(status, sourceIndex, destinationIndex)`
   - Update local state with new order
   - Call `reorderTasksPersist()` to send new positions to backend
   - Call `fetchTasks()` to refresh and verify

   **B) Different Column (Move):**
   - Update task status
   - Reorder both source and destination columns
   - Build payload with position updates for all affected tasks
   - Call `reorderTasksPersist()` to persist to backend
   - Call `fetchTasks()` to refresh

3. **Backend Persists:**
   - `/api/tasks/reorder/bulk` receives task array with new positions
   - MongoDB updated with new positions
   - Next `fetchTasks()` returns tasks sorted by: status, position

4. **Frontend Re-renders:**
   - Updated tasks sorted by position within each column
   - UI reflects the new order

### Critical Details for DnD to Work

1. **Draggable ID must be unique:** Each task has a unique `_id` (MongoDB ObjectId)
2. **Index must match array order:** The `index` prop in `Draggable` must correspond to the exact position in the rendered array
3. **Tasks must be sorted by position:** TaskBoard.jsx sorts tasks by `position` field before rendering
4. **Ref forwarding:** `innerRef` correctly set on both Draggable and Droppable divs
5. **Placeholder:** `provided.placeholder` ensures space is reserved while dragging

---

## Data Flow

### Creating a Task
```
User Input (TaskFormModal)
    ↓
handleAddTask() in Dashboard
    ↓
taskStore.addTask()
    ↓
POST /api/tasks (Axios)
    ↓
Backend: createTask() controller
    ↓
MongoDB: Insert task doc
    ↓
Response with new task
    ↓
Frontend: Update tasks array in store
    ↓
Component re-renders
```

### Reordering Tasks (Same Column)
```
User drags task in column
    ↓
handleDragEnd() fires
    ↓
reorderTasks() → local state update
    ↓
reorderTasksPersist() → sends positions to backend
    ↓
PUT /api/tasks/reorder/bulk
    ↓
Backend: bulkWrite() to MongoDB
    ↓
fetchTasks() → GET /api/tasks
    ↓
Backend returns sorted tasks
    ↓
Frontend: Update tasks in store
    ↓
TaskBoard re-renders with new order
```

### Moving Tasks (Cross-Column)
```
User drags task to different column
    ↓
handleDragEnd() fires with different droppableId
    ↓
Build reorder payload for both columns
    ↓
reorderTasksPersist() + fetchTasks()
    ↓
Backend: Update status + position for all affected tasks
    ↓
Frontend: Re-render board
```

---

## Key Features & Implementation

### 1. JWT Authentication
- Credentials validated on backend
- JWT token stored in localStorage
- Axios interceptor adds token to all requests
- Automatic logout if token invalid

### 2. Responsive Design
- Tailwind CSS grid: `md:grid-cols-3` (3 columns on desktop, 1 on mobile)
- Card-based layout with spacing and padding
- Modal-based forms prevent page navigation

### 3. Persistent Ordering
- Task `position` field in MongoDB
- Backend sorts by `position` on fetch
- Drag-and-drop updates position via bulk endpoint
- Order restored on page reload

### 4. Error Handling
- Backend middleware catches errors and returns JSON
- Frontend displays error messages in UI
- User-friendly error feedback

### 5. Loading States
- `loading` flag in stores
- Dashboard shows "Loading..." while fetching tasks
- Buttons disabled during async operations

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_board
JWT_SECRET=your-super-secret-key-here
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## Development Workflow

### Start Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

### Test with Postman
- Import `backend/docs/postman_collection.json`
- Test endpoints before/after frontend changes

---

## Future Enhancements

- [ ] Multi-board support (switch between boards)
- [ ] Collaborative editing (real-time updates with WebSocket)
- [ ] Task filtering and search
- [ ] Task due dates and reminders
- [ ] User profile customization
- [ ] Export board as CSV/PDF
- [ ] Task attachments
- [ ] Comments and activity log
- [ ] Dark theme toggle (currently in ThemeToggle.jsx, needs styling)

---

## Deployment Notes

### Backend
- Set `MONGO_URI` to production MongoDB Atlas URL
- Set `JWT_SECRET` to a strong random string
- Set `CLIENT_URL` to frontend production URL
- Deploy to Heroku, DigitalOcean, AWS, or similar

### Frontend
- Set `VITE_API_URL` to production backend URL
- Run `npm run build` for optimized bundle
- Deploy to Vercel, Netlify, or static hosting

---

## Troubleshooting

### DnD Not Working
- Ensure tasks are sorted by `position` before rendering
- Check that draggableId matches task._id
- Verify Draggable/Droppable ids are correct
- Clear browser cache and rebuild

### CORS Errors
- Check `CLIENT_URL` in backend .env
- Ensure frontend URL matches backend CORS config

### Authentication Failing
- Verify JWT_SECRET is set in .env
- Check token is being sent in Authorization header
- Ensure token hasn't expired

### Tasks Not Persisting
- Check MongoDB connection (`MONGO_URI`)
- Verify user_id is correctly stored with task
- Check backend logs for database errors
