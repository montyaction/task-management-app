import TaskCard from "./TaskCard.jsx";

export default function TaskBoard({ tasks, onEdit, onDelete, onCreateClick }) {
  const columns = [
    { key: "to-do", title: "To Do" },
    { key: "in-progress", title: "In Progress" },
    { key: "completed", title: "Completed" }
  ];

  const byStatus = tasks.reduce((acc, t) => {
    acc[t.status] = acc[t.status] || [];
    acc[t.status].push(t);
    return acc;
  }, {});

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {columns.map(col => (
        <div key={col.key}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{col.title}</h3>
            {col.key === "to-do" && (
              <button className="btn text-sm" onClick={onCreateClick}>+ New</button>
            )}
          </div>
          <div className="space-y-2">
            {(byStatus[col.key] || []).map(task => (
              <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
