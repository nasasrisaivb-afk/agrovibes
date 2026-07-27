import { ListingWizard } from "@/components/sell/ListingWizard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { Route as appLayoutRoute } from "./app-layout";

function NewListingScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated || !isSeller) {
    return (
      <EmptyState
        icon={Sprout}
        title="Seller account needed"
        description="Set up your seller profile first — it takes under a minute."
        actionLabel={isAuthenticated ? "Become a seller" : "Sign in"}
        onAction={() =>
          navigate({
            to: "/auth",
            search: isAuthenticated ? { addRole: "SELLER" } : {},
          })
        }
      />
    );
  }
  return <ListingWizard />;
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sell/new",
  component: NewListingScreen,
});
