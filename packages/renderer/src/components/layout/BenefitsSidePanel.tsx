import { Calculator, Timer, TrendingUp } from "lucide-react";
export function BenefitsSidePanel() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-primary p-10 lg:p-16 xl:p-24">
      <div className="mx-auto w-full max-w-md">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-content lg:text-4xl">
          Stop Managing Files. <br />
          Start Making Money.
        </h2>
        <p className="mb-12 text-lg text-secondary-content">
          The WhatsApp bottleneck is costing you customers. Printit automates
          your workflow, clears your counter faster, and maximizes your
          shop&apos;s daily output.
        </p>

        <div className="space-y-8">
          {/* Perk 1: Speed / Turning over the line */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-queued text-queued-content shadow-sm">
              <Timer className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-primary-content">
                Clear the Counter 5x Faster
              </h3>
              <p className="text-sm leading-relaxed text-secondary-content">
                Stop downloading files from endless chat windows while the line
                builds up. Orders drop directly into a live, organized queue.
                Just click print and collect the cash.
              </p>
            </div>
          </div>

          {/* Perk 2: Avoiding waste / Pricing accuracy */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-printing text-printing-content shadow-sm">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-primary-content">
                Protect Your Profit Margins
              </h3>
              <p className="text-sm leading-relaxed text-secondary-content">
                Never miscalculate a job again. Printit instantly shows exact
                page counts and color ratios before you open the file. Quote the
                right price instantly and eliminate wasted paper.
              </p>
            </div>
          </div>

          {/* Perk 3: Business Growth */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success text-success-content shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-primary-content">
                Become the Go-To Shop
              </h3>
              <p className="text-sm leading-relaxed text-secondary-content">
                Customers hate waiting in line just to hand over a file. Give
                them a seamless, instant &quot;scan-to-print&quot; experience
                that keeps them coming back to you instead of the competition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
