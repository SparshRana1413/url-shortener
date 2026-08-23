import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as urlsApi from "../../api/urls";
import CopyButton from "./CopyButton";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Unable to shorten this URL. Please try again.";
  }

  return "Unable to shorten this URL. Please try again.";
}

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: urlsApi.shorten,
    onSuccess: () => {
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ url });
  }

  const shortUrl = mutation.data?.data.shortUrl;

  return (
    <section className="mt-8 w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="long-url">Long URL</label>
        <input
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          id="long-url"
          type="text"
          placeholder="www.example.com/your-long-url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {mutation.isError && <p className="mt-3 text-sm text-red-600" role="alert">{getErrorMessage(mutation.error)}</p>}

      {shortUrl && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a className="break-all font-medium text-blue-600 hover:underline" href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
          <CopyButton text={shortUrl} />
        </div>
      )}
    </section>
  );
}
