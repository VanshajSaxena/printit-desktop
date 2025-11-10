import { ColorPalatteIcon } from '@components/icons/ColorPalatteIcon';
import { Badge } from './Badge';

export function ColorPalatteBadge() {
  return (
    <Badge
      icon={<ColorPalatteIcon size={16}></ColorPalatteIcon>}
      name="Color"
    ></Badge>
  );
}
