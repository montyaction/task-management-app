import { useEffect, useState } from "react";
import { toDateInputValue } from "../lib/taskDates.js";

export default function TaskFormModal({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("to-do");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setDescription(initial?.description || "");
      setPriority(initial?.priority || "medium");
      setStatus(initial?.status || "to-do");
      setDueDate(toDateInputValue(initial?.dueDate));
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return undefined;

    const onEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null
    });
  };

  const isSubmitDisabled = !title.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="surface w-full max-w-xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {initial ? "Edit Task" : "New Task"}
          </h3>
          <button className="btn-ghost px-1.5 py-0.5 text-base leading-none text-slate-500 dark:text-slate-300" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a short, clear task title"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className="input min-h-[96px] resize-y"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, context, or acceptance notes"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="task-due-date">
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                className="input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={isSubmitDisabled}>
              {initial ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
