import { memo, useCallback, useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard.jsx";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  defaultAnimateLayoutChanges,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLUMNS = [
  {
    key: "to-do",
    title: "To Do",
    hint: "Planned tasks waiting to start.",
    dotClass: "bg-sky-500",
    activeDropClass: "border-sky-300 bg-sky-50/75 ring-2 ring-sky-200/70 dark:border-sky-500/60 dark:bg-sky-500/15 dark:ring-sky-500/25"
  },
  {
    key: "in-progress",
    title: "In Progress",
    hint: "Tasks currently being worked on.",
    dotClass: "bg-amber-500",
    activeDropClass: "border-amber-300 bg-amber-50/75 ring-2 ring-amber-200/70 dark:border-amber-500/60 dark:bg-amber-500/15 dark:ring-amber-500/25"
  },
  {
    key: "completed",
    title: "Completed",
    hint: "Finished work ready for review.",
    dotClass: "bg-emerald-500",
    activeDropClass: "border-emerald-300 bg-emerald-50/75 ring-2 ring-emerald-200/70 dark:border-emerald-500/60 dark:bg-emerald-500/15 dark:ring-emerald-500/25"
  }
];

const DROP_ANIMATION = {
  duration: 220,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
};

function TaskBoard({ tasks, onEdit, onDelete, onCreateClick, onDragEnd }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const orderedTasks = useMemo(
    () => [...tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [tasks]
  );
  const taskById = useMemo(
    () => new Map(orderedTasks.map((task) => [String(task._id), task])),
    [orderedTasks]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
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
    const stillExists = taskById.has(selectedTaskId);
    if (!stillExists) {
      setSelectedTaskId(null);
    }
  }, [selectedTaskId, taskById]);

  useEffect(() => {
    if (!activeTaskId) return;
    if (!taskById.has(activeTaskId)) {
      setActiveTaskId(null);
    }
  }, [activeTaskId, taskById]);

  const handleSelectTask = useCallback((taskId) => {
    const nextId = String(taskId);
    setSelectedTaskId((prev) => (prev === nextId ? null : nextId));
  }, []);

  const handleDragStart = useCallback(({ active }) => {
    setActiveTaskId(String(active.id));
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveTaskId(null);
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      const activeTask = taskById.get(activeId);
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
        const overTask = taskById.get(overId);
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
    [byStatus, onDragEnd, taskById]
  );

  const getColumnTitle = useCallback(
    (statusKey) => COLUMNS.find((column) => column.key === statusKey)?.title ?? "Unknown",
    []
  );

  const getDropStatusFromOverId = useCallback(
    (overId) => {
      if (!overId) return null;
      const normalizedId = String(overId);
      const isColumn = COLUMNS.some((column) => column.key === normalizedId);
      if (isColumn) return normalizedId;
      return taskById.get(normalizedId)?.status ?? null;
    },
    [taskById]
  );

  const announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        const task = taskById.get(String(active.id));
        return task ? `Picked up ${task.title}.` : "Picked up task.";
      },
      onDragOver({ active, over }) {
        const task = taskById.get(String(active.id));
        const status = getDropStatusFromOverId(over?.id);

        if (!task) return undefined;
        if (!status) return `${task.title} is not over a drop zone.`;

        return `${task.title} is over ${getColumnTitle(status)}.`;
      },
      onDragEnd({ active, over }) {
        const task = taskById.get(String(active.id));
        const status = getDropStatusFromOverId(over?.id);

        if (!task) return undefined;
        if (!status) return `${task.title} was dropped.`;

        return `${task.title} moved to ${getColumnTitle(status)}.`;
      },
      onDragCancel({ active }) {
        const task = taskById.get(String(active.id));
        return task ? `Drag cancelled. ${task.title} returned to its original position.` : "Drag cancelled.";
      }
    }),
    [getColumnTitle, getDropStatusFromOverId, taskById]
  );

  const activeTask = activeTaskId ? taskById.get(activeTaskId) ?? null : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      autoScroll
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Press space to pick up a task. While dragging, use arrow keys to move it between tasks and columns. Press space to drop, or Escape to cancel."
        },
        announcements
      }}
    >
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
            activeTaskId={activeTaskId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={DROP_ANIMATION} zIndex={1200}>
        {activeTask ? (
          <div className="pointer-events-none w-[min(100vw-2rem,420px)] cursor-grabbing">
            <TaskCard task={activeTask} dragging asOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function ColumnComponent({ column, items, onCreateClick, onEdit, onDelete, selectedTaskId, onSelectTask, activeTaskId }) {
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
        className={`min-h-[170px] space-y-2 rounded-2xl border border-dashed p-2.5 transition-all duration-200 ${
          isOver
            ? column.activeDropClass
            : "border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40"
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
          <div
            className={`rounded-xl border border-dashed px-3 py-6 text-center text-sm transition-colors duration-150 ${
              isOver
                ? "border-sky-300 bg-sky-50/70 text-sky-700 dark:border-sky-500/60 dark:bg-sky-500/15 dark:text-sky-200"
                : "border-slate-200 bg-white/80 text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400"
            }`}
          >
            {isOver ? "Release to drop" : activeTaskId ? "Drop here" : "Drop tasks here"}
          </div>
        )}
      </div>
    </section>
  );
}

const Column = memo(ColumnComponent);

function SortableTaskComponent({ task, onEdit, onDelete, selectedTaskId, onSelectTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task._id),
    animateLayoutChanges: defaultAnimateLayoutChanges,
    transition: {
      duration: 220,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    }
  });
  const isSelected = selectedTaskId === String(task._id);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition ?? "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      touchAction: "none",
      willChange: isDragging ? "transform" : undefined
    }),
    [isDragging, transform, transition]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-[opacity,filter] duration-150 ${isDragging ? "cursor-grabbing opacity-45" : "opacity-100"}`}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        selected={isSelected}
        onSelect={() => onSelectTask(task._id)}
        showDragHandle
        dragging={isDragging}
        isGhost={isDragging}
      />
    </div>
  );
}

const SortableTask = memo(SortableTaskComponent);

export default memo(TaskBoard);
