import { createRoute, redirect } from "@tanstack/react-router";
import { Route as adminRoute } from "./admin";

export const Route = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/admin/kyc" });
  },
});
