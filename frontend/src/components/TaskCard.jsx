import { memo } from "react";

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
          {task.priority}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn-outline text-sm" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn text-sm" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
}

export default memo(TaskCard);
