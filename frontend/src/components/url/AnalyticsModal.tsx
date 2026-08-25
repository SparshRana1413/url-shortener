import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as urlsApi from "../../api/urls";

type AnalyticsModalProps = {
  shortCode: string;
  onClose: () => void;
};

export default function AnalyticsModal({
  shortCode,
  onClose,
}: AnalyticsModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", shortCode, "7d"],
    queryFn: () => urlsApi.getAnalytics(shortCode, "7d"),
  });

  const analytics = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Analytics
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-900"
            aria-label="Close analytics"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <p className="py-12 text-center text-slate-600">
            Loading analytics...
          </p>
        )}

        {isError && (
          <p className="py-12 text-center text-red-600" role="alert">
            Unable to load analytics. Please try again.
          </p>
        )}

        {!isLoading && !isError && analytics && (
          <div className="space-y-8">
            <div>
              <p className="text-sm text-slate-500">Total clicks</p>
              <p className="text-4xl font-bold text-slate-900">
                {analytics.totalClicks}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Clicks per day
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.clicksByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Devices
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md bg-slate-100 p-4 text-center">
                  <p className="text-sm text-slate-500">Mobile</p>
                  <p className="text-2xl font-semibold">
                    {analytics.deviceBreakdown.mobile}
                  </p>
                </div>

                <div className="rounded-md bg-slate-100 p-4 text-center">
                  <p className="text-sm text-slate-500">Desktop</p>
                  <p className="text-2xl font-semibold">
                    {analytics.deviceBreakdown.desktop}
                  </p>
                </div>

                <div className="rounded-md bg-slate-100 p-4 text-center">
                  <p className="text-sm text-slate-500">Tablet</p>
                  <p className="text-2xl font-semibold">
                    {analytics.deviceBreakdown.tablet}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}