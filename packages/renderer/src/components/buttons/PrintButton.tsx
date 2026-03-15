import { Button } from "./Button";
import { PrinterIcon } from "@components/icons/PrinterIcon";
import type { ButtonProps } from "./types";

export function PrintButton({ text, ...props }: ButtonProps) {
  return (
    <>
      <Button
        size="md"
        icon={<PrinterIcon size={20}></PrinterIcon>}
        className="bg-tertiary text-primary-content outline-none hover:bg-success hover:text-success-content"
        {...props}
      >
        {text ?? "Print"}
      </Button>
    </>
  );
}
