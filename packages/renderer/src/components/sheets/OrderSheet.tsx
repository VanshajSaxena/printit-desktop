import type { TransactionObject } from "@/store/events";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { BnWBadge } from "../badges/BnWBadge";
import { ColorPalatteBadge } from "../badges/ColorPalatteBadge";
import { CopiesBadge } from "../badges/CopiesBadge";
import { PagesBadge } from "../badges/PagesBadge";
import { SheetsBadge } from "../badges/SheetsBadge";
import { PrintButton } from "../buttons/PrintButton";
import { RejectButton } from "../buttons/RejectButton";
import { formatRelativeTime } from "../formatRelativeTime";
import { ActivityIcon } from "../icons/ActivityIcon";
import { FileIcon } from "../icons/FileIcon";
import { ListIcon } from "../icons/ListIcon";
import { PDFFileIcon } from "../icons/PDFFileIcon";
import { Badge } from "../ui/badge";

function DocumentItem({ job }: { job: TransactionObject["jobs"][0] }) {
  const pageCount = job.document.pageCount;
  const status = job.status;
  return (
    <div className="w-full rounded-xl outline -outline-offset-1 outline-border-default">
      <div className="flex justify-between border-b border-border-default p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-md bg-success px-1.5 py-1.25 text-success-content">
            <PDFFileIcon size={20} />
          </div>
          {job.document.filename}
        </div>
        {status === "PENDING" && (
          <Badge variant={"ghost"} className="bg-success text-success-content">
            New
          </Badge>
        )}
        {(status === "QUEUED" ||
          status === "DOWNLOADING" ||
          status === "READY" ||
          status === "SPOOLED") && (
          <Badge variant={"ghost"} className="bg-queued text-queued-content">
            Queued
          </Badge>
        )}
        {status === "ERROR" && (
          <Badge variant={"ghost"} className="bg-error text-error-content">
            Error
          </Badge>
        )}
        {status === "PRINTING" && (
          <Badge
            variant={"ghost"}
            className="bg-printing text-printing-content"
          >
            Printing
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-4 px-4 py-3">
        <PagesBadge count={pageCount}></PagesBadge>
        <CopiesBadge count={job.copyCount}></CopiesBadge>
        {job.outputColor === "Color" ? (
          <ColorPalatteBadge></ColorPalatteBadge>
        ) : (
          <BnWBadge></BnWBadge>
        )}
      </div>
    </div>
  );
}

export function OrderSheet({
  open,
  onOpenChange,
  transactionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: number;
}) {
  const dispatch = useTransactionStore((store) => store.dispatch);
  const transaction = useTransactionStore(
    (store) => store.state.transactions[transactionId],
  ) as TransactionObject | undefined;
  const printQueueStatus = useTransactionStore(
    (store) => store.state.printQueue.status,
  );

  useEffect(() => {
    if (!transaction && open) {
      onOpenChange(false);
    }
  }, [transaction, open, onOpenChange]);

  if (!transaction) {
    return null;
  }
  const formattedDate = formatRelativeTime(transaction.createdAt);
  const isColorOnly = transaction.jobs.every((job) => {
    return job.outputColor === "Color";
  });

  const isBnWOnly = transaction.jobs.every((job) => {
    return job.outputColor === "Grayscale";
  });

  const sheetCount = transaction.jobs.reduce((total, currentJob) => {
    return total + currentJob.document.pageCount * currentJob.copyCount;
  }, 0);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="top-[20vh] flex h-[80dvh] w-[60dvw] flex-col gap-0 rounded-tl-3xl border-t border-border-default bg-secondary select-none data-[state=closed]:duration-75 data-[state=closed]:fade-out-75 data-[state=open]:duration-75 data-[state=open]:fade-in-75 sm:max-w-none">
        <SheetHeader className="flex flex-col gap-4 border-b border-border-default p-5">
          <SheetTitle className="flex items-center gap-2.5 text-sm">
            Order
            <ChevronRight size={20}></ChevronRight>
            <p className="text-secondary-content">
              {transaction.friendlyId.substring(0, 8)}
            </p>
          </SheetTitle>
          <div className="flex items-center gap-3">
            <FileIcon size={24} />
            <p className="text-lg font-semibold">
              {transaction.jobs[0].document.filename}
            </p>
            <p className="text-sm font-semibold text-secondary-content">
              {formattedDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SheetsBadge count={sheetCount} />
            {isColorOnly && <ColorPalatteBadge />}
            {isBnWOnly && <BnWBadge />}
          </div>
          <SheetDescription className="hidden"></SheetDescription>
        </SheetHeader>
        <div className="grid min-h-0 flex-1 grid-cols-[3fr_1fr]">
          <div className="flex min-h-0 w-full flex-col gap-6 overflow-y-auto px-6 py-8">
            <div className="flex items-center gap-2">
              <ListIcon size={24} />
              <p>Document List</p>
            </div>

            <div className="mx-4 flex flex-col items-center gap-6">
              {transaction.jobs.map((job) => {
                return <DocumentItem key={job.id} job={job}></DocumentItem>;
              })}
            </div>
          </div>

          <div className="h-full border-l border-border-default px-5 py-6">
            <div className="flex flex-col gap-6 border-b border-border-default py-6">
              <div className="flex gap-2">
                <ActivityIcon />
                Actions
              </div>

              <div className="flex flex-wrap items-center justify-evenly gap-2">
                <RejectButton text="Reject All" />
                <PrintButton
                  text="Print All"
                  onClick={() => {
                    dispatch({
                      type: "user:print:transaction",
                      transactionId: transaction.id,
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 border-b border-border-default py-6">
              <div className="flex gap-2">Status</div>

              <div className="flex flex-wrap items-center justify-evenly gap-2 lowercase">
                {transaction.status} {printQueueStatus}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
