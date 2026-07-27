import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLogin } from "./AdminLogin";

const TABS = [
  { to: "/admin/kyc", label: "KYC review", icon: ShieldCheck },
  { to: "/admin/listings", label: "Listing moderation", icon: ClipboardList },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
] as const;

const SIDEBAR_KEY = "cropvibe.admin.sidebar.collapsed";

/** Admin console shell — employee login only, fully separate from the
 *  consumer phone-OTP session. Desktop sidebar + mobile tab strip. */
export function AdminShell() {
  const { isAdminAuthenticated, adminName, adminLogout } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl lg:flex-row">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.2_0.02_150),_transparent_55%)]" />
      </div>

      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar/95 backdrop-blur transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-60",
        )}
        aria-label="Admin sections"
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-sidebar-border px-3",
            collapsed ? "justify-center" : "justify-between gap-2",
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldCheck
              className="h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            {!collapsed && (
              <span className="font-display text-base font-bold">
                CropVibe Admin
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="tap-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                title={collapsed ? tab.label : undefined}
                className={cn(
                  "tap-target flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <tab.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{tab.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          {collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="tap-target flex w-full items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <div className="space-y-2 px-1">
              <p className="truncate px-2 text-xs text-muted-foreground">
                {adminName}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={adminLogout}
                className="tap-target w-full"
              >
                <LogOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
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
        <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
