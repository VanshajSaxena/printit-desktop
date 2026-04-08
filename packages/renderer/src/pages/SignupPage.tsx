import { BenefitsSidePanel } from "@/components/layout/BenefitsSidePanel";
import { PrintitIcon } from "@/components/Printit";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  return (
    // 1. Changed 'min-h-svh' to 'h-svh' and added 'overflow-hidden' to lock the page height
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      {/* 2. Added 'overflow-y-auto' and 'h-full' to the left panel */}
      <div className="flex h-full flex-col overflow-y-auto p-6 md:p-10">
        {/* Added shrink-0 so the logo never gets squished when scrolling */}
        <div className="flex shrink-0 justify-center gap-2 md:justify-start">
          <PrintitIcon width={120} />
        </div>

        {/* 3. Replaced 'items-center justify-center' with margins to prevent top cut-off on overflow */}
        <div className="flex flex-1 flex-col py-10">
          <div className="m-auto w-full max-w-xs">
            <SignupForm switchToLogin={switchToLogin} />
          </div>
        </div>
      </div>

      {/* 4. Made sure the right panel takes up full height and hides overflow */}
      <div className="relative hidden h-full overflow-hidden border-l border-border lg:block">
        <BenefitsSidePanel />
      </div>
    </div>
  );
}
