import { BenefitsSidePanel } from "@/components/layout/BenefitsSidePanel";
import { LoginForm } from "@/components/login-form";
import { PrintitIcon } from "@/components/Printit";

export default function LoginPage({
  switchToSignup,
}: {
  switchToSignup: () => void;
}) {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex h-full flex-col overflow-y-auto p-6 md:p-10">
        <div className="flex shrink-0 justify-center gap-2 md:justify-start">
          <PrintitIcon width={120} />
        </div>
        <div className="flex flex-1 flex-col py-10">
          <div className="m-auto w-full max-w-xs">
            <LoginForm switchToSignup={switchToSignup} />
          </div>
        </div>
      </div>
      <div className="relative hidden h-full overflow-hidden border-l border-border lg:block">
        <BenefitsSidePanel />
      </div>
    </div>
  );
}
