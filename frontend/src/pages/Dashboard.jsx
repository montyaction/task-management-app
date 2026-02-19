import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useTaskStore } from "../stores/taskStore.js";
import { useUIStore } from "../stores/uiStore.js";
import TaskBoard from "../components/TaskBoard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuthStore();
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask, reorderTasksPersist } = useTaskStore();
  const { modals, openModal, closeModal, editingTask, setEditingTask, clearEditingTask } = useUIStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, fetchTasks, navigate]);

  // CRUD actions
  const handleAddTask = async (taskData) => {
    await addTask(taskData);
    closeModal("taskForm");
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    await updateTask(taskId, updatedData);
    clearEditingTask();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const sortByPosition = (list) => [...list].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  // Handle drag end from board (dnd-kit payload from TaskBoard)
  const handleDragEnd = async ({
    sourceStatus,
    sourceIndex,
    destinationStatus,
    destinationIndex
  }) => {
    const sourceTasks = sortByPosition(tasks.filter((t) => t.status === sourceStatus));
    const movingTask = sourceTasks[sourceIndex];
    if (!movingTask) return;

    if (sourceStatus === destinationStatus) {
      const reordered = [...sourceTasks];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(destinationIndex, 0, moved);

      const payload = reordered.map((t, idx) => ({
        _id: t._id,
        status: sourceStatus,
        position: idx
      }));

      await reorderTasksPersist(payload);
      await fetchTasks();
      return;
    }

    const destinationTasks = sortByPosition(tasks.filter((t) => t.status === destinationStatus));
    const nextSource = [...sourceTasks];
    const [movedTask] = nextSource.splice(sourceIndex, 1);
    const nextDestination = [...destinationTasks];
    nextDestination.splice(destinationIndex, 0, { ...movedTask, status: destinationStatus });

    const payload = [
      ...nextSource.map((t, idx) => ({
        _id: t._id,
        status: sourceStatus,
        position: idx
      })),
      ...nextDestination.map((t, idx) => ({
        _id: t._id,
        status: destinationStatus,
        position: idx
      }))
    ];

    await reorderTasksPersist(payload);
    await fetchTasks();
  };

  const handleLogout = () => {
    logout();
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
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          onCreateClick={() => openModal("taskForm")}
          onEdit={setEditingTask}
          onDragEnd={handleDragEnd}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Task Creation Modal */}
      <TaskFormModal
        open={modals.taskForm}
        onClose={() => closeModal("taskForm")}
        onSubmit={handleAddTask}
      />

      {/* Task Editing Modal */}
      {editingTask && (
        <TaskFormModal
        open={!!editingTask}
        initial={editingTask}
        onClose={clearEditingTask}
        onSubmit={(payload) => handleUpdateTask(editingTask._id, payload)}
        />
      )}
    </div>
  );
}
