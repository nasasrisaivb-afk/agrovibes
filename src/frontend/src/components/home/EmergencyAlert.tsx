import { AlertTriangle, Info, X, Zap } from "lucide-react";
import { useState } from "react";
import type { Alert, AlertSeverity } from "../../types";

interface EmergencyAlertProps {
  alert: Alert;
}

function isCritical(severity: AlertSeverity) {
  const s = severity as unknown as Record<string, null>;
  return s.Critical !== undefined;
}

function isHigh(severity: AlertSeverity) {
  const s = severity as unknown as Record<string, null>;
  return s.High !== undefined;
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  if (isCritical(severity)) return <Zap className="h-4 w-4 flex-shrink-0" />;
  if (isHigh(severity))
    return <AlertTriangle className="h-4 w-4 flex-shrink-0" />;
  return <Info className="h-4 w-4 flex-shrink-0" />;
}

function severityClass(severity: AlertSeverity): string {
  if (isCritical(severity))
    return "bg-destructive/10 text-foreground border-destructive/40";
  if (isHigh(severity))
    return "bg-warning/10 text-foreground border-[oklch(var(--warning)/0.3)]";
  return "bg-muted border-border text-foreground";
}

export function EmergencyAlert({ alert }: EmergencyAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  if (!isCritical(alert.severity) && !isHigh(alert.severity)) return null;

  const cls = severityClass(alert.severity);

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${cls}`}
      role="alert"
      aria-live="assertive"
      data-ocid="emergency-alert"
    >
      <SeverityIcon severity={alert.severity} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight">{alert.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {alert.description}
        </p>
        <button
          type="button"
          className="mt-1.5 text-xs font-semibold text-destructive underline underline-offset-2 hover:no-underline"
          data-ocid="emergency-alert-view-details"
          aria-label={`View details for ${alert.title}`}
        >
          View Details
        </button>
      </div>
      <button
        type="button"
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-smooth rounded-lg p-1 hover:bg-muted"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
        data-ocid="emergency-alert-dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function EmergencyAlertList({ alerts }: { alerts: Alert[] }) {
  const urgent = alerts.filter(
    (a) => isCritical(a.severity) || isHigh(a.severity),
  );

  if (urgent.length === 0) return null;

  return (
    <div className="flex flex-col gap-2" data-ocid="emergency-alerts-list">
      {urgent.slice(0, 2).map((alert) => (
        <EmergencyAlert key={alert.id.toString()} alert={alert} />
      ))}
    </div>
  );
}
