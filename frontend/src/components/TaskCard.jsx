import { memo } from "react";

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

function TaskCard({ task, onEdit, onDelete, selected = false, onSelect }) {
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;
  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <article
      className={`mb-2 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-slate-900 ${
        selected
          ? "border-sky-300 ring-2 ring-sky-100 dark:border-sky-500 dark:ring-sky-500/25"
          : "border-slate-200/90 dark:border-slate-700"
      }`}
      onClick={onSelect}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
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
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${priority.className}`}>
          {priority.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{formatUpdatedAt(task.updatedAt)}</p>
        {selected ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-outline px-2.5 py-1 text-[11px]"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task._id);
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
