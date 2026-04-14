import { client } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Button } from "@components/buttons/Button";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RejectTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: number;
  friendlyId: string;
}

const REJECTION_REASONS = [
  "Printer is out of ink/toner",
  "Printer is currently offline/jammed",
  "Files are corrupted or unreadable",
  "Store is closing soon",
  "Requires special paper not in stock",
  "Inappropriate content / Policy violation",
];

export function RejectTransactionDialog({
  open,
  onOpenChange,
  transactionId,
  friendlyId,
}: RejectTransactionDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useTransactionStore((store) => store.dispatch);
  const rejectionMutation = client.useMutation(
    "patch",
    "/api/v1/transactions/{id}/status",
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedReason(null);
      setCustomReason("");
    }
    onOpenChange(newOpen);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    await rejectionMutation.mutateAsync(
      {
        params: { path: { id: transactionId } },
        body: {
          status: "REJECTED",
          reason: selectedReason ?? customReason,
        },
      },
      {
        onSuccess: () => {
          dispatch({ type: "user:reject:transaction", transactionId });
          toast.success(`Order ${friendlyId} was rejected.`);
        },
        onError: () => {
          toast.error("Failed to reject this order. Please try again.");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const isSubmitDisabled = !selectedReason && customReason.trim().length < 6;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl border-border bg-background sm:max-w-125">
        <DialogHeader className="gap-3">
          <div className="text-destructive flex items-center gap-2.5">
            <XCircle className="h-5 w-5 shrink-0" />
            <DialogTitle>Reject Order {friendlyId.substring(0, 8)}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            The customer will be notified that their order has been canceled.
            Providing a reason helps them understand what happened.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-3">
          <div className="flex flex-col gap-3">
            <label className="text-sm leading-none font-medium text-foreground">
              Common reasons
            </label>
            <div className="flex flex-wrap gap-2.5">
              {REJECTION_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <Badge
                    key={reason}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedReason(null);
                      } else {
                        setSelectedReason(reason);
                        setCustomReason("");
                      }
                    }}
                  >
                    {reason}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="custom-reason"
              className="text-sm leading-none font-medium text-foreground"
            >
              Custom reason (Optional)
            </label>
            <Textarea
              id="custom-reason"
              placeholder="Let the customer know why this order can't be processed..."
              className="resize-none border-border bg-background placeholder:text-muted-foreground"
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (e.target.value.trim() !== "") {
                  setSelectedReason(null); // Clear pill selection if typing custom reason
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            size="md"
            onClick={() => {
              handleOpenChange(false);
            }}
            disabled={isSubmitting}
            className="bg-tertiary text-primary-content outline -outline-offset-1 outline-border-default"
          >
            Keep Order
          </Button>
          <Button
            size="md"
            onClick={() => {
              void handleReject();
            }}
            disabled={isSubmitDisabled || isSubmitting}
            className="outline-none hover:text-error-content not-disabled:hover:bg-error disabled:text-secondary-content"
          >
            {isSubmitting ? "Rejecting..." : "Reject Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
