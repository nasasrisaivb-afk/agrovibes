import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LogOut, ShieldCheck } from "lucide-react";
import { AdminLogin } from "./AdminLogin";

const TABS = [
  { to: "/admin/kyc", label: "KYC review" },
  { to: "/admin/listings", label: "Listing moderation" },
  { to: "/admin/reports", label: "Reports" },
] as const;

/** Admin console shell — employee login only, fully separate from the
 *  consumer phone-OTP session. */
export function AdminShell() {
  const { isAdminAuthenticated, adminName, adminLogout } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-display text-base font-bold">
              CropVibe Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {adminName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={adminLogout}
              className="tap-target"
            >
              <LogOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-4 pb-2"
          aria-label="Admin sections"
        >
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "tap-target whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(tab.to)
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={pathname.startsWith(tab.to) ? "page" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
