import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Globe,
  Mail,
  MessageSquare,
  Moon,
  Smartphone,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type NotifType =
  | "transaction"
  | "educational"
  | "market"
  | "system"
  | "emergency";

interface NotifTypeConfig {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const NOTIF_TYPES: Record<NotifType, NotifTypeConfig> = {
  transaction: {
    label: "Transactions",
    description: "Orders, payments, escrow",
    icon: Zap,
    color: "text-success",
  },
  educational: {
    label: "Education",
    description: "Courses, certifications",
    icon: Globe,
    color: "text-primary",
  },
  market: {
    label: "Market Intel",
    description: "Price updates, mandi rates",
    icon: Bell,
    color: "text-accent-foreground",
  },
  system: {
    label: "System",
    description: "App updates, maintenance",
    icon: Smartphone,
    color: "text-muted-foreground",
  },
  emergency: {
    label: "Emergency",
    description: "Pest alerts, weather warnings",
    icon: AlertTriangle,
    color: "text-destructive",
  },
};

const NOTIF_LANG_OPTIONS = [
  { label: "English", value: "en" },
  { label: "हिंदी", value: "hi" },
  { label: "తెలుగు", value: "te" },
  { label: "தமிழ்", value: "ta" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return { label: `${h}:00 ${ampm}`, value: i };
});

export function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<NotifType, boolean>>(() => ({
    transaction: true,
    educational: true,
    market: true,
    system: false,
    emergency: true,
  }));

  const [channels, setChannels] = useState({
    inApp: true,
    email: false,
    sms: false,
  });

  const [quietStart, setQuietStart] = useState(22);
  const [quietEnd, setQuietEnd] = useState(6);
  const [notifLang, setNotifLang] = useState("en");

  const toggleType = (type: NotifType, val: boolean) => {
    setEnabled((prev) => ({ ...prev, [type]: val }));
    toast.success(
      `${NOTIF_TYPES[type].label} notifications ${val ? "enabled" : "disabled"}`,
    );
  };

  const toggleChannel = (key: keyof typeof channels, val: boolean) => {
    setChannels((prev) => ({ ...prev, [key]: val }));
  };

  const handleTestNotif = () => {
    toast.info("🔔 Test Notification", {
      description: "Your notification settings are working correctly!",
      duration: 4000,
    });
  };

  return (
    <section>
      <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
        Notification Settings
      </h2>

      <div className="flex flex-col gap-3">
        {/* Priority per-type toggles */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold">Notification Types</p>
          </div>
          {(Object.entries(NOTIF_TYPES) as [NotifType, NotifTypeConfig][]).map(
            ([type, conf], i, arr) => {
              const Icon = conf.icon;
              return (
                <div
                  key={type}
                  className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border/60" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className={`h-4 w-4 ${conf.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">{conf.label}</p>
                      {type === "emergency" && (
                        <Badge className="bg-destructive/10 text-destructive border-0 text-[9px] px-1">
                          Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {conf.description}
                    </p>
                  </div>
                  <Switch
                    id={`notif-type-${type}`}
                    checked={enabled[type]}
                    onCheckedChange={(val) => toggleType(type, val)}
                    data-ocid={`notif.${type}-toggle`}
                  />
                </div>
              );
            },
          )}
        </div>

        {/* Delivery preferences */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold">Delivery Channels</p>
          </div>
          {[
            {
              key: "inApp" as const,
              icon: Bell,
              label: "In-App",
              desc: "Banner & bell notifications",
              available: true,
            },
            {
              key: "email" as const,
              icon: Mail,
              label: "Email",
              desc: "Delivery to your email",
              available: false,
            },
            {
              key: "sms" as const,
              icon: MessageSquare,
              label: "SMS",
              desc: "Text message alerts",
              available: false,
            },
          ].map(({ key, icon: Icon, label, desc, available }, i, arr) => (
            <div
              key={key}
              className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border/60" : ""}`}
            >
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{label}</p>
                  {!available && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 border-border text-muted-foreground"
                    >
                      Soon
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              <Switch
                id={`notif-channel-${key}`}
                checked={channels[key]}
                disabled={!available}
                onCheckedChange={(val) => toggleChannel(key, val)}
                data-ocid={`notif.channel-${key}-toggle`}
              />
            </div>
          ))}
        </div>

        {/* Quiet hours */}
        <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Quiet Hours</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Suppress non-critical notifications during this time
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="quiet-start"
                className="text-xs text-muted-foreground"
              >
                From
              </Label>
              <div className="relative">
                <select
                  id="quiet-start"
                  value={quietStart}
                  onChange={(e) => setQuietStart(Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-border bg-muted/50 text-sm px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  data-ocid="notif.quiet-start-select"
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="quiet-end"
                className="text-xs text-muted-foreground"
              >
                To
              </Label>
              <div className="relative">
                <select
                  id="quiet-end"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-border bg-muted/50 text-sm px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  data-ocid="notif.quiet-end-select"
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-xl">
            <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">
              Quiet from {HOURS[quietStart]?.label} to {HOURS[quietEnd]?.label}{" "}
              (emergency alerts always active)
            </p>
          </div>
        </div>

        {/* Language preference */}
        <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Notification Language</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {NOTIF_LANG_OPTIONS.map((lang) => (
              <button
                type="button"
                key={lang.value}
                onClick={() => setNotifLang(lang.value)}
                className={`h-9 rounded-xl border text-xs font-medium transition-smooth ${
                  notifLang === lang.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                aria-pressed={notifLang === lang.value}
                data-ocid="notif.lang-btn"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test notification */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5 transition-smooth"
          onClick={handleTestNotif}
          data-ocid="notif.test-btn"
        >
          <Bell className="h-4 w-4" />
          Send Test Notification
        </Button>
      </div>
    </section>
  );
}
