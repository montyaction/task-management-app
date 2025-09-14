import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description = "",
      status = "to-do",
      priority = "medium",
    } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      user_id: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user_id: req.user.id }).sort({
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
    const payload = (({ title, description, status, priority }) => ({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
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
