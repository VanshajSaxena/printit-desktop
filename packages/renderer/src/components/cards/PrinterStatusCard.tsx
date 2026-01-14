import { ActivityIcon } from "@components/icons/ActivityIcon";
import { PulseCard } from "./PulseCard";
import { useQuery } from "@tanstack/react-query";
import { getPrintQueueStatus } from "@app/preload";

export function PrinterStatusCard({ subText }: { subText: string }) {
  const { data } = useQuery({
    queryKey: ["printer-status"],
    queryFn: () => getPrintQueueStatus("hp smart tank 580"),
    refetchInterval: 1000,
  });

  console.log(data);
  const response = data?.success ? data.data : "None";
  const heroText = response ?? "NONE";
  return (
    <PulseCard
      heroTextStyle="text-xl leading-8 font-semibold text-green-600"
      title="Printer Status"
      heroText={heroText}
      subText={subText}
      icon={<ActivityIcon size={20} className="stroke-secondary-content" />}
    ></PulseCard>
  );
}
