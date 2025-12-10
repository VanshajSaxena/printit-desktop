import { ActivityIcon } from "@components/icons/ActivityIcon";
import { PulseCard } from "./PulseCard";

export function PrinterStatusCard({
  heroText,
  subText,
}: {
  heroText: string;
  subText: string;
}) {
  return (
    <PulseCard
      heroTextStyle="text-xl leading-8 font-semibold text-success-content"
      title="Printer Status"
      heroText={heroText}
      subText={subText}
      icon={<ActivityIcon size={20} className="stroke-secondary-content" />}
    ></PulseCard>
  );
}
