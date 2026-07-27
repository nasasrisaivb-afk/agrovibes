import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMyNotifications } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Sprout,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/sell", label: "Sell", icon: Sprout },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const SIDEBAR_KEY = "cropvibe.sidebar.collapsed";

export function AppShell() {
  const { isAuthenticated, isLoading, me, user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const notifications = useMyNotifications();
  const unread = isAuthenticated
    ? (notifications.data?.filter((n) => !n.read).length ??
      Number(me?.unreadNotifications ?? 0n))
    : 0;
  const heroMode = pathname === "/" && !isAuthenticated && !isLoading;
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

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-dvh w-full",
        heroMode ? "max-w-5xl flex-col" : "max-w-7xl lg:flex-row",
      )}
    >
      {/* Atmospheric page wash — skipped on full-bleed hero */}
      {!heroMode && (
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-success/[0.05] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.22_0.02_150),_transparent_55%)]" />
        </div>
      )}

      {/* Desktop sidebar — BRD 12.3/12.4: expanded ≥1024px, icon rail when collapsed */}
      {!heroMode && (
        <aside
          className={cn(
            "sticky top-0 z-40 hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar/95 backdrop-blur transition-[width] duration-200 lg:flex",
            collapsed ? "w-[72px]" : "w-56",
          )}
          aria-label="Primary"
        >
          <div
            className={cn(
              "flex h-14 items-center border-b border-sidebar-border px-3",
              collapsed ? "justify-center" : "justify-between gap-2",
            )}
          >
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 overflow-hidden",
                collapsed && "justify-center",
              )}
              aria-label="CropVibe home"
            >
              <Sprout
                className="h-6 w-6 shrink-0 text-primary"
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="gold-gradient-text font-display text-lg font-bold tracking-tight">
                  CropVibe
                </span>
              )}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="tap-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "tap-target relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                  {item.to === "/notifications" && unread > 0 && (
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground",
                        collapsed
                          ? "absolute right-1.5 top-1.5 h-2 min-w-2 p-0"
                          : "ml-auto",
                      )}
                      aria-label={`${unread} unread`}
                    >
                      {!collapsed && unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-2">
            {collapsed ? (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="tap-target flex w-full items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-sidebar-accent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {user?.name || "Account"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    View profile
                  </span>
                </span>
              </Link>
            ) : (
              <Button asChild className="w-full tap-target" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — always on mobile/tablet; slim on desktop when sidebar present */}
        <header
          className={cn(
            "sticky top-0 z-40 border-b backdrop-blur transition-colors",
            heroMode
              ? "border-transparent bg-background/40"
              : "border-border bg-background/90",
            !heroMode &&
              "lg:border-b-0 lg:bg-transparent lg:backdrop-blur-none",
          )}
        >
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-3 px-4",
              !heroMode && "lg:hidden",
            )}
          >
            <Link
              to="/"
              className="flex items-center gap-2"
              aria-label="CropVibe home"
            >
              <Sprout className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="gold-gradient-text font-display text-lg font-bold tracking-tight">
                CropVibe
              </span>
            </Link>
            <nav
              className="hidden items-center gap-1 md:flex lg:hidden"
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive(item.to)
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                  {item.to === "/notifications" && unread > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link
                  to="/notifications"
                  className="tap-target relative flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:hidden"
                  aria-label={
                    unread > 0
                      ? `Notifications, ${unread} unread`
                      : "Notifications"
                  }
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unread > 0 && (
                    <span
                      className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ) : (
                <Button asChild size="sm" className="tap-target">
                  <Link to="/auth">Sign in</Link>
                </Button>
              )}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  aria-label="Your profile"
                  className="tap-target hidden h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary md:flex lg:hidden"
                >
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </Link>
              )}
            </div>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 px-4 pb-24 pt-4 md:pb-8",
            !heroMode && "lg:px-8 lg:pb-10 lg:pt-6",
            heroMode && "px-0 pb-0 pt-0 md:pb-0",
          )}
        >
          {heroMode ? (
            <Outlet />
          ) : (
            <div className="mx-auto w-full max-w-5xl">
              <Outlet />
            </div>
          )}
        </main>

        {/* Mobile bottom navigation — BRD 12.2: 5 tabs, 44px+ targets */}
        <nav
          className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
          aria-label="Primary"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "tap-target relative flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.to === "/notifications" && unread > 0 && (
                    <span
                      className="absolute right-[22%] top-1 h-2 w-2 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        <InstallPrompt />
      </div>
    </div>
  );
}
