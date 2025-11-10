import { GridScanIcon } from '@components/icons/GridScanIcon';
import { ListIconFile } from '@components/icons/ListIconFile';
import { useTheme } from '@context/theme/useTheme';

export function RequestListItem() {
  const { colors } = useTheme();
  return (
    <>
      <div
        className="flex-col h-fit w-fill border-t first:border-t-0 last:border-b px-4 py-2 gap-2"
        style={{ borderColor: colors.border.default }}
      >
        <div className="flex h-fit w-fill">
          <div className="flex gap-4 h-fit items-center">
            <ListIconFile size={24}></ListIconFile>
            <div className="flex flex-col h-fit pb-0.5 gap-1">
              <h3
                className="text-base leading-6"
                style={{ color: colors.fg.primary }}
              >
                Final Year Dissertation
              </h3>
              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <GridScanIcon></GridScanIcon>
                  <p
                    className="text-xs leading-4"
                    style={{ color: colors.fg.secondary }}
                  >
                    FXMP4LPF
                  </p>
                </div>
                <p
                  className="text-xs leading-4"
                  style={{ color: colors.fg.primary }}
                >
                  just now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
