import { AlertCircleIcon } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-secondary p-8 shadow-2xl">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error text-2xl text-error-content">
            <AlertCircleIcon></AlertCircleIcon>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Something went wrong
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              The application ran into an unexpected problem.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-background p-4">
          <p className="text-sm leading-6 text-secondary-content">
            You can try reloading the interface. If this keeps happening,
            restarting the app usually fixes it.
          </p>
        </div>

        <details className="mb-6 overflow-hidden rounded-xl border border-border bg-tertiary">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-tertiary-content transition select-none hover:bg-black/5 dark:hover:bg-white/5">
            Technical details
          </summary>

          <div className="border-t border-border px-4 py-3">
            <pre className="overflow-auto text-sm wrap-break-word whitespace-pre-wrap text-error-content">
              {errorMessage}
            </pre>
          </div>
        </details>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-tertiary"
          >
            Restart App
          </button>

          <button
            onClick={resetErrorBoundary}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
