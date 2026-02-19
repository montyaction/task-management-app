import Task from "../models/Task.js";

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
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      position,
      user_id: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    // Sort by status, then position ascending, then updatedAt descending
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
    const payload = (({ title, description, status, priority, position }) => ({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(position !== undefined ? { position } : {}),
    }))(req.body);

    const updated = await Task.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      payload,
      { new: true }
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
