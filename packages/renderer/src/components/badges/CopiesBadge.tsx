import { CopiesIcon } from '@components/icons/CopiesIcon';
import { Badge } from './Badge';
import type { BadgeProps } from './types';

export function CopiesBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<CopiesIcon size={16}></CopiesIcon>}
      label="Copies"
      count={props.count}
    ></Badge>
  );
}
