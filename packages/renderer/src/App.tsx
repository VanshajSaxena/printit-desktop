import { ThemeProvider } from "./context/theme/ThemeProvider";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient } from "@api/client";
import { queryPersister } from "@api/queryPersister";
import { Toaster } from "sonner";

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: "v1",
      }}
    >
      <ThemeProvider>
        <AppLayout />
        <Toaster />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
