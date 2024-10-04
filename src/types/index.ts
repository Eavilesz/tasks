export interface Task {
  id: number;
  created_at: string;
  name: string;
  status: string;
  priority: string;
  due_date: string;
  description?: string;
  image?: string;
}

export type GroupBy = 'state' | 'priority' | 'date';

export interface Filter {
  search?: string;
  status?: string;
  priority?: string;
  date?: string;
}
