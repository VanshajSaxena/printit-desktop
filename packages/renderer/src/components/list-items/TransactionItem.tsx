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
  id,
  friendlyId,
  jobs,
  createdAt,
  status,
}: TransactionObject) {
  let title = jobs[0].document.filename;
  if (title.length > 30) {
    title = title.slice(0, 30).concat("...");
  }
  if (jobs.length > 1) {
    title = title.concat(" & ", (jobs.length - 1).toString(), " more");
  }

  const dispatch = useTransactionStore((store) => store.dispatch);
  const formattedDate = formatRelativeTime(createdAt);
  const filesCount = jobs.length;
  const isColorOnly = jobs.every((job) => {
    return job.outputColor === "COLOR";
  });
  const isBnWOnly = jobs.every((job) => {
    return job.outputColor === "GRAYSCALE";
  });
  return (
    <>
      <div className="flex h-fit w-full flex-col gap-2 border-t border-border-default px-4 py-2 first:border-t-0 last:border-b hover:bg-primary-content/5">
        <div className="flex h-fit w-full items-center justify-between">
          <div className="flex h-fit items-center gap-4">
            <ListIconFile size={24}></ListIconFile>
            <div className="flex h-fit flex-col gap-1 pb-0.5">
              <div className="flex size-fit gap-2">
                <h3 className="text-base leading-6 text-nowrap text-primary-content">
                  {title}
                </h3>
                {status === "PENDING" && <NewItemBadge />}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <GridScanIcon></GridScanIcon>
                  <p className="text-xs leading-4 text-secondary-content">
                    {friendlyId}
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
                  <RejectButton />
                  <PrintButton
                    onClick={() => {
                      dispatch({
                        type: "user:print",
                        transactionId: id,
                      });
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex gap-4">
              <KebabButton></KebabButton>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex h-fit w-full gap-4 px-10.5">
            <SheetsBadge />
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
            {status === "DOWNLOADED" && (
              <p className="italic">Sending files to printer...</p>
            )}
            {status === "PRINTING" && <p className="italic">Printing...</p>}
          </div>
        </div>
      </div>
    </>
  );
}
