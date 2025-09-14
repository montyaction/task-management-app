import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Link to User who created the board (future: multi-user support)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Default columns (to-do, in-progress, done) stored as simple strings
    columns: [
      {
        type: [String],
        default: ["to-do", "in-progress", "done"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Board", boardSchema);
