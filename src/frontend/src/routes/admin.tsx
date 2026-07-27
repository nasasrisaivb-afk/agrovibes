import { AdminShell } from "@/components/admin/AdminShell";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminShell,
});
