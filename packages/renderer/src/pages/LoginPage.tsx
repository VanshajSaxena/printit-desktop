import { GalleryVerticalEnd } from "lucide-react";

import { BenefitsSidePanel } from "@/components/layout/BenefitsSidePanel";
import { LoginForm } from "@/components/login-form";

export default function LoginPage({
  switchToSignup,
}: {
  switchToSignup: () => void;
}) {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex h-full flex-col overflow-y-auto p-6 md:p-10">
        <div className="flex shrink-0 justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            Printit
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-content">
              <GalleryVerticalEnd className="size-4" />
            </div>
          </a>
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
