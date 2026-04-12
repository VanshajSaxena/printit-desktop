import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import { useAuthStore } from "@/store/useAuthStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MainContent } from "./MainContent";
import { SideBar } from "./SideBar";
import { PrintitIcon } from "../Printit";

export type ViewType = "dashboard" | "analytics" | "settings" | "help";
type AuthView = "login" | "signup";

export function AppLayout() {
  const [selectedView, setSelectedView] = useState<ViewType>("dashboard");
  const printQueue = useTransactionStore((store) => store.state.printQueue);

  const timedout = printQueue.items.some(
    (item) => item.monitoring?.timedOut === true,
  );

  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isBootstrapping = useAuthStore((store) => store.isBootstrapping);
  const [authView, setAuthView] = useState<AuthView>("login");

  useEffect(() => {
    if (timedout) {
      toast.error("It looks like your printer is not connected.", {
        id: "printer-timeout",
        position: "top-center",
        duration: 5000,
      });
    }
  }, [timedout]);

  if (isBootstrapping)
    return (
      <div className="flex h-dvh w-dvw items-center justify-center gap-4 overflow-hidden bg-secondary select-none">
        <PrintitIcon width={300}></PrintitIcon>
      </div>
    );
  if (!isAuthenticated && authView === "login")
    return (
      <LoginPage
        switchToSignup={() => {
          setAuthView("signup");
        }}
      />
    );

  if (!isAuthenticated && authView === "signup")
    return (
      <SignupPage
        switchToLogin={() => {
          setAuthView("login");
        }}
      />
    );

  return (
    <div
      className={
        "flex h-dvh w-dvw gap-4 overflow-hidden bg-secondary pt-4 pl-4 select-none"
      }
    >
      <SideBar
        selectedView={selectedView}
        onViewChange={setSelectedView}
      ></SideBar>
      <MainContent activeView={selectedView}></MainContent>
    </div>
  );
}
