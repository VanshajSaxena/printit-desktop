import { queryClient } from "@api/client";
import { queryPersister } from "@api/queryPersister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { ThemeProvider } from "./context/theme/ThemeProvider";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  useEffect(() => {
    void useAuthStore.getState().bootstrap();
  }, []);

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
