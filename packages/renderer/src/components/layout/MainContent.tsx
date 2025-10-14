import { useTheme } from '../../context/theme/useTheme';
import { Button } from '../buttons/Button';
import DiamondIcon from '../icons/DiamondIcon';
import { QRCodeIcon } from '../icons/QRCodeIcon';
import { TopBar } from './TopBar';

export function MainContent() {
  const { colors } = useTheme();
  return (
    <main
      className="flex flex-1 rounded-tl-2xl overflow-y-auto ml-4"
      style={{
        backgroundColor: colors.bg.primary,
        border: colors.border.default,
      }}
    >
      <TopBar>
        <DiamondIcon></DiamondIcon>
        <Button
          size="lg"
          className="ml-auto"
          style={{
            color: colors.fg.primary,
            backgroundColor: colors.bg.tertiary,
          }}
          icon={<QRCodeIcon size={24}></QRCodeIcon>}
        >
          Get QR Code
        </Button>
      </TopBar>
    </main>
  );
}
