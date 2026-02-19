import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["to-do", "in-progress", "completed"], default: "to-do" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    position: { type: Number, default: 0 }, // ordering within status
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
