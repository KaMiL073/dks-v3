"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

const initialState: { error?: string; success?: boolean } = {};

export default function LoginPage() {
  const [state, formAction, pending] = React.useActionState(loginAction, initialState);
  const router = useRouter();

  React.useEffect(() => {
    if (state?.success) {
      router.push("/aktualnosci");
    }
  }, [state?.success, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form action={formAction} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Logowanie</h1>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full mb-4 p-2 border rounded"
          disabled={pending}
        />

        <label className="block mb-2 text-sm font-medium">Hasło</label>
        <input
          name="password"
          type="password"
          required
          className="w-full mb-4 p-2 border rounded"
          disabled={pending}
        />

        {state?.error && (
          <p className="mb-4 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Loguję…" : "Zaloguj się"}
        </button>
      </form>
    </main>
  );
}