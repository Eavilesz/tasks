import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { Task, GroupBy, Filter } from './types';
import { TaskProvider, useTaskContext } from './context/TaskContext';

const AppContent: React.FC = () => {
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    handleUndo,
    handleRedo,
  } = useTaskContext();
  const [groupBy, setGroupBy] = useState<GroupBy>('state');
  const [filter, setFilter] = useState<Filter>({});
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  if (loading) {
    return <div>Loading...</div>;
  }

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

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;
