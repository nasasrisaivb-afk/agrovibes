import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  History,
  Lock,
  PlusCircle,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DisputeFlowModal } from "./DisputeFlowModal";

interface TxItem {
  id: string;
  type: "in" | "out" | "escrow";
  amount: number;
  description: string;
  date: string;
}

const TRANSACTIONS: TxItem[] = [
  {
    id: "t1",
    type: "in",
    amount: 2450,
    description: "Sale: Organic Tomatoes",
    date: "Apr 14",
  },
  {
    id: "t2",
    type: "out",
    amount: 850,
    description: "Purchase: Seeds pack",
    date: "Apr 12",
  },
  {
    id: "t3",
    type: "escrow",
    amount: 1200,
    description: "Escrow: Basmati Rice deal",
    date: "Apr 10",
  },
  {
    id: "t4",
    type: "in",
    amount: 3200,
    description: "Sale: Alphonso Mangoes",
    date: "Apr 8",
  },
  {
    id: "t5",
    type: "out",
    amount: 500,
    description: "Course: Organic Farming",
    date: "Apr 6",
  },
];

const ESCROW_PENDING = [
  {
    id: "e1",
    amount: 1200,
    description: "Basmati Rice — 50kg",
    seller: "Amit Patel",
    dueDate: "Apr 18",
  },
  {
    id: "e2",
    amount: 850,
    description: "Spice Kit Bundle",
    seller: "Meera Singh",
    dueDate: "Apr 20",
  },
];

const TX_ICONS = {
  in: ArrowDownLeft,
  out: ArrowUpRight,
  escrow: Lock,
};

const TX_COLORS = {
  in: "text-success bg-success/10",
  out: "text-destructive bg-destructive/10",
  escrow: "text-trust bg-trust/10",
};

const QUICK_ACTIONS = [
  { icon: PlusCircle, label: "Top Up", ocid: "wallet-topup-btn" },
  { icon: ArrowUpRight, label: "Withdraw", ocid: "wallet-withdraw-btn" },
  { icon: Send, label: "Transfer", ocid: "wallet-transfer-btn" },
  { icon: History, label: "History", ocid: "wallet-history-btn" },
];

export function WalletSection() {
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);
  const handleAction = (label: string) =>
    toast.info(label, { description: "Coming soon!" });

  return (
    <section>
      <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
        Wallet
      </h2>

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
          <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center mb-0.5">
            <Wallet className="h-3.5 w-3.5 text-success" />
          </div>
          <p className="font-display font-bold text-base text-success leading-tight">
            ₹2,450
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Available
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
          <div className="w-7 h-7 rounded-lg bg-trust/10 flex items-center justify-center mb-0.5">
            <ShieldCheck className="h-3.5 w-3.5 text-trust" />
          </div>
          <p className="font-display font-bold text-base text-trust leading-tight">
            ₹1,200
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Escrow
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-1">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mb-0.5">
            <ArrowDownLeft className="h-3.5 w-3.5 text-accent-foreground" />
          </div>
          <p
            className="font-display font-bold text-base leading-tight"
            style={{ color: "oklch(var(--role-educator))" }}
          >
            ₹850
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Earnings
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {QUICK_ACTIONS.map(({ icon: Icon, label, ocid }) => (
          <button
            type="button"
            key={label}
            className="flex flex-col items-center gap-1 bg-card rounded-2xl border border-border py-3 hover:bg-muted/40 transition-smooth"
            onClick={() => handleAction(label)}
            data-ocid={ocid}
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-3">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold">Recent Transactions</p>
          <button
            type="button"
            className="text-[10px] text-primary hover:text-primary/80 transition-colors"
            onClick={() => handleAction("Full History")}
            data-ocid="view-all-transactions-btn"
          >
            View all
          </button>
        </div>
        {TRANSACTIONS.map((tx, i) => {
          const Icon = TX_ICONS[tx.type];
          const colorClass = TX_COLORS[tx.type];
          return (
            <div
              key={tx.id}
              className={`flex items-center gap-3 px-4 py-3 ${i < TRANSACTIONS.length - 1 ? "border-b border-border/60" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{tx.description}</p>
                <p className="text-[10px] text-muted-foreground">{tx.date}</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "in"
                    ? "text-success"
                    : tx.type === "escrow"
                      ? "text-trust"
                      : "text-destructive"
                }`}
              >
                {tx.type === "in" ? "+" : "-"}₹{tx.amount}
              </span>
            </div>
          );
        })}
      </div>

      {/* Escrow pending */}
      <div className="bg-card rounded-2xl border border-trust/30 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-trust/20 bg-trust/5 flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-trust" />
          <p className="text-xs font-semibold text-trust">Escrow Holdings</p>
          <Badge className="bg-trust/10 text-trust border-0 text-[9px] ml-auto">
            2 pending
          </Badge>
        </div>
        {ESCROW_PENDING.map((esc, i) => (
          <div key={esc.id}>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {esc.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {esc.seller} · Due {esc.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="h-3 w-3 text-trust" />
                  <span className="text-sm font-bold text-trust">
                    ₹{esc.amount}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-[10px] border-success/40 text-success hover:bg-success/5"
                  onClick={() =>
                    toast.success("Escrow released!", {
                      description: "Funds will be transferred within 24 hours.",
                    })
                  }
                  data-ocid="release-escrow-btn"
                >
                  Release
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-[10px] border-destructive/40 text-destructive hover:bg-destructive/5"
                  onClick={() => setDisputeOrderId(esc.id)}
                  data-ocid="dispute-escrow-btn"
                >
                  Dispute
                </Button>
              </div>
            </div>
            {i < ESCROW_PENDING.length - 1 && (
              <Separator className="opacity-50" />
            )}
          </div>
        ))}
        <div className="px-4 py-2 bg-muted/30 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground text-center">
            💰 ₹
            {ESCROW_PENDING.reduce((a, e) => a + e.amount, 0).toLocaleString()}{" "}
            is held safely until resolved
          </p>
        </div>
      </div>
      <DisputeFlowModal
        open={!!disputeOrderId}
        orderId={disputeOrderId ?? ""}
        onClose={() => setDisputeOrderId(null)}
      />
    </section>
  );
}
