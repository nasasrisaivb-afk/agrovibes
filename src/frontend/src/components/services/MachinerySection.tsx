import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { useState } from "react";
import type { MachineryListing } from "../../types";
import { MachineryBookingModal } from "./BookingModal";

interface Props {
  machinery: MachineryListing[];
  isLoading: boolean;
}

const OWNER_NAMES: Record<number, string> = {
  1: "Gurpreet Singh",
  2: "Ramesh Kumar",
  3: "Amit Verma",
  4: "Dhiraj Yadav",
};

export function MachinerySection({ machinery, isLoading }: Props) {
  const [selected, setSelected] = useState<MachineryListing | null>(null);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-52 w-44 flex-shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {machinery.map((m) => (
          <div
            key={m.id.toString()}
            className="flex-shrink-0 w-44 bg-card rounded-2xl border border-border overflow-hidden"
            data-ocid="machinery-card"
          >
            <div className="aspect-[4/3] bg-muted relative">
              <img
                src={m.imageUrl}
                alt={m.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
              <Badge
                className={`absolute top-2 left-2 text-[9px] px-1.5 py-0.5 border-0 ${
                  m.available
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-muted/90 text-muted-foreground"
                }`}
              >
                {m.available ? "Available" : "Booked"}
              </Badge>
            </div>
            <div className="p-2.5">
              <p className="font-medium text-xs line-clamp-1">{m.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                {OWNER_NAMES[Number(m.ownerId)] ?? "Local Farmer"}
              </p>
              <p className="text-accent font-bold text-sm mt-1">
                ₹{m.dailyRate.toLocaleString("en-IN")}
                <span className="text-[10px] font-normal text-muted-foreground">
                  /day
                </span>
              </p>
              <Button
                size="sm"
                className={`w-full h-7 text-xs mt-2 ${
                  m.available
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-muted text-muted-foreground"
                }`}
                disabled={!m.available}
                onClick={() => m.available && setSelected(m)}
                data-ocid="book-machinery"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {m.available ? "Book Now" : "Unavailable"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MachineryBookingModal
          open={!!selected}
          onClose={() => setSelected(null)}
          name={selected.name}
          dailyRate={selected.dailyRate}
        />
      )}
    </>
  );
}
