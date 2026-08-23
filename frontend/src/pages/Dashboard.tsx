import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back, {user?.email}.</p>
    </main>
  );
}
