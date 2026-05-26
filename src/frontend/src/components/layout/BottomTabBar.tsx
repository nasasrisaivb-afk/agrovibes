import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Compass, Home, Leaf, User } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", Icon: Home, ocid: "tab-home" },
  {
    to: "/discover",
    label: "Discover",
    Icon: Compass,
    ocid: "tab-discover",
  },
  {
    to: "/sell",
    label: "Sell",
    Icon: Leaf,
    ocid: "tab-sell",
    isPrimary: true,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    Icon: BarChart3,
    ocid: "tab-dashboard",
  },
  { to: "/profile", label: "Profile", Icon: User, ocid: "tab-profile" },
];

export function BottomTabBar() {
  const state = useRouterState();
  const currentPath = state.location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border flex items-center lg:hidden"
      data-ocid="bottom-tab-bar"
      aria-label="Main navigation"
    >
      {TABS.map(({ to, label, Icon, ocid, isPrimary }) => {
        const isActive =
          to === "/" ? currentPath === "/" : currentPath.startsWith(to);

        if (isPrimary) {
          return (
            <Link
              key={to}
              to={to}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-h-[44px] transition-colors"
              data-ocid={ocid}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-primary shadow-lg">
                <Icon
                  className="h-6 w-6 text-primary-foreground"
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-[10px] font-medium mt-0.5 text-muted-foreground">
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={to}
            to={to}
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-h-[44px] transition-colors"
            data-ocid={ocid}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`flex items-center justify-center transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </span>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
