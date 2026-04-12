import CreateTodo from "./components/CreateTodo";
import TodoList from "./components/TodoList";
import { fetchTodos } from "./lib/api";
import { ThemeToggle } from "./components/ThemeToggle";

export default async function Home() {
  const todos = await fetchTodos().catch(() => []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-2xl mx-auto transition-colors duration-200">
      <main className="flex flex-col gap-8 items-center w-full">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <ThemeToggle />
        </div>
        <div className="w-full">
          <CreateTodo />
          <TodoList todos={todos} />
        </div>
      </main>
    </div>
  );
}
