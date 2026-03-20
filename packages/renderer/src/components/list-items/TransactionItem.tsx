import { BnWBadge } from "@components/badges/BnWBadge";
import { ColorPalatteBadge } from "@components/badges/ColorPalatteBadge";
import { FilesBadge } from "@components/badges/FilesBadge";
import { SheetsBadge } from "@components/badges/SheetsBadge";
import { KebabButton } from "@components/buttons/KebabButton";
import { PrintButton } from "@components/buttons/PrintButton";
import { RejectButton } from "@components/buttons/RejectButton";
import { formatRelativeTime } from "@components/formatRelativeTime";
import { ClockIcon } from "@components/icons/ClockIcon";
import { GridScanIcon } from "@components/icons/GridScanIcon";
import { ListIconFile } from "@components/icons/ListIconFile";
import type { TransactionObject } from "@store/events";
import { useTransactionStore } from "@store/useTransactionStore";
import { NewItemBadge } from "./NewItemBadge";

export function TransactionItem({
  onClick,
  id,
  friendlyId,
  jobs,
  createdAt,
  status,
}: TransactionObject & { onClick: () => void }) {
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
                {status === "PENDING" && <NewItemBadge />}
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
            <div className="flex gap-4">
              {status === "PENDING" && (
                <>
                  <RejectButton
                    onClick={(e) => {
                      e.stopPropagation();
                      // reject logic here
                    }}
                  />
                  <PrintButton
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: "user:print:transaction",
                        transactionId: id,
                      });
                    }}
                  />
                </>
              )}
            </div>
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
                <p>Est. 10 mins</p>
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
    </>
  );
}
