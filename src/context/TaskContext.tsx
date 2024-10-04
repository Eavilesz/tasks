import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Task } from '../types/index';

const API_URL = 'https://tasks-manager-test.fly.dev/api/tasks';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  undoStack: Task[][];
  redoStack: Task[][];
  addTask: (newTask: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  handleUndo: () => void;
  handleRedo: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [undoStack, setUndoStack] = useState<Task[][]>([]);
  const [redoStack, setRedoStack] = useState<Task[][]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
      setUndoStack([...undoStack, data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  }, [undoStack]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (newTask: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      const newTasks = [...tasks, data];
      setTasks(newTasks);
      setUndoStack([...undoStack, newTasks]);
      setRedoStack([]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`${API_URL}/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      const newTasks = tasks.map((task) => (task.id === data.id ? data : task));
      setTasks(newTasks);
      setUndoStack([...undoStack, newTasks]);
      setRedoStack([]);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
      setUndoStack([...undoStack, newTasks]);
      setRedoStack([]);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newUndo = [...undoStack];
      const lastState = newUndo.pop()!;
      setRedoStack([...redoStack, lastState]);
      setUndoStack(newUndo);
      setTasks(newUndo[newUndo.length - 1]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedo = [...redoStack];
      const nextState = newRedo.pop()!;
      setUndoStack([...undoStack, nextState]);
      setRedoStack(newRedo);
      setTasks(nextState);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        undoStack,
        redoStack,
        addTask,
        updateTask,
        deleteTask,
        handleUndo,
        handleRedo,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
