const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  // Keep date-only values stable for form controls.
  return date.toISOString().slice(0, 10);
};

export const formatDueDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
};

export const isTaskOverdue = (task) => {
  if (!task?.dueDate || task.status === "completed") return false;

  const dueDateKey = toDateInputValue(task.dueDate);
  if (!dueDateKey) return false;

  // Compare YYYY-MM-DD strings so "date only" semantics are preserved.
  const todayKey = toLocalDateKey(new Date());
  return dueDateKey < todayKey;
};
