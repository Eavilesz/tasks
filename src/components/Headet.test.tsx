import { render, screen } from '@testing-library/react';
import Header from './Header';
import { TaskProvider } from '../context/TaskContext';

describe('Header Component', () => {
  const mockProps = {
    filter: {},
    setFilter: jest.fn(),
    groupBy: 'state' as const,
    setGroupBy: jest.fn(),
    onAddTask: jest.fn(),
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    selectedTasks: [],
    onDeleteSelected: jest.fn(),
  };

  it('renders without crashing', () => {
    render(
      <TaskProvider>
        <Header {...mockProps} />
      </TaskProvider>
    );
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('calls onAddTask when Add Task button is clicked', () => {
    render(
      <TaskProvider>
        <Header {...mockProps} />
      </TaskProvider>
    );

    const addButton = screen.getByText('Add Task');
    addButton.click();
    expect(mockProps.onAddTask).toHaveBeenCalled();
  });
});
