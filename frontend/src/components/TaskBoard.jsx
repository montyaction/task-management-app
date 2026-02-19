import { memo, useCallback, useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard.jsx";
import { DndContext, PointerSensor, closestCorners, pointerWithin, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLUMNS = [
  {
    key: "to-do",
    title: "To Do",
    hint: "Planned tasks waiting to start.",
    dotClass: "bg-sky-500",
    activeDropClass: "border-sky-300 bg-sky-50/70 dark:border-sky-500/50 dark:bg-sky-500/15"
  },
  {
    key: "in-progress",
    title: "In Progress",
    hint: "Tasks currently being worked on.",
    dotClass: "bg-amber-500",
    activeDropClass: "border-amber-300 bg-amber-50/70 dark:border-amber-500/50 dark:bg-amber-500/15"
  },
  {
    key: "completed",
    title: "Completed",
    hint: "Finished work ready for review.",
    dotClass: "bg-emerald-500",
    activeDropClass: "border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/50 dark:bg-emerald-500/15"
  }
];

function TaskBoard({ tasks, onEdit, onDelete, onCreateClick, onDragEnd }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const orderedTasks = useMemo(
    () => [...tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [tasks]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  );

  const byStatus = useMemo(
    () =>
      COLUMNS.reduce((acc, col) => {
        acc[col.key] = orderedTasks.filter((t) => t.status === col.key);
        return acc;
      }, {}),
    [orderedTasks]
  );

  const collisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
  }, []);

  useEffect(() => {
    if (!selectedTaskId) return;
    const stillExists = orderedTasks.some((task) => String(task._id) === selectedTaskId);
    if (!stillExists) {
      setSelectedTaskId(null);
    }
  }, [orderedTasks, selectedTaskId]);

  const handleSelectTask = useCallback((taskId) => {
    const nextId = String(taskId);
    setSelectedTaskId((prev) => (prev === nextId ? null : nextId));
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      const activeTask = orderedTasks.find((t) => String(t._id) === activeId);
      if (!activeTask) return;

      const sourceStatus = activeTask.status;
      const sourceTasks = byStatus[sourceStatus] || [];
      const sourceIndex = sourceTasks.findIndex((t) => String(t._id) === activeId);
      if (sourceIndex < 0) return;

      let destinationStatus = null;
      let destinationIndex = -1;
      const isColumnDrop = COLUMNS.some((c) => c.key === overId);

      if (isColumnDrop) {
        destinationStatus = overId;
        destinationIndex = (byStatus[destinationStatus] || []).length;
      } else {
        const overTask = orderedTasks.find((t) => String(t._id) === overId);
        if (!overTask) return;
        destinationStatus = overTask.status;
        const destinationTasks = byStatus[destinationStatus] || [];
        destinationIndex = destinationTasks.findIndex((t) => String(t._id) === overId);
        if (destinationIndex < 0) destinationIndex = destinationTasks.length;
      }

      if (sourceStatus === destinationStatus && sourceIndex === destinationIndex) return;

      onDragEnd({
        activeId,
        sourceStatus,
        sourceIndex,
        destinationStatus,
        destinationIndex
      });
    },
    [byStatus, onDragEnd, orderedTasks]
  );

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            column={col}
            items={byStatus[col.key] || []}
            onCreateClick={onCreateClick}
            onEdit={onEdit}
            onDelete={onDelete}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleSelectTask}
          />
        ))}
      </div>
    </DndContext>
  );
}

function ColumnComponent({ column, items, onCreateClick, onEdit, onDelete, selectedTaskId, onSelectTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  const itemIds = useMemo(() => items.map((task) => String(task._id)), [items]);

  return (
    <section className="surface fade-up p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.dotClass}`} />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{column.title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {items.length}
          </span>
        </div>

        {column.key === "to-do" && (
          <button className="btn-outline px-2.5 py-1 text-xs" onClick={onCreateClick}>
            + New
          </button>
        )}
      </div>

      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{column.hint}</p>

      <div
        ref={setNodeRef}
        className={`min-h-[170px] space-y-2 rounded-2xl border border-dashed p-2.5 transition-colors duration-150 ${
          isOver ? column.activeDropClass : "border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40"
        }`}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((task) => (
            <SortableTask
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedTaskId={selectedTaskId}
              onSelectTask={onSelectTask}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/80 px-3 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

const Column = memo(ColumnComponent);

function SortableTaskComponent({ task, onEdit, onDelete, selectedTaskId, onSelectTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task._id)
  });
  const isSelected = selectedTaskId === String(task._id);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none"
    }),
    [transform, transition]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition ${isDragging ? "scale-[1.01] opacity-90" : "opacity-100"}`}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        selected={isSelected}
        onSelect={() => onSelectTask(task._id)}
      />
    </div>
  );
}

const SortableTask = memo(SortableTaskComponent);

export default memo(TaskBoard);
