import { Button } from '../components/buttons/Button';
import { DiamondIcon } from '../components/icons/DiamondIcon';
import { QRCodeIcon } from '../components/icons/QRCodeIcon';
import { TopBar } from '../components/layout/TopBar';
import { useTheme } from '../context/theme/useTheme';

export function Dashboard() {
  const { colors } = useTheme();
  return (
    <>
      <TopBar>
        <DiamondIcon></DiamondIcon>
        <Button
          size="lg"
          className="ml-auto"
          style={{
            color: colors.fg.primary,
            backgroundColor: colors.bg.tertiary,
            borderColor: colors.border.default,
          }}
          icon={<QRCodeIcon size={24}></QRCodeIcon>}
        >
          Get QR Code
        </Button>
      </TopBar>
    </>
  );
}
