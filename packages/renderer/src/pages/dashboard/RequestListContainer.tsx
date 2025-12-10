import type { ReactNode } from "react";

export interface RequestListContainerProps {
  children: ReactNode;
}
export function RequestListContainer(props: RequestListContainerProps) {
  const children = props.children;
  return (
    <>
      <div className="h-full w-full overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
        {children}
      </div>
    </>
  );
}
