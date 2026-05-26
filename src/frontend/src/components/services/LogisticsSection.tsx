import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { useState } from "react";
import type { LogisticsListing } from "../../types";
import { LogisticsBookingModal } from "./BookingModal";

interface Props {
  logistics: LogisticsListing[];
}

export function LogisticsSection({ logistics }: Props) {
  const [selected, setSelected] = useState<LogisticsListing | null>(null);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {logistics.map((l) => (
          <div
            key={l.id.toString()}
            className="flex gap-3 bg-card rounded-xl border border-border p-3 items-center"
            data-ocid="logistics-card"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
              <img
                src={l.imageUrl}
                alt={l.providerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{l.providerName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {l.serviceArea}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Truck className="h-3 w-3 text-accent" />
                <span className="text-accent font-medium text-xs">
                  ₹{l.ratePerKm}/km
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0"
              onClick={() => setSelected(l)}
              data-ocid="book-logistics"
            >
              Book
            </Button>
          </div>
        ))}
      </div>

      {selected && (
        <LogisticsBookingModal
          open={!!selected}
          onClose={() => setSelected(null)}
          providerName={selected.providerName}
          ratePerKm={selected.ratePerKm}
        />
      )}
    </>
  );
}
