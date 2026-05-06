import { CopiesBadge } from "@/components/badges/CopiesBadge";
import { SheetsBadge } from "@/components/badges/SheetsBadge";
import { formatRelativeTime } from "@/components/formatRelativeTime";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Layers3,
  XCircle,
} from "lucide-react";

export type TransactionStatus =
  | "PENDING"
  | "QUEUED"
  | "PRINTING"
  | "COMPLETED"
  | "REJECTED"
  | "ERROR";

export interface Transaction {
  id: number;
  friendlyId: string;
  createdAt: string;
  status: TransactionStatus;
  jobs: {
    copyCount: number;
    document: {
      filename: string;
      pageCount: number;
    };
  }[];
}

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const STATUS_CONFIG: Record<TransactionStatus, StatusConfig> = {
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  ERROR: {
    label: "Error",
    icon: AlertCircle,
    badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    badge: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  QUEUED: {
    label: "Queued",
    icon: Clock,
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  PRINTING: {
    label: "Printing",
    icon: Clock,
    badge:
      "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="ghost"
      className={cn(
        "gap-1.5 border px-2 py-0.5 text-xs font-medium",
        config.badge,
      )}
    >
      <Icon className="size-3 shrink-0" />
      {config.label}
    </Badge>
  );
}

function DocumentCell({ tx }: { tx: Transaction }) {
  const primaryFilename = tx.jobs[0]?.document.filename ?? "Untitled";
  const extraCount = tx.jobs.length - 1;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Layers3 className="size-4 text-primary-content" />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <p
          className="truncate text-sm font-medium text-foreground"
          title={primaryFilename}
        >
          {primaryFilename}
        </p>
        {extraCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            +{extraCount} more file{extraCount !== 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function DetailPills({ tx: transaction }: { tx: Transaction }) {
  const sheetCount = transaction.jobs.reduce(
    (sum, job) => sum + job.document.pageCount * job.copyCount,
    0,
  );
  const copyCount = transaction.jobs.reduce(
    (sum, job) => sum + job.copyCount,
    0,
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      <SheetsBadge count={sheetCount}></SheetsBadge>
      <CopiesBadge count={copyCount}></CopiesBadge>
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow className="pointer-events-none">
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-40 rounded" />
            <Skeleton className="h-2.5 w-16 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-3.5 w-20 rounded" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3.5 w-16 rounded" />
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={5}>
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <FileText className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              No transactions found
            </p>
            <p className="text-xs text-muted-foreground">
              Completed, rejected, and errored transactions will appear here.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface HistoryTableProps {
  data: Transaction[];
  isLoading?: boolean;
  skeletonRows?: number;
}

export function HistoryTable({
  data,
  isLoading = false,
  skeletonRows = 8,
}: HistoryTableProps) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Transaction History
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            All processed, rejected, and errored transactions
          </p>
        </div>

        {!isLoading && data.length > 0 && (
          <span className="rounded-full bg-tertiary/70 px-2.5 py-1 text-xs font-medium text-secondary-content">
            {data.length} result{data.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-[40%] pl-5">Document</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="pr-5 text-right">Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              // eslint-disable-next-line react-x/no-array-index-key
              <SkeletonRow key={i} />
            ))
          ) : data.length === 0 ? (
            <EmptyState />
          ) : (
            data.map((tx) => (
              <TableRow
                key={tx.id}
                className="group cursor-pointer transition-colors hover:bg-primary/3"
              >
                <TableCell className="pl-5">
                  <DocumentCell tx={tx} />
                </TableCell>

                <TableCell>
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {tx.friendlyId.slice(0, 8)}
                  </code>
                </TableCell>

                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>

                <TableCell>
                  <DetailPills tx={tx} />
                </TableCell>

                <TableCell className="pr-5 text-right">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(tx.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
