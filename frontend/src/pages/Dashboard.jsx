import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import TaskBoard from "../components/TaskBoard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/tasks", { token });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const createTask = async (payload) => {
    await api("/api/tasks", { method: "POST", body: payload, token });
    setModalOpen(false);
    await load();
  };

  const updateTask = async (id, payload) => {
    await api(`/api/tasks/${id}`, { method: "PUT", body: payload, token });
    setEditing(null);
    await load();
  };

  const deleteTask = async (id) => {
    await api(`/api/tasks/${id}`, { method: "DELETE", token });
    await load();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Task Board</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={load}>Refresh</button>
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
          onDelete={deleteTask}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createTask}
      />

      <TaskFormModal
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(payload) => updateTask(editing._id, payload)}
      />
    </div>
  );
}
