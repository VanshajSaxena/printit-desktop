import { ThemeProvider } from "./context/theme/ThemeProvider";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/client";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppLayout></AppLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
