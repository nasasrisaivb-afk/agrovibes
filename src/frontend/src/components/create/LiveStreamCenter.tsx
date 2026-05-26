import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Radio,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VoiceInputButton } from "./VoiceInputButton";

const STREAM_CATEGORIES = [
  "Farming Tips",
  "Market Updates",
  "Equipment Demo",
  "Education",
  "Q&A",
  "Success Story",
  "Pest Alert",
  "Weather Update",
];

interface StreamConfig {
  title: string;
  description: string;
  category: string;
  audienceLocation: string;
  audienceRole: string;
  scheduleNow: boolean;
  scheduledDate: string;
  scheduledTime: string;
  isFree: boolean;
  paidPrice: string;
  tipsEnabled: boolean;
  linkedProduct: string;
}

const DEFAULT_CONFIG: StreamConfig = {
  title: "",
  description: "",
  category: "Farming Tips",
  audienceLocation: "all-india",
  audienceRole: "all",
  scheduleNow: true,
  scheduledDate: "",
  scheduledTime: "",
  isFree: true,
  paidPrice: "",
  tipsEnabled: true,
  linkedProduct: "",
};

export function LiveStreamCenter() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<StreamConfig>(DEFAULT_CONFIG);
  const [streamEnded, setStreamEnded] = useState(false);

  const set = <K extends keyof StreamConfig>(key: K, val: StreamConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: val }));

  const goLive = () => {
    toast.success(
      "🔴 This would start your live stream — feature coming soon!",
      {
        duration: 5000,
      },
    );
    setStreamEnded(true);
  };

  if (streamEnded) {
    return (
      <div className="space-y-4" data-ocid="stream-post-management">
        <div className="bg-muted/50 rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Radio className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Stream Ended
              </p>
              <p className="text-xs text-muted-foreground">
                {config.title || "My Live Stream"}
              </p>
            </div>
          </div>

          {/* Recording placeholder */}
          <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center gap-2 border border-border">
            <Radio className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Recording available for 30 days
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs h-7"
            >
              ▶ Playback
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Eye, label: "Peak Viewers", value: "248" },
              { icon: Clock, label: "Watch Time", value: "42 min" },
              { icon: DollarSign, label: "Donations", value: "₹840" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-card rounded-xl p-3 text-center border border-border"
              >
                <Icon className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-base font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-xs"
            data-ocid="create-highlights-btn"
            onClick={() => toast.info("Highlight creation coming soon!")}
          >
            <Zap className="h-3.5 w-3.5 text-accent" />
            Create Highlights
          </Button>
        </div>
        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground rounded-xl h-11"
          onClick={() => {
            setStreamEnded(false);
            setStep(1);
            setConfig(DEFAULT_CONFIG);
          }}
          data-ocid="new-stream-btn"
        >
          Start New Stream
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="flex items-center gap-2" data-ocid="stream-steps">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-smooth ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-tight">
              {s === 1 ? "Setup" : s === 2 ? "Monetize" : "Go Live"}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Setup */}
      {step === 1 && (
        <div className="space-y-4" data-ocid="stream-setup-step">
          <div className="space-y-2">
            <Label htmlFor="stream-title" className="text-sm font-semibold">
              Stream Title <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="stream-title"
                placeholder="e.g. Live: Harvesting Tips for Rabi Season"
                value={config.title}
                onChange={(e) => set("title", e.target.value)}
                className="rounded-xl flex-1"
                data-ocid="stream-title-input"
              />
              <VoiceInputButton
                aria-label="Voice input for stream title"
                onResult={(t) =>
                  set("title", config.title ? `${config.title} ${t}` : t)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream-desc" className="text-sm font-semibold">
              Description
            </Label>
            <div className="flex items-start gap-2">
              <Textarea
                id="stream-desc"
                placeholder="What will you cover in this stream?"
                value={config.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="rounded-xl resize-none flex-1"
                data-ocid="stream-desc-input"
              />
              <VoiceInputButton
                aria-label="Voice input for description"
                onResult={(t) =>
                  set(
                    "description",
                    config.description ? `${config.description} ${t}` : t,
                  )
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Category</Label>
            <Select
              value={config.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger
                className="rounded-xl"
                data-ocid="stream-category-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STREAM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Location
              </Label>
              <Select
                value={config.audienceLocation}
                onValueChange={(v) => set("audienceLocation", v)}
              >
                <SelectTrigger
                  className="rounded-xl text-xs"
                  data-ocid="stream-location-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-india">All India</SelectItem>
                  <SelectItem value="your-district">Your District</SelectItem>
                  <SelectItem value="your-village">Your Village</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> Audience
              </Label>
              <Select
                value={config.audienceRole}
                onValueChange={(v) => set("audienceRole", v)}
              >
                <SelectTrigger
                  className="rounded-xl text-xs"
                  data-ocid="stream-audience-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="farmers">Farmers</SelectItem>
                  <SelectItem value="buyers">Buyers</SelectItem>
                  <SelectItem value="educators">Educators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 bg-muted/40 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Schedule
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("scheduleNow", true)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-smooth ${config.scheduleNow ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  data-ocid="stream-start-now"
                >
                  Start Now
                </button>
                <button
                  type="button"
                  onClick={() => set("scheduleNow", false)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-smooth ${!config.scheduleNow ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  data-ocid="stream-schedule"
                >
                  Schedule
                </button>
              </div>
            </div>
            {!config.scheduleNow && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={config.scheduledDate}
                  onChange={(e) => set("scheduledDate", e.target.value)}
                  className="rounded-xl text-xs"
                  data-ocid="stream-date-input"
                />
                <Input
                  type="time"
                  value={config.scheduledTime}
                  onChange={(e) => set("scheduledTime", e.target.value)}
                  className="rounded-xl text-xs"
                  data-ocid="stream-time-input"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Monetization */}
      {step === 2 && (
        <div className="space-y-4" data-ocid="stream-monetize-step">
          <div className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
            <Label className="text-sm font-semibold">Free Stream</Label>
            <Switch
              checked={config.isFree}
              onCheckedChange={(v) => set("isFree", v)}
              data-ocid="stream-free-toggle"
            />
          </div>

          {!config.isFree && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Pay-per-view Price (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 99"
                min={0}
                value={config.paidPrice}
                onChange={(e) => set("paidPrice", e.target.value)}
                className="rounded-xl"
                data-ocid="stream-ppv-price-input"
              />
            </div>
          )}

          <div className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
            <div>
              <Label className="text-sm font-semibold">
                Accept Tips / Donations
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Viewers can support you during stream
              </p>
            </div>
            <Switch
              checked={config.tipsEnabled}
              onCheckedChange={(v) => set("tipsEnabled", v)}
              data-ocid="stream-tips-toggle"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Link Product/Listing{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="Paste listing ID or product name..."
              value={config.linkedProduct}
              onChange={(e) => set("linkedProduct", e.target.value)}
              className="rounded-xl"
              data-ocid="stream-linked-product-input"
            />
            <p className="text-xs text-muted-foreground">
              Viewers can buy directly while watching
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Go Live */}
      {step === 3 && (
        <div className="space-y-4" data-ocid="stream-preview-step">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge-live animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                LIVE
              </span>
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            <p className="font-display font-bold text-base text-foreground">
              {config.title || "Untitled Stream"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {config.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {config.audienceLocation === "all-india"
                  ? "All India"
                  : config.audienceLocation}
              </Badge>
              {config.isFree ? (
                <Badge
                  variant="outline"
                  className="text-xs text-success border-success/40"
                >
                  Free
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs text-accent border-accent/40"
                >
                  ₹{config.paidPrice} PPV
                </Badge>
              )}
              {config.tipsEnabled && (
                <Badge variant="outline" className="text-xs">
                  Tips Enabled
                </Badge>
              )}
            </div>
            {config.description && (
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            )}
            <div className="flex items-center gap-4 pt-1 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> Audience:{" "}
                {config.audienceRole === "all"
                  ? "All roles"
                  : config.audienceRole}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart2 className="h-3 w-3" /> Analytics enabled
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={goLive}
            className="w-full h-13 bg-[oklch(var(--live-indicator))] text-white font-bold text-base rounded-xl gap-2 hover:opacity-90 transition-smooth"
            data-ocid="go-live-btn"
          >
            <Radio className="h-5 w-5 animate-pulse" />
            Go Live Now
          </Button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-xl gap-1"
            data-ocid="stream-back-btn"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        )}
        {step < 3 && (
          <Button
            type="button"
            onClick={() => {
              if (step === 1 && !config.title.trim()) {
                toast.error("Please add a stream title first.");
                return;
              }
              setStep((s) => s + 1);
            }}
            className="flex-1 bg-primary text-primary-foreground rounded-xl gap-1"
            data-ocid="stream-next-btn"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
