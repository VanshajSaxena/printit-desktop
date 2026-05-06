import { MagGlassIcon } from "@components/icons/MagGlassIcon";

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-8.5 w-full max-w-md items-center gap-3 rounded-xl px-3 outline -outline-offset-1 outline-border-default">
      <MagGlassIcon size={20} />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="size-full bg-transparent outline-none"
        placeholder="Search transactions..."
      />
    </div>
  );
}
