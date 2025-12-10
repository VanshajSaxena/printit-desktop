import { MagGlassIcon } from "@components/icons/MagGlassIcon";

export function SearchInput() {
  return (
    <div className="flex h-8.5 w-96 min-w-max items-center justify-start gap-3 rounded-xl px-3 py-1.75 text-secondary-content outline -outline-offset-1 outline-border-default">
      <MagGlassIcon size={20} />
      <input className="h-full w-full outline-none" placeholder="Search" />
    </div>
  );
}
