import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { Task, GroupBy, Filter } from './types';

const API_URL = 'https://tasks-manager-test.fly.dev/api/tasks';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('state');
  const [filter, setFilter] = useState<Filter>({});
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [undoStack, setUndoStack] = useState<Task[][]>([]);
  const [redoStack, setRedoStack] = useState<Task[][]>([]);

  useEffect(() => {
    fetchTasks();
  }, [redoStack]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
      setUndoStack([...undoStack, data]); // Keeping the actual tasks states in memmory for undo action
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setUndoStack([...undoStack, [...tasks, data]]);
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
      // taking the last element only
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

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const { destination } = result;
      const task = tasks.find((t) => t.id.toString() === result.draggableId);

      if (task) {
        const updatedTask = { ...task };

        if (groupBy === 'state') {
          updatedTask.status = destination.droppableId;
        } else if (groupBy === 'priority') {
          updatedTask.priority = destination.droppableId;
        }

        updateTask(updatedTask);
      }
    },
    [tasks, groupBy, updateTask]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        filter={filter}
        setFilter={setFilter}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        onAddTask={() => setIsAddModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        selectedTasks={selectedTasks}
        onDeleteSelected={() => setIsDeleteModalOpen(true)}
      />
      <KanbanBoard
        tasks={tasks}
        groupBy={groupBy}
        filter={filter}
        onEditTask={(task) => {
          setEditingTask(task);
          setIsEditModalOpen(true);
        }}
        onSelectTask={(taskId) => {
          setSelectedTasks((prev) =>
            prev.includes(taskId)
              ? prev.filter((id) => id !== taskId)
              : [...prev, taskId]
          );
        }}
        selectedTasks={selectedTasks}
        currentPage={currentPage}
        onChangePage={setCurrentPage}
        onDragEnd={handleDragEnd}
      />
      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={addTask}
        />
      )}
      {isEditModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onUpdateTask={updateTask}
          onDeleteTask={() => {
            setIsDeleteModalOpen(true);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={() => {
            if (editingTask) {
              deleteTask(editingTask.id);
              setEditingTask(null);
            } else {
              selectedTasks.forEach((taskId) => deleteTask(taskId));
              setSelectedTasks([]);
            }
            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
