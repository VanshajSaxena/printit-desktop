import { PulseCard } from "./PulseCard";
import { StackIcon } from "@components/icons/StackIcon";
export function SheetsPrintedCard() {
  return (
    <PulseCard
      title="Sheets Printed"
      heroText="24"
      subText="Today"
      icon={<StackIcon size={20} className="stroke-secondary-content" />}
    ></PulseCard>
  );
}
