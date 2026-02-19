import TaskCard from "./TaskCard.jsx";
import { DndContext, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskBoard({ tasks, onEdit, onDelete, onCreateClick, onDragEnd }) {
  const columns = [
    { key: "to-do", title: "To Do" },
    { key: "in-progress", title: "In Progress" },
    { key: "completed", title: "Completed" }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  );

  // Keep task rendering stable by position inside each status column.
  const byStatus = columns.reduce((acc, col) => {
    acc[col.key] = tasks
      .filter((t) => t.status === col.key)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    return acc;
  }, {});

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTask = tasks.find((t) => String(t._id) === activeId);
    if (!activeTask) return;

    const sourceStatus = activeTask.status;
    const sourceTasks = byStatus[sourceStatus] || [];
    const sourceIndex = sourceTasks.findIndex((t) => String(t._id) === activeId);
    if (sourceIndex < 0) return;

    let destinationStatus = null;
    let destinationIndex = -1;
    const isColumnDrop = columns.some((c) => c.key === overId);

    if (isColumnDrop) {
      destinationStatus = overId;
      destinationIndex = (byStatus[destinationStatus] || []).length;
    } else {
      const overTask = tasks.find((t) => String(t._id) === overId);
      if (!overTask) return;
      destinationStatus = overTask.status;
      const destinationTasks = byStatus[destinationStatus] || [];
      destinationIndex = destinationTasks.findIndex((t) => String(t._id) === overId);
      if (destinationIndex < 0) destinationIndex = destinationTasks.length;
    }

    if (sourceStatus === destinationStatus && sourceIndex === destinationIndex) return;

    onDragEnd({
      activeId,
      sourceStatus,
      sourceIndex,
      destinationStatus,
      destinationIndex
    });
  };

  function Column({ column, items }) {
    const { setNodeRef, isOver } = useDroppable({ id: column.key });

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{column.title}</h3>
          {column.key === "to-do" && (
            <button className="btn text-sm" onClick={onCreateClick}>+ New</button>
          )}
        </div>

        <div
          ref={setNodeRef}
          className={`space-y-2 min-h-[60px] p-2 rounded transition-colors duration-150 ${isOver ? "bg-blue-50" : "bg-gray-50"}`}
          style={{ minHeight: 60, border: "1px dashed #cbd5e1" }}
        >
          <SortableContext items={items.map((task) => String(task._id))} strategy={verticalListSortingStrategy}>
            {items.map((task) => (
              <SortableTask key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <Column key={col.key} column={col} items={byStatus[col.key] || []} />
        ))}
      </div>
    </DndContext>
  );
}

function SortableTask({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task._id)
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: "none",
    background: isDragging ? "#e0e7ff" : "white",
    borderRadius: 8,
    boxShadow: isDragging ? "0 2px 8px #a5b4fc" : "none",
    marginBottom: 8
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
