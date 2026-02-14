import { useState } from 'react';
import { Calendar, MoreHorizontal, Trash2, Edit2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, ColumnStatus } from '@/types/kanban';
import { COLUMNS } from '@/types/kanban';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const priorityConfig = {
  high: { label: 'High', className: 'bg-priority-high/20 text-priority-high border-priority-high/30' },
  medium: { label: 'Medium', className: 'bg-priority-medium/20 text-priority-medium border-priority-medium/30' },
  low: { label: 'Low', className: 'bg-priority-low/20 text-priority-low border-priority-low/30' },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: ColumnStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onMove, onDragStart }: TaskCardProps) {
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="group rounded-lg bg-kanban-card border border-border/50 p-4 cursor-grab active:cursor-grabbing hover:bg-kanban-card-hover transition-all duration-200 hover:border-primary/30"
    >
      {task.category && (
        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground mb-2">
          {task.category}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground leading-snug flex-1">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRight className="h-3.5 w-3.5 mr-2" /> Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-popover border-border">
                {COLUMNS.filter(c => c.id !== task.column_status).map(col => (
                  <DropdownMenuItem key={col.id} onClick={() => onMove(task.id, col.id)}>
                    {col.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mt-3">
        {task.due_date && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.due_date), 'MMM d')}
          </span>
        )}
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border ${priority.className}`}>
          {priority.label}
        </Badge>
      </div>
    </div>
  );
}
