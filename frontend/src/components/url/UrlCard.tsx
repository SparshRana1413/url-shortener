import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as urlsApi from "../../api/urls";
import type { Url } from "../../api/urls";
import CopyButton from "./CopyButton";
import AnalyticsModal from "./AnalyticsModal";

type UrlCardProps = {
  url: Url;
};

export default function UrlCard({ url }: UrlCardProps) {
  const queryClient = useQueryClient();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => urlsApi.deleteUrl(url.shortCode),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["urls"],
      });
    },
  });

  const formattedDate = new Date(url.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <>
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Short URL */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="break-all font-medium text-blue-600 hover:underline"
              href={url.shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {url.shortUrl}
            </a>

            <CopyButton text={url.shortUrl} />
          </div>

          {/* Original URL */}
          <p
            className="truncate text-sm text-slate-500"
            title={url.originalUrl}
          >
            {url.originalUrl}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>{url.clickCount} clicks</span>
            <span>{formattedDate}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setShowAnalytics(true)}
            >
              View Analytics
            </button>

            <button
              type="button"
              className="rounded-md border border-red-300 px-3 py-2 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>

          {/* Delete error */}
          {deleteMutation.isError && (
            <p className="text-sm text-red-600" role="alert">
              Unable to delete this URL. Please try again.
            </p>
          )}
        </div>
      </article>

      {showAnalytics && (
        <AnalyticsModal
          shortCode={url.shortCode}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </>
  );
}