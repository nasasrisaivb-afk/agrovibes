import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";
import { Route as rootRoute } from "./routes/__root";
import { Route as adminRoute } from "./routes/admin";
import { Route as adminIndexRoute } from "./routes/admin.index";
import { Route as adminKycRoute } from "./routes/admin.kyc";
import { Route as adminListingsRoute } from "./routes/admin.listings";
import { Route as adminReportsRoute } from "./routes/admin.reports";
import { Route as appLayoutRoute } from "./routes/app-layout";
import { Route as authRoute } from "./routes/auth";
import { Route as indexRoute } from "./routes/index";
import { Route as kycRoute } from "./routes/kyc";
import { Route as listingDetailRoute } from "./routes/listing.$id";
import { Route as notificationsRoute } from "./routes/notifications";
import { Route as ordersRoute } from "./routes/orders";
import { Route as orderDetailRoute } from "./routes/orders.$id";
import { Route as profileRoute } from "./routes/profile";
import { Route as sellRoute } from "./routes/sell";
import { Route as sellEditRoute } from "./routes/sell.edit.$id";
import { Route as sellNewRoute } from "./routes/sell.new";

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    indexRoute,
    authRoute,
    listingDetailRoute,
    ordersRoute,
    orderDetailRoute,
    sellRoute,
    sellNewRoute,
    sellEditRoute,
    kycRoute,
    profileRoute,
    notificationsRoute,
  ]),
  adminRoute.addChildren([
    adminIndexRoute,
    adminKycRoute,
    adminListingsRoute,
    adminReportsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </AuthProvider>
  );
}
