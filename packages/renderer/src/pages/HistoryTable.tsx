import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@components/formatRelativeTime";
import { ListIconFile } from "@components/icons/ListIconFile";

interface Transaction {
  id: number;
  friendlyId: string;
  createdAt: string;
  status:
    | "PENDING"
    | "QUEUED"
    | "PRINTING"
    | "COMPLETED"
    | "REJECTED"
    | "ERROR";
  jobs: {
    copyCount: number;
    document: {
      filename: string;
      pageCount: number;
    };
  }[];
}

function getStatusStyles(status: Transaction["status"]) {
  switch (status) {
    case "COMPLETED":
      return "bg-success text-success-content";
    case "REJECTED":
    case "ERROR":
      return "bg-error text-error-content";
    case "PRINTING":
      return "bg-printing text-printing-content";
    default:
      return "bg-queued text-queued-content";
  }
}

export function HistoryTable({ data }: { data: Transaction[] }) {
  return (
    <div className="rounded-xl border border-border-default bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Transaction History
        </h2>
        <p className="text-sm text-muted-foreground">
          All processed transactions
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40">
              <TableHead className="w-[40%]">Document</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}

            {data.map((tx) => {
              const title = tx.jobs[0]?.document.filename ?? "Untitled";

              const filesCount = tx.jobs.length;

              const sheetCount = tx.jobs.reduce((total, job) => {
                return total + job.document.pageCount * job.copyCount;
              }, 0);

              return (
                <TableRow
                  key={tx.id}
                  className="cursor-pointer hover:bg-primary-content/5"
                >
                  {/* Document */}
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <ListIconFile size={20} />
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm font-medium text-foreground">
                          {title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {filesCount} file(s)
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Friendly ID */}
                  <TableCell>
                    <span className="text-sm text-secondary-content">
                      {tx.friendlyId.slice(0, 8)}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="ghost"
                      className={getStatusStyles(tx.status)}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>

                  {/* Details */}
                  <TableCell>
                    <span className="text-sm text-secondary-content">
                      {sheetCount} sheets
                    </span>
                  </TableCell>

                  {/* Time */}
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeTime(tx.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
