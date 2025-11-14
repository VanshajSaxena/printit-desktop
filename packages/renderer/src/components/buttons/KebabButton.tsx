import { KebabIcon } from '@components/icons/KebabIcon';

export function KebabButton() {
  return (
    <>
      <div className="h-fit w-fit p-[0.5625rem] outline -outline-offset-1 rounded-xl bg-tertiary outline-border-default">
        <KebabIcon></KebabIcon>
      </div>
    </>
  );
}
