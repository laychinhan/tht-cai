export interface ITask {
  id: number;
  name: string;
  description: string;
  due_date: string;
  is_done: string;
  created_at: string;
}

export interface PaginatedTasks {
  tasks: ITask[];
  total_pages: number;
}
