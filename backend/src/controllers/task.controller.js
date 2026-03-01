import Task from "../models/Task.js";

const parseDueDateInput = (rawValue) => {
  if (rawValue === undefined) {
    return { hasValue: false };
  }

  if (rawValue === null || rawValue === "") {
    return { hasValue: true, value: null };
  }

  // Handle date-only payloads from <input type="date"> with strict validation.
  if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const [year, month, day] = rawValue.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    const isInvalidDate =
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() + 1 !== month ||
      parsed.getUTCDate() !== day;

    if (isInvalidDate) {
      return { hasValue: true, error: "dueDate must be a valid date" };
    }

    return { hasValue: true, value: parsed };
  }

  // Fallback for full ISO strings/timestamps.
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    return { hasValue: true, error: "dueDate must be a valid date" };
  }

  return { hasValue: true, value: parsed };
};

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description = "",
      status = "to-do",
      priority = "medium",
      position = 0,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    const parsedDueDate = parseDueDateInput(req.body.dueDate);
    if (parsedDueDate.error) {
      return res.status(400).json({ message: parsedDueDate.error });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      position,
      ...(parsedDueDate.hasValue ? { dueDate: parsedDueDate.value } : {}),
      user_id: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    // Sort by status, then position ascending, then updatedAt descending.
    // dueDate is returned as part of the task document.
    const tasks = await Task.find({ user_id: req.user.id }).sort({
      status: 1,
      position: 1,
      updatedAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsedDueDate = parseDueDateInput(req.body.dueDate);
    if (parsedDueDate.error) {
      return res.status(400).json({ message: parsedDueDate.error });
    }

    const payload = (({ title, description, status, priority, position }) => ({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(position !== undefined ? { position } : {}),
    }))(req.body);
    if (parsedDueDate.hasValue) {
      payload.dueDate = parsedDueDate.value;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      payload,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Bulk update positions for reordering
export const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{_id, position, status}]
    if (!Array.isArray(tasks)) return res.status(400).json({ message: "tasks array required" });
    const bulkOps = tasks.map(t => ({
      updateOne: {
        filter: { _id: t._id, user_id: req.user.id },
        update: { position: t.position, status: t.status },
      }
    }));
    await Task.bulkWrite(bulkOps);
    res.json({ message: "Tasks reordered" });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
