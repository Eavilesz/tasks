import React, { useState } from 'react';
import { Task } from '../types';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [name, setName] = useState(task.name);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [image, setImage] = useState(task.image || '');
  const [dueDate, setDueDate] = useState(task.due_date);
  const [description, setDescription] = useState(task.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3 || name.length > 50) return;
    if (image && !isValidUrl(image)) return;
    if (new Date(dueDate) < new Date()) return;

    onUpdateTask({
      ...task,
      name,
      status,
      priority,
      image: image || undefined,
      due_date: dueDate,
      description: description || undefined,
    });
    onClose();
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
              minLength={3}
              maxLength={50}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-2 py-1"
              maxLength={120}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onDeleteTask}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
