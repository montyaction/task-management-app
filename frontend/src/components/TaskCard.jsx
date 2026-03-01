import { memo } from "react";
import { formatDueDate, isTaskOverdue } from "../lib/taskDates.js";

const PRIORITY_MAP = {
  low: {
    label: "Low",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200"
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200"
  },
  high: {
    label: "High",
    className: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-200"
  }
};

const formatUpdatedAt = (value) => {
  if (!value) return "Updated recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated recently";
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
};

function TaskCard({
  task,
  onEdit,
  onDelete,
  selected = false,
  onSelect,
  showDragHandle = false,
  dragging = false,
  asOverlay = false,
  isGhost = false
}) {
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;
  const isOverdue = isTaskOverdue(task);
  const isInteractive = !asOverlay && typeof onSelect === "function";

  const handleCardKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <article
      className={`mb-2 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition dark:bg-slate-900 ${
        isInteractive && !dragging && !isGhost ? "cursor-pointer hover:-translate-y-px hover:shadow-md" : ""
      } ${
        selected
          ? isOverdue
            ? "border-rose-300 ring-2 ring-rose-100 dark:border-rose-500/70 dark:ring-rose-500/25"
            : "border-sky-300 ring-2 ring-sky-100 dark:border-sky-500 dark:ring-sky-500/25"
          : isOverdue
            ? "border-rose-300 bg-rose-50/35 dark:border-rose-500/70 dark:bg-rose-950/20"
            : "border-slate-200/90 dark:border-slate-700"
      } ${dragging && asOverlay ? "scale-[1.01] shadow-2xl" : ""} ${
        isGhost
          ? "border-dashed border-slate-300 bg-slate-100/75 shadow-none dark:border-slate-600 dark:bg-slate-800/45"
          : ""
      }`}
      onClick={isInteractive ? onSelect : undefined}
      onKeyDown={isInteractive ? handleCardKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? selected : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">{task.title}</h4>
          {task.description ? (
            <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">No description added.</p>
          )}
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${priority.className}`}>
            {priority.label}
          </span>
          {isOverdue && (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/15 dark:text-rose-200">
              Overdue
            </span>
          )}

          {showDragHandle && (
            <span
              aria-hidden="true"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs leading-none tracking-tight text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${
                dragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {"\u22EE\u22EE"}
            </span>
          )}
        </div>
      </div>

      {task.dueDate && (
        <p className={`mt-2 text-xs font-medium ${isOverdue ? "text-rose-700 dark:text-rose-200" : "text-slate-500 dark:text-slate-300"}`}>
          Due {formatDueDate(task.dueDate)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{formatUpdatedAt(task.updatedAt)}</p>
        {asOverlay ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">Dragging</p>
        ) : selected ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-outline px-2.5 py-1 text-[11px]"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(task);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(task._id);
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Select to manage</p>
        )}
      </div>
    </article>
  );
}

export default memo(TaskCard);
