import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/theme/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import log from "electron-log/renderer";
import { LogOut, Moon, Sun } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((store) => store.logout);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("app-theme-preference", newTheme);
  };

  const handleLogout = () => {
    log.info("Logging out...");
    void logout();
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="flex h-full w-full justify-center overflow-y-auto px-6 py-10">
        <div className="w-full max-w-3xl space-y-10">
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Appearance
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize how the application looks and feels.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/40 p-5">
              <div className="flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Interface Theme
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode.
                  </p>
                </div>

                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="h-10 w-40 border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="z-50 border border-border bg-background">
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-red-600/80">
                Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground">
                Actions here can affect your current session.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/40 p-5">
              <div className="flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Log out</p>
                  <p className="text-sm text-muted-foreground">
                    End your session and return to the login screen.
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="h-10 shrink-0"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
