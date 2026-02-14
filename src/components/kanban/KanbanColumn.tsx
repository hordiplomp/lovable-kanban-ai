import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task, Column, ColumnStatus } from '@/types/kanban';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (status: ColumnStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: ColumnStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, status: ColumnStatus) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-[300px] w-[300px] rounded-xl bg-kanban-column border transition-all duration-200 ${
        dragOver ? 'border-primary/50 glow-primary' : 'border-border/30'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { setDragOver(false); onDrop(e, column.id); }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-sm font-display font-semibold text-foreground">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin max-h-[calc(100vh-220px)]">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        className="mx-3 mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
      >
        <Plus className="h-4 w-4" /> Add task
      </button>
    </div>
  );
}
