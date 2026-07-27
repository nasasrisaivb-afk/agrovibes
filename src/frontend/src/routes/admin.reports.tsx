import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminReports } from "@/lib/backend";
import { dateToNs, formatInr } from "@/lib/format";
import { createRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { Route as adminRoute } from "./admin";

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function AdminReportsScreen() {
  const [from, setFrom] = useState(() =>
    toInputDate(new Date(Date.now() - 30 * 24 * 3600 * 1000)),
  );
  const [to, setTo] = useState(() => toInputDate(new Date()));

  const fromNs = dateToNs(new Date(`${from}T00:00:00`));
  // End date is inclusive: query up to the end of that day.
  const toNs = dateToNs(new Date(`${to}T23:59:59.999`));
  const reports = useAdminReports({ fromNs, toNs });

  const data = reports.data;
  const stats = data
    ? [
        {
          label: "GMV",
          value: formatInr(data.gmvInr),
          hint: "Paid + refunded order value in range",
        },
        {
          label: "Orders",
          value: data.orderCount.toString(),
          hint: `${data.refundedOrderCount.toString()} refunded`,
        },
        {
          label: "Active users",
          value: data.activeUserCount.toString(),
          hint: "Buyers + sellers with orders in range",
        },
        {
          label: "New users",
          value: data.newUserCount.toString(),
          hint: `${data.totalUserCount.toString()} total on platform`,
        },
        {
          label: "New listings",
          value: data.newListingCount.toString(),
          hint: `${data.publishedListingCount.toString()} live right now`,
        },
        {
          label: "Payouts paid",
          value: formatInr(data.payoutPaidInr),
          hint: "Settled to sellers in range",
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Platform metrics, filterable by date range.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="from-date">From</Label>
          <Input
            id="from-date"
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="to-date">To</Label>
          <Input
            id="to-date"
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {reports.isPending ? (
        <ListSkeleton rows={2} />
      ) : reports.isError ? (
        <ErrorState error={reports.error} onRetry={() => reports.refetch()} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <BarChart3
                  className="h-3.5 w-3.5 text-primary"
                  aria-hidden="true"
                />
                {stat.label}
              </div>
              <p className="mt-1.5 font-mono text-2xl font-bold">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {stat.hint}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => adminRoute,
  path: "/reports",
  component: AdminReportsScreen,
});
