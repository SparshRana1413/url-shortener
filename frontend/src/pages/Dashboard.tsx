import UrlCard from "../components/url/UrlList";
import { useAuth } from "../context/AuthContext";
import { useUrls } from "../hooks/useUrls";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useUrls(1);

  const urls = data?.data.urls ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back, {user?.email}.
      </p>

      <section className="mt-8">
        {isLoading && (
          <p className="text-slate-600">Loading your URLs...</p>
        )}

        {isError && (
          <p className="text-red-600" role="alert">
            Unable to load your URLs. Please try again.
          </p>
        )}

        {!isLoading && !isError && urls.length === 0 && (
          <p className="text-slate-600">
            You haven't shortened any URLs yet.
          </p>
        )}

        {!isLoading && !isError && urls.length > 0 && (
          <div className="space-y-4">
            {urls.map((url) => (
              <UrlCard key={url.id} url={url} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}