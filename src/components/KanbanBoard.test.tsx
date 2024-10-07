import { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from './KanbanBoard';
import { TaskProvider } from '../context/TaskContext';
import { GroupBy } from '../types';

const mockTasks = [
  {
    id: 1,
    name: 'Task 1',
    status: 'todo',
    priority: 'low',
    due_date: '2023-05-01',
  },
  {
    id: 2,
    name: 'Task 2',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2023-05-02',
  },
  {
    id: 3,
    name: 'Task 3',
    status: 'done',
    priority: 'high',
    due_date: '2023-05-03',
  },
];

jest.mock('../context/TaskContext', () => ({
  ...jest.requireActual('../context/TaskContext'),
  useTaskContext: () => ({
    tasks: mockTasks,
  }),
}));

jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: ReactNode }) => children,
  Droppable: ({
    children,
  }: {
    children: (provided: {
      draggableProps: { style: {} };
      innerRef: jest.Mock;
    }) => ReactNode;
  }) =>
    children({
      draggableProps: {
        style: {},
      },
      innerRef: jest.fn(),
    }),
  Draggable: ({
    children,
  }: {
    children: (provided: {
      draggableProps: { style: {} };
      innerRef: jest.Mock;
    }) => ReactNode;
  }) =>
    children({
      draggableProps: {
        style: {},
      },
      innerRef: jest.fn(),
    }),
}));

describe('KanbanBoard Component', () => {
  const mockProps = {
    groupBy: 'state' as GroupBy,
    filter: {},
    onEditTask: jest.fn(),
    onSelectTask: jest.fn(),
    selectedTasks: [],
    currentPage: 1,
    onChangePage: jest.fn(),
    onDragEnd: jest.fn(),
  };

  it('calls onChangePage when pagination button is clicked', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    const nextButton = screen.getByText('Next');

    nextButton.click();
    expect(mockProps.onChangePage).toHaveBeenCalledWith(
      mockProps.currentPage + 1
    );
  });

  it('filters tasks based on search', () => {
    const propsWithFilter = { ...mockProps, filter: { search: 'Task 1' } };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithFilter} />
      </TaskProvider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks based on status', () => {
    const propsWithFilter = { ...mockProps, filter: { status: 'todo' } };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithFilter} />
      </TaskProvider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks based on priority', () => {
    const propsWithFilter = { ...mockProps, filter: { priority: 'low' } };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithFilter} />
      </TaskProvider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks based on date', () => {
    const propsWithFilter = { ...mockProps, filter: { date: '2023-05-01' } };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithFilter} />
      </TaskProvider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('calls onEditTask when a task is clicked', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    const task = screen.getByText('Task 1');
    fireEvent.click(task);
    expect(mockProps.onEditTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onSelectTask when a task checkbox is clicked', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(mockProps.onSelectTask).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it('disables the Previous button on the first page', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('displays task counts correctly', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    expect(screen.getByText('Todo: 1')).toBeInTheDocument();
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument();
    expect(screen.getByText('Done: 1')).toBeInTheDocument();
  });

  it('groups tasks by priority', () => {
    const propsWithGroupBy = { ...mockProps, groupBy: 'priority' as GroupBy };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithGroupBy} />
      </TaskProvider>
    );

    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('groups tasks by date', () => {
    const propsWithGroupBy = { ...mockProps, groupBy: 'date' as GroupBy };
    render(
      <TaskProvider>
        <KanbanBoard {...propsWithGroupBy} />
      </TaskProvider>
    );

    expect(screen.getByText('past_due')).toBeInTheDocument();
    expect(screen.getByText('today')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
  });
});
