import type { VendorPresenceDto } from "@/api/gen/cloud-api-types.ts";
import type { IconProps } from "./types.ts";

export function ProfileHashIcon({
  size,
  presence,
  ...props
}: IconProps & { presence: VendorPresenceDto["status"] }) {
  const isOnline = presence === "online";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
      {...props}
    >
      <rect width={size} height={size} rx={8} className="fill-tertiary" />

      {isOnline && <circle cx="36" cy="36" r="5" className="fill-green-600" />}

      <path
        d="M18.31 10l-4.543 20m12.854-20l-4.505 20M10 24.056h18.718m-17.087-8.635H30"
        className="stroke-primary-content"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}
