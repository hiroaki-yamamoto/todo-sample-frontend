export type User = {
  id: string;
  name: string;
};

export type Todo = {
  id: string;
  wipAt?: string | null;
  completedAt?: string | null;
  text: string;
  user: User;
};

export type NewTodo = {
  text: string;
};

export type UpdateTodo = {
  id: string;
  text: string;
  wipAt?: string | null;
  completedAt?: string | null;
};
