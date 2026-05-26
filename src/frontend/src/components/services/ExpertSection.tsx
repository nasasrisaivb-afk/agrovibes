import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import type { ExpertProfile } from "../../types";
import { ExpertBookingModal } from "./BookingModal";

interface Props {
  experts: ExpertProfile[];
}

const RATINGS: Record<number, number> = { 1: 4.9, 2: 4.8, 3: 4.6 };

export function ExpertSection({ experts }: Props) {
  const [selected, setSelected] = useState<ExpertProfile | null>(null);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {experts.map((e, idx) => (
          <div
            key={e.id.toString()}
            className="flex gap-3 bg-card rounded-xl border border-border p-3 items-center"
            data-ocid="expert-card"
          >
            <div className="relative flex-shrink-0">
              <img
                src={e.imageUrl}
                alt={e.name}
                className="w-12 h-12 rounded-full object-cover bg-muted"
                onError={(err) => {
                  (err.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
              {e.available && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.specialty}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                <span className="text-[10px] text-muted-foreground">
                  {RATINGS[idx + 1] ?? 4.7}
                </span>
                <span className="text-accent font-medium text-xs ml-1">
                  ₹{e.hourlyRate}/hr
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className={`h-8 px-3 text-xs flex-shrink-0 ${
                e.available
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-muted text-muted-foreground"
              }`}
              disabled={!e.available}
              onClick={() => e.available && setSelected(e)}
              data-ocid="consult-expert"
            >
              {e.available ? "Consult" : "Unavailable"}
            </Button>
          </div>
        ))}
      </div>

      {selected && (
        <ExpertBookingModal
          open={!!selected}
          onClose={() => setSelected(null)}
          name={selected.name}
          specialty={selected.specialty}
          hourlyRate={selected.hourlyRate}
        />
      )}
    </>
  );
}
