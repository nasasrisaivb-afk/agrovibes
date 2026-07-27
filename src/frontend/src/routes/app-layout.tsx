import { AppShell } from "@/components/layout/AppShell";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

/** Pathless layout wrapping all consumer-facing screens. */
export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-shell",
  component: AppShell,
});
