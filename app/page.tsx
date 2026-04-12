import CreateTodo from "./components/CreateTodo";
import TodoList from "./components/TodoList";
import { fetchTodos } from "./lib/api";

export default async function Home() {
  const todos = await fetchTodos().catch(() => []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-2xl mx-auto">
      <main className="flex flex-col gap-8 items-center w-full">
        <h1 className="text-3xl font-bold w-full">Todo App</h1>
        <div className="w-full">
          <CreateTodo />
          <TodoList todos={todos} />
        </div>
      </main>
    </div>
  );
}
