import ShortenForm from "../components/url/ShortenForm";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-96 max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">Shorten and manage your links</h1>
      <p className="mt-4 text-slate-600">Create concise links and track their performance from one dashboard.</p>
      <ShortenForm />
    </main>
  );
}
