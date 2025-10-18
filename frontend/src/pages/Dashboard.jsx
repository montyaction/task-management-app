import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useTaskStore } from "../stores/taskStore.js";
import TaskBoard from "../components/TaskBoard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuthStore();
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();   // From Zustand

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    // setLoading(true);
    // setError("");
    try {
      // const data = await api("/api/tasks", { token });
      // addTask(data);
      fetchTasks();
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddTask = async (taskData) => {
    const result = await addTask(taskData);
    if (result.success) {
      setModalOpen(false);
    } else {
      // Handle error, maybe display to user
      console.error("Error adding task:", result.error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    const result = await updateTask(taskId, updatedData);
    if (result.success) {
      setModalOpen(false);
      setEditing(null);
    } else {
      console.error("Error updating task:", result.error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Task Board</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={fetchTasks}>Refresh</button>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          onCreateClick={() => setModalOpen(true)}
          onEdit={(t) => { setEditing(t); }}
            onDelete={handleDeleteTask}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <TaskFormModal
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(payload) => handleUpdateTask(editing._id, payload)}
      />
    </div>
  );
}
