import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useTaskStore } from "../stores/taskStore.js";
import { useUIStore } from "../stores/uiStore.js";
import TaskBoard from "../components/TaskBoard.jsx";
import TaskBoardSkeleton from "../components/TaskBoardSkeleton.jsx";
import EmptyTaskState from "../components/EmptyTaskState.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";
import { isTaskOverdue } from "../lib/taskDates.js";

const sortByPosition = (list) => [...list].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
const STATUS_LABELS = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  completed: "Completed"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask, applyTaskReorder, reorderTasksPersist } = useTaskStore();
  const { modals, openModal, closeModal, editingTask, setEditingTask, clearEditingTask } = useUIStore();
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

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
  const handleAddTask = useCallback(async (taskData) => {
    await addTask(taskData);
    closeModal("taskForm");
  }, [addTask, closeModal]);

  const handleUpdateTask = useCallback(async (taskId, updatedData) => {
    await updateTask(taskId, updatedData);
    clearEditingTask();
  }, [clearEditingTask, updateTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  }, [deleteTask]);

  const handleOpenTaskForm = useCallback(() => {
    openModal("taskForm");
  }, [openModal]);

  const handleCloseTaskForm = useCallback(() => {
    closeModal("taskForm");
  }, [closeModal]);

  // Handle drag end from board (dnd-kit payload from TaskBoard)
  const handleDragEnd = useCallback(async ({
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

      applyTaskReorder(payload);
      const result = await reorderTasksPersist(payload);
      if (!result?.success) {
        await fetchTasks();
      }
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

    applyTaskReorder(payload);
    const result = await reorderTasksPersist(payload);
    if (!result?.success) {
      await fetchTasks();
    }
  }, [applyTaskReorder, fetchTasks, reorderTasksPersist, tasks]);

  const stats = useMemo(() => {
    const byStatus = {
      "to-do": 0,
      "in-progress": 0,
      completed: 0
    };

    let highPriority = 0;
    tasks.forEach((task) => {
      if (byStatus[task.status] !== undefined) {
        byStatus[task.status] += 1;
      }
      if (task.priority === "high") {
        highPriority += 1;
      }
    });

    return {
      total: tasks.length,
      byStatus,
      highPriority
    };
  }, [tasks]);

  const overdueCount = useMemo(() => tasks.filter(isTaskOverdue).length, [tasks]);
  // Filtering to a subset can produce ambiguous list positions, so reorder stays disabled in this mode.
  const visibleTasks = useMemo(() => (showOverdueOnly ? tasks.filter(isTaskOverdue) : tasks), [showOverdueOnly, tasks]);

  const statCards = [
    {
      key: "total",
      label: "Total Tasks",
      value: stats.total,
      hint: `${stats.highPriority} high priority`,
      tone: "border-sky-200 bg-sky-50/70 text-sky-900 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-100"
    },
    {
      key: "to-do",
      label: STATUS_LABELS["to-do"],
      value: stats.byStatus["to-do"],
      hint: "Planned work",
      tone: "border-indigo-200 bg-indigo-50/70 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100"
    },
    {
      key: "in-progress",
      label: STATUS_LABELS["in-progress"],
      value: stats.byStatus["in-progress"],
      hint: "Active now",
      tone: "border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-100"
    },
    {
      key: "completed",
      label: STATUS_LABELS.completed,
      value: stats.byStatus.completed,
      hint: "Shipped tasks",
      tone: "border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100"
    }
  ];

  return (
    <div className="w-full space-y-5">
      <header className="surface fade-up p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
              <span className="sm:hidden">Workspace</span>
              <span className="hidden sm:inline">Team Workspace</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Welcome back, {user?.username || user?.email}. Review priorities and keep the workflow moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="btn-outline" onClick={fetchTasks} disabled={loading}>
              Refresh
            </button>
            <button className="btn" onClick={handleOpenTaskForm}>
              New task
            </button>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-rose-600"
                checked={showOverdueOnly}
                onChange={(event) => setShowOverdueOnly(event.target.checked)}
              />
              Show Overdue Only
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <article key={stat.key} className={`rounded-2xl border px-4 py-3 ${stat.tone}`}>
              <p className="text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-75">{stat.hint}</p>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">
          Overdue tasks: <span className="font-semibold">{overdueCount}</span>
          {showOverdueOnly ? " (filter active, drag-and-drop disabled)" : ""}
        </p>
      </header>

      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/45 dark:text-rose-200">
          {error}
        </p>
      )}

      {loading ? (
        <TaskBoardSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyTaskState onCreateClick={handleOpenTaskForm} />
      ) : (
        <TaskBoard
          tasks={visibleTasks}
          onCreateClick={handleOpenTaskForm}
          onEdit={setEditingTask}
          onDragEnd={handleDragEnd}
          onDelete={handleDeleteTask}
          dragDisabled={showOverdueOnly}
        />
      )}

      <TaskFormModal
        open={modals.taskForm}
        onClose={handleCloseTaskForm}
        onSubmit={handleAddTask}
      />

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
