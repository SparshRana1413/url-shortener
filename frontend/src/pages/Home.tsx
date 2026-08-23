import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-96 max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">Shorten and manage your links</h1>
      <p className="mt-4 text-slate-600">Create concise links and track their performance from one dashboard.</p>
      <Link className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white" to="/register">Get started</Link>
    </main>
  );
}
