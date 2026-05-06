import { client } from "@/api/client";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { HistoryTable } from "../HistoryTable";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className={clsx("gap-1.5", page === 1 && "invisible")}
      >
        <ChevronLeft className="size-3.5" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page <span className="font-medium text-primary-content">{page}</span>{" "}
          of{" "}
          <span className="font-medium text-primary-content">{totalPages}</span>
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page === totalPages}
        className="gap-1.5"
      >
        Next
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}

const PAGE_SIZE = 8;

export function Analytics() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = client.useQuery(
    "get",
    "/api/v1/transactions",
    {
      params: {
        query: {
          statuses: ["COMPLETED", "ERROR", "REJECTED"],
          page,
          pageSize: PAGE_SIZE,
        },
      },
    },
    { refetchOnWindowFocus: false },
  );

  if (!data) {
    return null;
  }
  const meta = data.meta;
  const transactions = data.data;

  return (
    <div>
      <TopBar title="Analytics" />

      <div className="flex h-full max-w-full min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Transaction Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              View and track all processed, queued, and completed print jobs.
            </p>
          </div>

          <div className="bg-card flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Activity className="size-3.5 text-primary-content" />
            <span className="text-xs font-medium text-foreground">
              {meta.total} total
            </span>
          </div>
        </div>

        <HistoryTable
          data={transactions}
          isLoading={isLoading}
          skeletonRows={PAGE_SIZE}
        />

        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onPrev={() => {
            setPage((p) => Math.max(p - 1, 1));
          }}
          onNext={() => {
            setPage((p) => Math.min(p + 1, meta.totalPages));
          }}
        />
      </div>
    </div>
  );
}
