import type { ReactNode } from "react";

export interface RequestListContainerProps {
  children: ReactNode;
}
export function RequestListContainer(props: RequestListContainerProps) {
  const children = props.children;
  return (
    <>
      <div className="h-full max-h-1/2 min-h-96 w-full min-w-4xl overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)] 2xl:max-h-2/3">
        {children}
      </div>
    </>
  );
}
