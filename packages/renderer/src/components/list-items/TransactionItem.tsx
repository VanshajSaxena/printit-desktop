import { BnWBadge } from "@components/badges/BnWBadge";
import { ColorPalatteBadge } from "@components/badges/ColorPalatteBadge";
import { FilesBadge } from "@components/badges/FilesBadge";
import { SheetsBadge } from "@components/badges/SheetsBadge";
import { KebabButton } from "@components/buttons/KebabButton";
import { RejectTransactionDialog } from "@components/dialogs/RejectTransactionDialog";
import { formatRelativeTime } from "@components/formatRelativeTime";
import { ClockIcon } from "@components/icons/ClockIcon";
import { GridScanIcon } from "@components/icons/GridScanIcon";
import { ListIconFile } from "@components/icons/ListIconFile";
import type { TransactionObject } from "@store/events";
import { useTransactionStore } from "@store/useTransactionStore";
import { IconTrashX } from "@tabler/icons-react";
import { PrinterIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function TransactionItem({
  onClick,
  id,
  friendlyId,
  jobs,
  createdAt,
  status,
}: TransactionObject & { onClick: () => void }) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const title = jobs[0].document.filename;
  const dispatch = useTransactionStore((store) => store.dispatch);
  const formattedDate = formatRelativeTime(createdAt);
  const filesCount = jobs.length;

  const isColorOnly = jobs.every((job) => {
    return job.outputColor === "Color";
  });
  const isBnWOnly = jobs.every((job) => {
    return job.outputColor === "Grayscale";
  });
  const sheetCount = jobs.reduce((total, currentJob) => {
    return total + currentJob.document.pageCount * currentJob.copyCount;
  }, 0);
  const estTime = new Date(Date.now() + sheetCount * 5_000 + 10_000);

  const inQueue =
    status === "QUEUED" ||
    status === "DOWNLOADING" ||
    status === "READY" ||
    status === "SPOOLED";
  const hasError =
    status === "ERROR" ||
    status === "TIMEOUT" ||
    status === "DISAPPEARED" ||
    status === "CRITICAL";

  return (
    <>
      <div
        onClick={onClick}
        className="flex h-fit max-w-full min-w-0 cursor-pointer flex-col gap-2 border-t border-border-default px-4 py-2 first:border-t-0 last:border-b hover:bg-primary-content/5"
      >
        <div className="flex h-fit max-w-full min-w-0 items-center justify-between">
          <div className="flex h-fit min-w-0 items-center gap-4">
            <ListIconFile size={24}></ListIconFile>
            <div className="flex h-fit min-w-0 flex-col gap-1 pb-0.5">
              <div className="flex max-w-full min-w-0 gap-2">
                <h3 className="truncate text-base leading-6 text-nowrap text-primary-content">
                  {title}
                </h3>
                {status === "PENDING" && (
                  <Badge
                    variant={"ghost"}
                    className="bg-success text-success-content"
                  >
                    New
                  </Badge>
                )}
                {inQueue && (
                  <Badge
                    variant={"ghost"}
                    className="bg-queued text-queued-content"
                  >
                    Queued
                  </Badge>
                )}
                {hasError && (
                  <Badge
                    variant={"ghost"}
                    className="bg-error text-error-content"
                  >
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <GridScanIcon></GridScanIcon>
                  <p className="text-xs leading-4 text-secondary-content">
                    {friendlyId.substring(0, 8)}
                  </p>
                </div>
                <p className="text-xs leading-4 text-primary-content">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5">
            {status === "PENDING" && (
              <div className="flex gap-4">
                <Button
                  variant={"destructive"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRejectDialogOpen(true);
                  }}
                >
                  <IconTrashX />
                  Reject
                </Button>
                <Button
                  className="hover:bg-success hover:text-success-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                      type: "user:print:transaction",
                      transactionId: id,
                    });
                  }}
                >
                  <PrinterIcon />
                  Print
                </Button>
              </div>
            )}
            {inQueue && (
              <Button className="rounded-xl hover:bg-success hover:text-success-content">
                <Spinner />
                Printing
              </Button>
            )}
            <div className="flex gap-4">
              <KebabButton
                onClick={(e) => {
                  e.stopPropagation();
                  // will show a context menu
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex h-fit w-full gap-4 px-10.5">
            <SheetsBadge count={sheetCount} />
            <FilesBadge count={filesCount} />
            {isColorOnly && <ColorPalatteBadge />}
            {isBnWOnly && <BnWBadge />}
          </div>
          <div className="flex items-center gap-2 text-xs leading-4 text-nowrap text-secondary-content">
            {status === "PENDING" && (
              <>
                <ClockIcon size={18} />
                <p>
                  Prints {formatRelativeTime(estTime.toISOString(), "short")}
                </p>
              </>
            )}
            {status === "QUEUED" && (
              <p className="italic">Preparing your files...</p>
            )}
            {status === "DOWNLOADING" && (
              <p className="italic">Downloading files...</p>
            )}
            {status === "READY" && (
              <p className="italic">Sending files to printer...</p>
            )}
            {status === "PRINTING" && <p className="italic">Printing...</p>}
          </div>
        </div>
      </div>

      <RejectTransactionDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        transactionId={id}
        friendlyId={friendlyId}
      />
    </>
  );
}
