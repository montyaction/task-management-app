import Task from "../models/Task.js";

const STARTER_TASKS = [
  {
    title: "Review this board",
    description: "Open each column and see how tasks move from planning to done.",
    status: "to-do",
    priority: "low",
    position: 0
  },
  {
    title: "Add your first real task",
    description: "Use the New task button to replace demo work with your own priorities.",
    status: "to-do",
    priority: "high",
    position: 1
  },
  {
    title: "Invite your team to align work",
    description: "Share priorities so everyone can track what is in progress.",
    status: "to-do",
    priority: "medium",
    position: 2
  },
  {
    title: "Set up today's focus",
    description: "Pick one important task and move it to In Progress.",
    status: "in-progress",
    priority: "high",
    position: 0
  },
  {
    title: "Create labels in the task title",
    description: "Try prefixes like [Bug], [Feature], or [Research] for clarity.",
    status: "in-progress",
    priority: "medium",
    position: 1
  },
  {
    title: "Account created successfully",
    description: "You can edit or delete this demo task at any time.",
    status: "completed",
    priority: "low",
    position: 0
  }
];

export const seedStarterTasksForUser = async (userId) => {
  if (!userId) return;

  const existingTaskCount = await Task.countDocuments({ user_id: userId });
  if (existingTaskCount > 0) return;

  const tasksToInsert = STARTER_TASKS.map((task) => ({
    ...task,
    user_id: userId
  }));

  await Task.insertMany(tasksToInsert);
};
