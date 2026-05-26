import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { CartProvider } from "./context/CartContext";
import { RoleProvider } from "./context/RoleContext";
import { TrustProvider } from "./context/TrustContext";
import { Route as rootRoute } from "./routes/__root";
import { Route as communityRoute } from "./routes/community";
import { Route as createRoute } from "./routes/create";
import { Route as dashboardRoute } from "./routes/dashboard";
import { Route as discoverRoute } from "./routes/discover";
import { Route as indexRoute } from "./routes/index";
import { Route as learnRoute } from "./routes/learn";
import { Route as marketplaceRoute } from "./routes/marketplace";
import { Route as marketplaceDetailRoute } from "./routes/marketplace.$id";
import { Route as messagesRoute } from "./routes/messages";
import { Route as profileRoute } from "./routes/profile";
import { Route as resourcesRoute } from "./routes/resources";
import { Route as sellRoute } from "./routes/sell";
import { Route as servicesRoute } from "./routes/services";
import { Route as trustRoute } from "./routes/trust";

const routeTree = rootRoute.addChildren([
  indexRoute,
  marketplaceRoute,
  marketplaceDetailRoute,
  createRoute,
  servicesRoute,
  communityRoute,
  profileRoute,
  learnRoute,
  messagesRoute,
  discoverRoute,
  sellRoute,
  dashboardRoute,
  trustRoute,
  resourcesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AccessibilityProvider>
      <RoleProvider>
        <CartProvider>
          <TrustProvider>
            <RouterProvider router={router} />
          </TrustProvider>
        </CartProvider>
      </RoleProvider>
    </AccessibilityProvider>
  );
}
