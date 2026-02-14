import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Task, ColumnStatus, Priority } from '@/types/kanban';
import { toast } from 'sonner';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } else {
      setTasks((data ?? []) as Task[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: {
    title: string;
    description?: string;
    priority?: Priority;
    category?: string;
    due_date?: string;
    column_status?: ColumnStatus;
  }) => {
    if (!userId) return;
    const columnTasks = tasks.filter(t => t.column_status === (task.column_status || 'todo'));
    const { error } = await supabase.from('tasks').insert({
      user_id: userId,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      category: task.category || '',
      due_date: task.due_date || null,
      column_status: task.column_status || 'todo',
      position: columnTasks.length,
    });
    if (error) {
      toast.error('Failed to add task');
      console.error(error);
    } else {
      toast.success('Task added');
      fetchTasks();
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update task');
      console.error(error);
    } else {
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } else {
      toast.success('Task deleted');
      fetchTasks();
    }
  };

  const moveTask = async (taskId: string, newStatus: ColumnStatus) => {
    const targetTasks = tasks.filter(t => t.column_status === newStatus);
    await updateTask(taskId, {
      column_status: newStatus,
      position: targetTasks.length,
    });
  };

  return { tasks, loading, addTask, updateTask, deleteTask, moveTask, refetch: fetchTasks };
}
