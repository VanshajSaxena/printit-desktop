import type { ReactNode } from 'react';

export interface RequestListContainerProps {
  children: ReactNode;
}
export function RequestListContainer(props: RequestListContainerProps) {
  const children = props.children;
  return (
    <>
      <div className="border border-border-default w-full rounded-3xl min-w-4xl h-full min-h-96 max-h-1/2 2xl:max-h-2/3">
        {children}
      </div>
    </>
  );
}
