"use client";

import { useActionState } from "react";
import { registerAction } from "../lib/actions";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900 transition-colors relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-600 dark:bg-green-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Register</h1>
        </div>

        <form action={formAction} className="p-8 space-y-6">
          {state?.error && (
            <div data-testid="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{state.error}</span>
            </div>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300 dark:bg-gray-700 dark:border-gray-600"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:text-blue-800 dark:text-blue-400">
              Already have an account? Login here
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
