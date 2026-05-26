import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bug, CloudRain, MapPin, RefreshCw } from "lucide-react";
import { useState } from "react";
import { AlertSeverity, AlertType } from "../../types";
import type { Alert } from "../../types";

interface Props {
  alerts: Alert[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SEVERITY_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; badge: string }
> = {
  [AlertSeverity.Critical]: {
    bg: "bg-destructive/8",
    border: "border-destructive/30",
    text: "text-destructive",
    badge: "bg-destructive text-destructive-foreground",
  },
  [AlertSeverity.High]: {
    bg: "bg-warning/8",
    border: "border-warning/30",
    text: "text-warning",
    badge: "bg-warning text-warning-foreground",
  },
  [AlertSeverity.Medium]: {
    bg: "bg-accent/8",
    border: "border-accent/30",
    text: "text-accent",
    badge: "bg-accent/80 text-accent-foreground",
  },
  [AlertSeverity.Low]: {
    bg: "bg-muted/60",
    border: "border-border",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

function timeAgo(tsMs: number): string {
  const diff = Date.now() - tsMs;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function AlertsSection({ alerts, onRefresh, isRefreshing }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]">
            {alerts.length} Active
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={onRefresh}
          disabled={isRefreshing}
          data-ocid="alerts-refresh"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {alerts.map((alert) => {
          const cfg =
            SEVERITY_CONFIG[alert.severity] ??
            SEVERITY_CONFIG[AlertSeverity.Low];
          const Icon = alert.alertType === AlertType.Weather ? CloudRain : Bug;
          const id = alert.id.toString();
          const isExpanded = expanded === id;
          const tsMs = Number(alert.timestamp);

          return (
            <button
              key={id}
              type="button"
              className={`rounded-xl border p-3 flex gap-3 items-start text-left w-full transition-colors ${cfg.bg} ${cfg.border}`}
              onClick={() => setExpanded(isExpanded ? null : id)}
              data-ocid="alert-card"
            >
              <div className={`mt-0.5 flex-shrink-0 ${cfg.text}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-semibold text-sm ${cfg.text}`}>
                    {alert.title}
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${cfg.badge}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${cfg.text} opacity-80 ${isExpanded ? "" : "line-clamp-2"}`}
                >
                  {alert.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className={`h-3 w-3 ${cfg.text} opacity-60`} />
                  <span className={`text-[10px] ${cfg.text} opacity-60`}>
                    {alert.location}
                  </span>
                  <span
                    className={`text-[10px] ${cfg.text} opacity-40 ml-auto`}
                  >
                    {timeAgo(tsMs)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
