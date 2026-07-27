import { ListingWizard } from "@/components/sell/ListingWizard";
import { ErrorState } from "@/components/shared/ErrorState";
import { DetailSkeleton } from "@/components/shared/Skeletons";
import { useMyListing } from "@/lib/backend";
import { createRoute } from "@tanstack/react-router";
import { Route as appLayoutRoute } from "./app-layout";

function EditListingScreen() {
  const { id } = Route.useParams();
  const listing = useMyListing(BigInt(id));

  if (listing.isPending) return <DetailSkeleton />;
  if (listing.isError) {
    return (
      <ErrorState
        error={listing.error}
        onRetry={() => listing.refetch()}
        retryLabel="Reload listing"
      />
    );
  }
  return <ListingWizard existing={listing.data} />;
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sell/edit/$id",
  component: EditListingScreen,
});
