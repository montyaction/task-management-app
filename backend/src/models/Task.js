import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["to-do", "in-progress", "completed"], default: "to-do" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date, default: null },
    position: { type: Number, default: 0 }, // ordering within status
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// Optimizes board loading sorted by status/position and potential due-date-based filtering.
taskSchema.index({ user_id: 1, status: 1, position: 1, updatedAt: -1 });
taskSchema.index({ user_id: 1, dueDate: 1 });

export default mongoose.model("Task", taskSchema);
