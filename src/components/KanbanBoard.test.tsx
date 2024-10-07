import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import KanbanBoard from './KanbanBoard';
import { TaskProvider } from '../context/TaskContext';

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
    groupBy: 'state' as const,
    filter: {},
    onEditTask: jest.fn(),
    onSelectTask: jest.fn(),
    selectedTasks: [],
    currentPage: 1,
    onChangePage: jest.fn(),
    onDragEnd: jest.fn(),
  };

  it('displays tasks correctly', () => {
    render(
      <TaskProvider>
        <KanbanBoard {...mockProps} />
      </TaskProvider>
    );

    expect(screen.getByText('todo')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

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
});
