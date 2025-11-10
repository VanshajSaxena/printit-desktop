import { CopiesIcon } from '@components/icons/CopiesIcon';
import { Badge } from './Badge';

export function CopiesBadge() {
  return (
    <Badge icon={<CopiesIcon size={16}></CopiesIcon>} name="Copies"></Badge>
  );
}
