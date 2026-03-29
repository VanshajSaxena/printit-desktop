import { ActivityIcon } from "@components/icons/ActivityIcon";
import { PulseCard } from "./PulseCard";
import { useTransactionStore } from "@/store/useTransactionStore";
import clsx from "clsx";

export function PrinterStatusCard({ subText }: { subText: string }) {
  const status = useTransactionStore((store) => store.state.printQueue.status);
  const statusStyle = {
    "text-success-content": status === "idle",
    "text-queued-content": status === "working" || status === "spooled",
    "text-printing-content": status === "printing",
    "text-error-content": status === "error" || status === "stalled",
  };
  return (
    <PulseCard
      heroTextStyle={clsx(
        "text-xl leading-8 font-semibold capitalize",
        statusStyle,
      )}
      title="Printer Status"
      heroText={status}
      subText={subText}
      icon={<ActivityIcon size={20} className="stroke-secondary-content" />}
    ></PulseCard>
  );
}
