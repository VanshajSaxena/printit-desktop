import { PulseCard } from "./PulseCard";
import { StackIcon } from "@components/icons/StackIcon";
export function SheetsPrintedCard({
  subText,
  heroText,
}: {
  subText: string;
  heroText: string;
}) {
  return (
    <PulseCard
      title="Sheets Printed"
      heroText={heroText}
      subText={subText}
      icon={<StackIcon size={20} className="stroke-secondary-content" />}
    ></PulseCard>
  );
}
