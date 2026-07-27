import { TicketCategory, TicketStatus, UserRole } from "@/backend";
import { AddBankAccountDialog } from "@/components/profile/AddBankAccountDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/Skeletons";
import {
  BankStatusBadge,
  KycStatusBadge,
  PayoutStatusBadge,
} from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  useCreateSupportTicket,
  useMyBankAccounts,
  useMyPayouts,
  useMySupportTickets,
} from "@/lib/backend";
import { errorMessage } from "@/lib/errors";
import { formatDate, formatInr } from "@/lib/format";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Banknote,
  Landmark,
  LifeBuoy,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Route as appLayoutRoute } from "./app-layout";

const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  [TicketCategory.PAYMENTS]: "Payments",
  [TicketCategory.KYC]: "KYC / verification",
  [TicketCategory.ORDER_DISPUTE]: "Order dispute",
  [TicketCategory.ACCOUNT]: "Account",
  [TicketCategory.TECHNICAL]: "Technical issue",
};

const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "Open",
  [TicketStatus.IN_PROGRESS]: "In progress",
  [TicketStatus.RESOLVED]: "Resolved",
  [TicketStatus.CLOSED]: "Closed",
};

function NewTicketDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const createTicket = useCreateSupportTicket();
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.KYC);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate(
      { category, subject, body },
      {
        onSuccess: () => {
          toast.success(
            "Support ticket created — we typically respond within 24 hours.",
          );
          setSubject("");
          setBody("");
          onClose();
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact support</DialogTitle>
          <DialogDescription>
            Tell us what's wrong and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-category">Topic</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as TicketCategory)}
            >
              <SelectTrigger id="ticket-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TICKET_CATEGORY_LABELS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input
              id="ticket-subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-body">Details</Label>
            <Textarea
              id="ticket-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What happened? Include order numbers if relevant."
            />
          </div>
          <Button
            type="submit"
            disabled={createTicket.isPending || subject.trim() === ""}
            className="w-full tap-target"
          >
            {createTicket.isPending && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Submit ticket
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProfileScreen() {
  const navigate = useNavigate();
  const { section } = Route.useSearch();
  const { isAuthenticated, isLoading, user, isBuyer, isSeller, logout } =
    useAuth();
  const bankAccounts = useMyBankAccounts();
  const payouts = useMyPayouts();
  const tickets = useMySupportTickets();
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  useEffect(() => {
    if (section === "support" && isAuthenticated) setTicketDialogOpen(true);
  }, [section, isAuthenticated]);

  if (isLoading) return <ListSkeleton rows={3} />;
  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        icon={UserRound}
        title="You're not signed in"
        description="Sign in with your mobile number to manage your profile, bank accounts and payouts."
        actionLabel="Sign in"
        onAction={() => navigate({ to: "/auth", search: {} })}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 font-display text-xl font-bold text-primary">
          {(user.name || "U").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold">
            {user.name || "CropVibe user"}
          </h1>
          <p className="text-sm text-muted-foreground">+91 {user.phone}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {user.roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium"
              >
                {role === UserRole.BUYER ? "Buyer" : "Seller"}
              </span>
            ))}
            <KycStatusBadge status={user.kycStatus} />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Link
          to="/kyc"
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition-colors hover:border-primary/40"
        >
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Identity verification
          <span className="ml-auto text-muted-foreground">Manage</span>
        </Link>
        {!isSeller && (
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/auth", search: { addRole: "SELLER" } })
            }
            className="tap-target flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm font-medium transition-colors hover:border-primary/40"
          >
            <BadgeCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Become a seller
            <span className="ml-auto text-muted-foreground">Set up</span>
          </button>
        )}
        {!isBuyer && (
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/auth", search: { addRole: "BUYER" } })
            }
            className="tap-target flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm font-medium transition-colors hover:border-primary/40"
          >
            <BadgeCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Start buying
            <span className="ml-auto text-muted-foreground">Set up</span>
          </button>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Landmark className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
            Bank accounts
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBankDialogOpen(true)}
            className="tap-target"
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add
          </Button>
        </div>
        {bankAccounts.isPending ? (
          <ListSkeleton rows={1} />
        ) : bankAccounts.isError ? (
          <ErrorState
            error={bankAccounts.error}
            onRetry={() => bankAccounts.refetch()}
          />
        ) : (bankAccounts.data ?? []).length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No bank account yet"
            description="Add and verify a bank account to receive payouts from your sales."
            actionLabel="Add bank account"
            onAction={() => setBankDialogOpen(true)}
          />
        ) : (
          <div className="space-y-2">
            {(bankAccounts.data ?? []).map((account) => (
              <div
                key={account.id.toString()}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {account.bankName} ····{account.accountNumberLast4}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {account.branch} · {account.accountHolderName}
                  </p>
                </div>
                <BankStatusBadge status={account.verificationStatus} />
              </div>
            ))}
          </div>
        )}
      </section>

      {isSeller && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
            Payouts
          </h2>
          {payouts.isPending ? (
            <ListSkeleton rows={1} />
          ) : payouts.isError ? (
            <ErrorState
              error={payouts.error}
              onRetry={() => payouts.refetch()}
            />
          ) : (payouts.data ?? []).length === 0 ? (
            <EmptyState
              icon={Banknote}
              title="No payouts yet"
              description="Payouts are scheduled automatically after your orders complete, following the hold period."
              actionLabel="View my sales"
              onAction={() => navigate({ to: "/orders" })}
            />
          ) : (
            <div className="space-y-2">
              {(payouts.data ?? []).map((payout) => (
                <div
                  key={payout.id.toString()}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold">
                      {formatInr(payout.amountInr)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payout.orderId !== undefined
                        ? `Order #${payout.orderId.toString()} · `
                        : ""}
                      {payout.paidAt !== undefined
                        ? `Paid ${formatDate(payout.paidAt)}`
                        : `Scheduled for ${formatDate(payout.scheduledFor)}`}
                    </p>
                  </div>
                  <PayoutStatusBadge status={payout.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <LifeBuoy className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
            Support
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTicketDialogOpen(true)}
            className="tap-target"
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> New ticket
          </Button>
        </div>
        {tickets.isPending ? (
          <ListSkeleton rows={1} />
        ) : tickets.isError ? (
          <ErrorState error={tickets.error} onRetry={() => tickets.refetch()} />
        ) : (tickets.data ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-4 text-center text-sm text-muted-foreground">
            No support tickets. If anything goes wrong with payments, KYC or
            orders, raise one here.
          </p>
        ) : (
          <div className="space-y-2">
            {(tickets.data ?? []).map((ticket) => (
              <div
                key={ticket.id.toString()}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-medium">
                    {ticket.subject}
                  </p>
                  <span className="whitespace-nowrap rounded-full border border-border bg-muted px-2 py-0.5 text-[11px]">
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {TICKET_CATEGORY_LABELS[ticket.category]} ·{" "}
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Button
        variant="outline"
        onClick={async () => {
          await logout();
          navigate({ to: "/" });
        }}
        className="w-full tap-target"
      >
        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Sign out
      </Button>

      <AddBankAccountDialog
        open={bankDialogOpen}
        onClose={() => setBankDialogOpen(false)}
      />
      <NewTicketDialog
        open={ticketDialogOpen}
        onClose={() => setTicketDialogOpen(false)}
      />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/profile",
  validateSearch: (search: Record<string, unknown>): { section?: string } => ({
    section: typeof search.section === "string" ? search.section : undefined,
  }),
  component: ProfileScreen,
});
