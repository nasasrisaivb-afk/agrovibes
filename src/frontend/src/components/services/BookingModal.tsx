import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ---- Machinery Booking ----
interface MachineryBookingProps {
  open: boolean;
  onClose: () => void;
  name: string;
  dailyRate: number;
}

export function MachineryBookingModal({
  open,
  onClose,
  name,
  dailyRate,
}: MachineryBookingProps) {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const days = Math.max(
    1,
    (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000 + 1,
  );
  const total = days * dailyRate * qty;

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onClose();
    toast.success("Booking confirmed!", {
      description: `${name} booked for ${days} day${days > 1 ? "s" : ""}. Total: ₹${total.toLocaleString("en-IN")}`,
      icon: <CheckCircle2 className="text-primary h-4 w-4" />,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CalendarDays className="h-5 w-5 text-primary" />
            Book Machinery
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground -mt-2">₹{dailyRate}/day</p>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <Label htmlFor="from-date" className="text-xs">
              From
            </Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              min={today}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="machinery-from-date"
            />
          </div>
          <div>
            <Label htmlFor="to-date" className="text-xs">
              To
            </Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="machinery-to-date"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="qty" className="text-xs">
            Quantity
          </Label>
          <Input
            id="qty"
            type="number"
            min={1}
            max={10}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="h-9 text-sm mt-1"
            data-ocid="machinery-qty"
          />
        </div>
        <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">
              {days} day{days > 1 ? "s" : ""} × {qty} unit{qty > 1 ? "s" : ""}
            </p>
            <p className="font-bold text-lg text-accent">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Escrow Protected</p>
        </div>
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10"
          onClick={handleConfirm}
          disabled={loading}
          data-ocid="confirm-machinery-booking"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Confirm Booking
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ---- Logistics Booking ----
interface LogisticsBookingProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
  ratePerKm: number;
}

export function LogisticsBookingModal({
  open,
  onClose,
  providerName,
  ratePerKm,
}: LogisticsBookingProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(100);
  const [loading, setLoading] = useState(false);

  const estimatedCost = weight * ratePerKm * 0.1; // weight(kg) * rate/km * 10km default

  async function handleConfirm() {
    if (!origin || !destination) {
      toast.error("Please enter origin and destination.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onClose();
    toast.success("Logistics request sent!", {
      description: `${providerName} will contact you shortly. Est. cost: ₹${estimatedCost.toLocaleString("en-IN")}`,
      icon: <CheckCircle2 className="text-primary h-4 w-4" />,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-display">Request Logistics</DialogTitle>
        </DialogHeader>
        <p className="text-sm font-medium -mt-1">{providerName}</p>
        <div className="flex flex-col gap-3 mt-1">
          <div>
            <Label htmlFor="origin" className="text-xs">
              Origin
            </Label>
            <Input
              id="origin"
              placeholder="e.g. Amritsar Mandi"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="logistics-origin"
            />
          </div>
          <div>
            <Label htmlFor="destination" className="text-xs">
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="e.g. Delhi Azadpur"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="logistics-destination"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-xs">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
              className="h-9 text-sm mt-1"
              data-ocid="logistics-weight"
            />
          </div>
        </div>
        <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">
              {weight}kg · ₹{ratePerKm}/km
            </p>
            <p className="font-bold text-lg text-accent">
              ₹{estimatedCost.toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Est. cost</p>
        </div>
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10"
          onClick={handleConfirm}
          disabled={loading}
          data-ocid="confirm-logistics-booking"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Confirm Request
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ---- Expert Consultation ----
interface ExpertBookingProps {
  open: boolean;
  onClose: () => void;
  name: string;
  specialty: string;
  hourlyRate: number;
}

const DURATIONS = [
  { label: "30 min", hours: 0.5 },
  { label: "1 hr", hours: 1 },
  { label: "2 hr", hours: 2 },
];

export function ExpertBookingModal({
  open,
  onClose,
  name,
  specialty,
  hourlyRate,
}: ExpertBookingProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("10:00");
  const [durationIdx, setDurationIdx] = useState(1);
  const [loading, setLoading] = useState(false);

  const duration = DURATIONS[durationIdx];
  const total = Math.round(duration.hours * hourlyRate);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onClose();
    toast.success("Consultation scheduled!", {
      description: `Session with ${name} on ${date} at ${time}. Fee: ₹${total}`,
      icon: <CheckCircle2 className="text-primary h-4 w-4" />,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-display">Book Consultation</DialogTitle>
        </DialogHeader>
        <div className="-mt-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{specialty}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <Label htmlFor="consult-date" className="text-xs">
              Date
            </Label>
            <Input
              id="consult-date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="consult-date"
            />
          </div>
          <div>
            <Label htmlFor="consult-time" className="text-xs">
              Time
            </Label>
            <Input
              id="consult-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 text-sm mt-1"
              data-ocid="consult-time"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Duration</Label>
          <div className="flex gap-2 mt-2">
            {DURATIONS.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setDurationIdx(i)}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${
                  durationIdx === i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:border-primary/50"
                }`}
                data-ocid={`consult-duration-${i}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">
              {duration.label} · ₹{hourlyRate}/hr
            </p>
            <p className="font-bold text-lg text-accent">₹{total}</p>
          </div>
          <p className="text-xs text-muted-foreground">Consultation fee</p>
        </div>
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10"
          onClick={handleConfirm}
          disabled={loading}
          data-ocid="confirm-consult-booking"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Confirm Schedule
        </Button>
      </DialogContent>
    </Dialog>
  );
}
