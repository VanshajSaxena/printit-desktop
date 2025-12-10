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
      heroTextStyle="text-2xl leading-8 font-semibold text-primary-content"
      title="Sheets Printed"
      heroText={heroText}
      subText={subText}
      icon={<StackIcon size={20} />}
    ></PulseCard>
  );
}
