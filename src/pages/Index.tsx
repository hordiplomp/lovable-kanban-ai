import { useState } from 'react';
import { Plus, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { TaskDialog } from '@/components/kanban/TaskDialog';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { COLUMNS, type Task, type ColumnStatus, type Priority } from '@/types/kanban';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { user, signOut } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks(user?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ColumnStatus>('todo');
  const [chatOpen, setChatOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleAddTask = (status: ColumnStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSubmitTask = async (data: {
    title: string;
    description?: string;
    priority?: Priority;
    category?: string;
    due_date?: string;
    column_status?: ColumnStatus;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
  };

  const handleDragStart = (_e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (_e: React.DragEvent, status: ColumnStatus) => {
    if (draggedTask && draggedTask.column_status !== status) {
      moveTask(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">FlowBoard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatOpen(true)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" /> AI Chat
          </Button>
          <Button
            onClick={() => handleAddTask('todo')}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
          <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">{user?.email}</span>
          <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(t => t.column_status === column.id)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmitTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      {user && (
        <ChatPanel
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          userId={user.id}
          tasks={tasks}
        />
      )}

      {/* Floating chat button when panel is closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all animate-pulse-glow"
          title="Open AI Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
