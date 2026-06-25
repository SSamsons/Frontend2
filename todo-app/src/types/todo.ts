export interface ITodoItem {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt: string;
  tagIds: number[];
}

export type TodoFilterType = 'all' | 'active' | 'completed';

export interface CreateTodoInput {
  title: string;
}

export type UpdateTodoInput = Partial<Pick<ITodoItem, 'title' | 'completed' | 'tagIds'>>;

export interface StoredTodoPrefs {
  filter: TodoFilterType;
  searchQuery: string;
}
