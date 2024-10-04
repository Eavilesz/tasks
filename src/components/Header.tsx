import React from 'react';
import { Filter, GroupBy } from '../types';

interface HeaderProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  groupBy: GroupBy;
  setGroupBy: (groupBy: GroupBy) => void;
  onAddTask: () => void;
  onUndo: () => void;
  onRedo: () => void;
  selectedTasks: number[];
  onDeleteSelected: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filter,
  setFilter,
  groupBy,
  setGroupBy,
  onAddTask,
  onUndo,
  onRedo,
  selectedTasks,
  onDeleteSelected,
}) => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Task Manager</h1>
        <div className="flex flex-wrap items-center space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border rounded px-2 py-1"
            value={filter.search || ''}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border rounded px-2 py-1"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filter.priority || ''}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="border rounded px-2 py-1"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={filter.date || ''}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="border rounded px-2 py-1"
          />
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="border rounded px-2 py-1"
          >
            <option value="state">Group by State</option>
            <option value="priority">Group by Priority</option>
            <option value="date">Group by Date</option>
          </select>
          <button
            onClick={onUndo}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Redo
          </button>
          <button
            onClick={onAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
          {selectedTasks.length > 0 && (
            <button
              onClick={onDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
