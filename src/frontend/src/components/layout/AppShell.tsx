import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMyNotifications } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Home, Package, Sprout, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/sell", label: "Sell", icon: Sprout },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  const { isAuthenticated, isLoading, me, user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const notifications = useMyNotifications();
  const unread = isAuthenticated
    ? (notifications.data?.filter((n) => !n.read).length ??
      Number(me?.unreadNotifications ?? 0n))
    : 0;
  const heroMode = pathname === "/" && !isAuthenticated && !isLoading;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col">
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur transition-colors",
          heroMode
            ? "border-transparent bg-background/40"
            : "border-border bg-background/90",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4">
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
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.to
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
                className="tap-target hidden h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary md:flex"
              >
                {(user?.name || "U").charAt(0).toUpperCase()}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile bottom navigation — 44px+ touch targets */}
      <nav
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
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
  );
}
