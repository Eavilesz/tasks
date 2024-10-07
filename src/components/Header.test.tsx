import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { TaskProvider } from '../context/TaskContext';
import { AuthProvider } from '../context/AuthContext';

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
      <AuthProvider>
        <TaskProvider>
          <Header {...mockProps} />
        </TaskProvider>
      </AuthProvider>
    );
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('calls onAddTask when Add Task button is clicked', () => {
    render(
      <AuthProvider>
        <TaskProvider>
          <Header {...mockProps} />
        </TaskProvider>
      </AuthProvider>
    );

    const addButton = screen.getByText('Add Task');
    addButton.click();
    expect(mockProps.onAddTask).toHaveBeenCalled();
  });

  it('updates filter when search input changes', () => {
    render(
      <AuthProvider>
        <TaskProvider>
          <Header {...mockProps} />
        </TaskProvider>
      </AuthProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'test task' } });
    expect(mockProps.setFilter).toHaveBeenCalledWith({ search: 'test task' });
  });

  it('updates filter when date input changes', () => {
    render(
      <AuthProvider>
        <TaskProvider>
          <Header {...mockProps} />
        </TaskProvider>
      </AuthProvider>
    );

    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '2023-05-01' } });
    expect(mockProps.setFilter).toHaveBeenCalledWith({ date: '2023-05-01' });
  });

  it('updates groupBy when select changes', () => {
    render(
      <AuthProvider>
        <TaskProvider>
          <Header {...mockProps} />
        </TaskProvider>
      </AuthProvider>
    );

    const groupBySelect = screen.getByTestId('group-by-input');
    fireEvent.change(groupBySelect, { target: { value: 'priority' } });
    expect(mockProps.setGroupBy).toHaveBeenCalledWith('priority');
  });
});
