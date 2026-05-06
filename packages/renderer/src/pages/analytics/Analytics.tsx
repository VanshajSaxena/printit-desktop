import { client } from "@/api/client";
import { TopBar } from "@/components/layout/TopBar";
import { useState } from "react";
import { HistoryTable } from "../HistoryTable";

export function Analytics() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = client.useQuery(
    "get",
    "/api/v1/transactions",
    {
      params: {
        query: {
          statuses: ["COMPLETED", "ERROR", "REJECTED"],
          page,
          pageSize,
        },
      },
    },
    { refetchOnWindowFocus: false },
  );

  const meta = data?.meta;
  const transactions = data?.data ?? [];

  return (
    <>
      <TopBar title="Analytics" />
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-primary-content">
            Transaction Analytics
          </h1>
          <p className="text-sm text-secondary-content">
            View and track all processed, queued, and completed print jobs.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border-default bg-secondary/50 px-4 py-3">
          <div className="text-sm text-secondary-content">
            Page <span className="text-primary-content">{meta?.page}</span> of{" "}
            {meta?.totalPages ?? 1}
          </div>

          <div className="text-sm text-secondary-content">
            Total transactions:{" "}
            <span className="text-primary-content">{meta?.total ?? 0}</span>
          </div>
        </div>

        <div className="flex-1 rounded-lg bg-primary">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-secondary-content">
              Loading transactions...
            </div>
          ) : (
            <HistoryTable data={transactions} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="text-sm text-secondary-content hover:text-primary-content disabled:opacity-40"
            onClick={() => {
              setPage((p) => Math.max(p - 1, 1));
            }}
            disabled={page === 1}
          >
            Previous
          </button>

          <div className="text-sm text-secondary-content">
            Page {page} / {meta?.totalPages ?? 1}
          </div>

          <button
            className="text-sm text-secondary-content hover:text-primary-content disabled:opacity-40"
            onClick={() => {
              setPage((p) =>
                meta?.totalPages ? Math.min(p + 1, meta.totalPages) : p,
              );
            }}
            disabled={page === meta?.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
