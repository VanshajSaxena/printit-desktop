import { client } from "@/api/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Button } from "@components/buttons/Button";
import { Download, Link as LinkIcon, Printer } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({ open, onOpenChange }: QRCodeDialogProps) {
  const { data, isLoading } = client.useQuery(
    "get",
    "/api/v1/vendors/me",
    {},
    { staleTime: 300_000, refetchOnWindowFocus: false },
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const dispatch = useTransactionStore((store) => store.dispatch);

  const username = data?.username;

  const printerUrl = useMemo(() => {
    if (!username) return "";
    const domain = import.meta.env.PROD
      ? "app.printit.ink"
      : "master--printit-app.netlify.app";
    return `https://${domain}/printers/@${username}`;
  }, [username]);

  useEffect(() => {
    if (!printerUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(printerUrl, {
      width: 240,
      margin: 1,
      type: "image/png",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [printerUrl]);

  const isGenerating = isLoading || (!!username && !qrDataUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-xl border border-border bg-background p-0 select-none sm:max-w-175">
        <DialogTitle className="sr-only">Your Printer QR Code</DialogTitle>

        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full flex-col border-b border-border bg-background p-6 sm:w-[320px] sm:border-r sm:border-b-0">
            <span className="text-base font-medium text-foreground">
              QR Code
            </span>

            <div className="mt-6 flex flex-1 flex-col items-center justify-center">
              <div className="flex h-56 w-56 items-center justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                {isGenerating ? (
                  <div className="h-44 w-44 animate-pulse rounded-lg bg-muted" />
                ) : (
                  <img
                    src={qrDataUrl}
                    alt="QR Code for print orders"
                    className="h-44 w-44 object-contain"
                  />
                )}
              </div>

              <div className="mt-6 flex w-full max-w-full items-center justify-center gap-2 text-xs text-muted-foreground">
                <LinkIcon size={14} className="shrink-0" />
                {isGenerating ? (
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                ) : (
                  <a
                    href={printerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-foreground hover:underline"
                  >
                    {printerUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                What&apos;s this?
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Use this QR Code to allow customers to easily access your
                profile and send their print orders directly to you.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Download or print this code and place it somewhere easily
                accessible for your customers.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6">
              <Button
                size="md"
                icon={<Download size={18} />}
                onClick={() => {
                  dispatch({ type: "user:qr:generate-pdf", qrDataUrl });
                }}
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
