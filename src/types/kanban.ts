export type ColumnStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  column_status: ColumnStatus;
  title: string;
  description: string | null;
  priority: Priority;
  category: string | null;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: ColumnStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To-Do', color: 'hsl(var(--muted-foreground))' },
  { id: 'in_progress', title: 'In Progress', color: 'hsl(var(--warning))' },
  { id: 'review', title: 'Review', color: 'hsl(var(--primary))' },
  { id: 'done', title: 'Done', color: 'hsl(var(--success))' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
