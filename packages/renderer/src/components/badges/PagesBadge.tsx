import { PagesIcon } from '@components/icons/PageIcon';
import { Badge } from './Badge';
import type { BadgeProps } from './types';

export function PagesBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<PagesIcon size={16}></PagesIcon>}
      label="Pages"
      count={props.count}
    ></Badge>
  );
}
