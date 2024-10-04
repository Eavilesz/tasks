import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Task, GroupBy, Filter } from '../types/index.tsx';
import { useTaskContext } from '../context/TaskContext.tsx';

interface KanbanBoardProps {
  groupBy: GroupBy;
  filter: Filter;
  onEditTask: (task: Task) => void;
  onSelectTask: (taskId: number) => void;
  selectedTasks: number[];
  currentPage: number;
  onChangePage: (page: number) => void;
  onDragEnd: (result: any) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  groupBy,
  filter,
  onEditTask,
  onSelectTask,
  selectedTasks,
  currentPage,
  onChangePage,
  onDragEnd,
}) => {
  const { tasks } = useTaskContext();
  const filteredTasks = tasks.filter((task) => {
    if (
      filter.search &&
      !task.name.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.date && task.due_date !== filter.date) return false;
    return true;
  });

  const getColumns = () => {
    switch (groupBy) {
      case 'state':
        return ['todo', 'in_progress', 'done'];
      case 'priority':
        return ['low', 'medium', 'high'];
      case 'date':
        return ['past_due', 'today', 'next'];
      default:
        return ['todo', 'in_progress', 'done'];
    }
  };

  const getTasksForColumn = (column: string) => {
    return filteredTasks
      .filter((task) => {
        if (task) {
          if (groupBy === 'state') return task.status === column;
          if (groupBy === 'priority') return task.priority === column;
          if (groupBy === 'date') {
            const today = new Date().toISOString().split('T')[0];
            if (column === 'past_due') return task.due_date < today;
            if (column === 'today') return task.due_date === today;
            if (column === 'next') return task.due_date > today;
          }
          return false;
        }
      })
      .slice((currentPage - 1) * 3, currentPage * 3);
  };

  const columns = getColumns();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap justify-center p-4">
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gray-100 p-4 rounded-lg m-2 w-full md:w-1/3 lg:w-1/4"
              >
                <h2 className="text-lg font-semibold mb-4">{column}</h2>
                {getTasksForColumn(column).map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white p-4 mb-4 rounded shadow ${
                          selectedTasks.includes(task.id)
                            ? 'border-2 border-blue-500'
                            : ''
                        }`}
                        onClick={() => onEditTask(task)}
                      >
                        <h3 className="font-semibold">{task.name}</h3>
                        {task.image && (
                          <img
                            src={task.image}
                            alt={task.name}
                            className="w-full h-32 object-cover my-2 rounded"
                          />
                        )}
                        <div className="flex justify-between mt-2">
                          <span>
                            {groupBy !== 'priority'
                              ? task.priority
                              : task.status}
                          </span>
                          <span>
                            {groupBy !== 'date' ? task.due_date : task.status}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => onSelectTask(task.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onChangePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => onChangePage(currentPage + 1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <span className="mr-4">
          Todo: {tasks.filter((t) => t?.status === 'todo')?.length}
        </span>
        <span className="mr-4">
          In Progress: {tasks.filter((t) => t?.status === 'in_progress').length}
        </span>
        <span>Done: {tasks.filter((t) => t?.status === 'done').length}</span>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
