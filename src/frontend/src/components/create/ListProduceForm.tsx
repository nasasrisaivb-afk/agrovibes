import { AIEnhancementPanel } from "./AIEnhancementPanel";
import { MarketplaceListingCreator } from "./MarketplaceListingCreator";

export function ListProduceForm() {
  return (
    <div className="flex flex-col gap-5">
      <MarketplaceListingCreator />
      <AIEnhancementPanel contentType="listing" />
    </div>
  );
}
