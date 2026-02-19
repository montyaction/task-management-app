import { memo } from "react";

const PRIORITY_MAP = {
  low: {
    label: "Low",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  high: {
    label: "High",
    className: "border-rose-200 bg-rose-50 text-rose-700"
  }
};

const formatUpdatedAt = (value) => {
  if (!value) return "Updated recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated recently";
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
};

function TaskCard({ task, onEdit, onDelete }) {
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;

  return (
    <article className="group mb-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-sm transition hover:-translate-y-px hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-slate-900 sm:text-base">{task.title}</h4>
          {task.description ? (
            <p className="mt-1 break-words text-sm text-slate-600">{task.description}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">No description added.</p>
          )}
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${priority.className}`}>
          {priority.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{formatUpdatedAt(task.updatedAt)}</p>
        <div className="flex gap-2 transition-all duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button className="btn-outline px-2.5 py-1 text-[11px]" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(TaskCard);
