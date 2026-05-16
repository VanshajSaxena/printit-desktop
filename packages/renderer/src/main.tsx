import log from "electron-log/renderer";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.tsx";
import ErrorFallback from "./components/dialogs/ErrorFallback";
import "./index.css";

const container = document.getElementById("root");

if (container) {
  createRoot(container).render(
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          log.error("React crash:", error, info);
        }}
        onReset={() => {
          window.location.reload();
        }}
      >
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  log.error("Root element with ID 'root' not found in the document.");
}
