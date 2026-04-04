import { queryClient } from "@api/client";
import { queryPersister } from "@api/queryPersister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { ThemeProvider } from "./context/theme/ThemeProvider";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isBootstrapping = useAuthStore((store) => store.isBootstrapping);

  useEffect(() => {
    void useAuthStore.getState().bootstrap();
  }, []);

  if (isBootstrapping) return <div>Loading....</div>;
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
        {!isAuthenticated ? <LoginPage /> : <AppLayout />}
        <Toaster />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
