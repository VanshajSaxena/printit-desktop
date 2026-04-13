import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import { Button } from "@components/buttons/Button";
import { Link } from "lucide-react";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string | undefined;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  username,
}: QRCodeDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!username) {
      setQrDataUrl("");
      return;
    }

    const url = `https://app.printit.ink/printers/@${username}`;
    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [username]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-xl border border-border bg-background p-0 select-none sm:max-w-180">
        <DialogTitle className="sr-only">QR Code</DialogTitle>

        <div className="flex">
          <div className="flex w-[320px] flex-col border-r border-border bg-background p-5">
            <span className="text-base font-medium text-foreground">
              QR Code
            </span>

            <div className="mt-6 flex flex-1 flex-col items-center justify-center">
              <div className="flex items-center justify-center rounded-xl bg-white p-6">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code for print orders"
                    className="h-44 w-44"
                  />
                ) : (
                  <div className="h-44 w-44 animate-pulse rounded bg-muted-foreground/20" />
                )}
              </div>

              {username && (
                <div className="mt-4 flex max-w-full items-center gap-2 text-xs text-muted-foreground">
                  <span className="shrink-0">
                    <Link size={14} className="shrink-0" />
                  </span>
                  <span className="truncate">
                    {`app.printit.ink/printers/@${username}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                What&apos;s this?
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Use this QR Code to allow customers to send their print orders.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Print this to easily make it accessible to customers.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                size="md"
                icon={<Download size={18} />}
                className="hover:bg-accent bg-muted text-foreground"
              >
                Download
              </Button>

              <Button
                size="md"
                icon={<Printer size={18} />}
                className="hover:bg-accent bg-muted text-foreground"
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
