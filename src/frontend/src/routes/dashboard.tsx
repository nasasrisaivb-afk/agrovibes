import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INVENTORY_ITEMS,
  SALES_ANALYTICS,
  SELLER_LISTINGS,
  TEAM_MEMBERS,
} from "@/mocks/backend";
import type { InventoryItem, TeamMember } from "@/types";
import { createRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Box,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Inbox,
  MessageSquare,
  Package,
  Paperclip,
  Send,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Route as rootRoute } from "./__root";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderRow {
  id: string;
  buyer: string;
  product: string;
  amount: string;
  status: "Processing" | "Shipped" | "Delivered";
}

interface ChatThread {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: number;
  messages: { sender: "buyer" | "seller"; text: string; time: string }[];
}

interface Transaction {
  date: string;
  description: string;
  amount: string;
  type: "credit" | "debit";
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const RECENT_ORDERS: OrderRow[] = [
  {
    id: "#2048",
    buyer: "Anita Sharma",
    product: "Basmati Rice (Pusa 1121)",
    amount: "₹3,500",
    status: "Processing",
  },
  {
    id: "#2047",
    buyer: "Ramesh Yadav",
    product: "Organic Tomatoes (Grade A)",
    amount: "₹1,350",
    status: "Shipped",
  },
  {
    id: "#2045",
    buyer: "Kavitha Nair",
    product: "Green Cardamom (100g)",
    amount: "₹3,200",
    status: "Delivered",
  },
  {
    id: "#2043",
    buyer: "Harpreet Singh",
    product: "Wheat HYV Seeds",
    amount: "₹2,200",
    status: "Shipped",
  },
  {
    id: "#2041",
    buyer: "Meena Bisht",
    product: "Himalayan Apples",
    amount: "₹1,200",
    status: "Delivered",
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Low stock: Tomato Seeds below threshold",
    type: "warning" as const,
  },
  { id: 2, text: "New dispute case #87 opened", type: "alert" as const },
];

const CHAT_THREADS: ChatThread[] = [
  {
    id: 1,
    name: "Anita Sharma",
    preview: "Can you deliver by Thursday?",
    time: "10m",
    unread: 2,
    messages: [
      {
        sender: "buyer",
        text: "Hello! Are you still selling Basmati?",
        time: "10:30 AM",
      },
      {
        sender: "seller",
        text: "Yes, 50kg available. ₹85/kg.",
        time: "10:32 AM",
      },
      {
        sender: "buyer",
        text: "Can you deliver by Thursday?",
        time: "10:45 AM",
      },
      {
        sender: "seller",
        text: "Yes, Thursday morning works. I'll arrange transport.",
        time: "10:50 AM",
      },
      {
        sender: "buyer",
        text: "Great, please share the tracking once dispatched.",
        time: "10:52 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Ramesh Yadav",
    preview: "Yes, the ghee batch is ready.",
    time: "2h",
    unread: 0,
    messages: [
      {
        sender: "buyer",
        text: "Is the fresh ghee batch ready?",
        time: "9:00 AM",
      },
      {
        sender: "seller",
        text: "Yes, the ghee batch is ready. 20L available.",
        time: "9:15 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Arun Mehta",
    preview: "I recommend soil testing first.",
    time: "1d",
    unread: 1,
    messages: [
      {
        sender: "buyer",
        text: "My wheat crop is showing yellow patches. What should I do?",
        time: "Yesterday",
      },
      {
        sender: "seller",
        text: "I recommend soil testing first. Nitrogen deficiency is common this season.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 4,
    name: "Harpreet Singh",
    preview: "Tractor is available next week.",
    time: "2d",
    unread: 0,
    messages: [
      {
        sender: "buyer",
        text: "Is the rotavator available for rent?",
        time: "2 days ago",
      },
      {
        sender: "seller",
        text: "Tractor is available next week. ₹900/day.",
        time: "2 days ago",
      },
    ],
  },
  {
    id: 5,
    name: "AgroExpress Logistics",
    preview: "Your shipment has been picked up.",
    time: "3d",
    unread: 0,
    messages: [
      {
        sender: "buyer",
        text: "When will my shipment be picked up?",
        time: "3 days ago",
      },
      {
        sender: "seller",
        text: "Your shipment has been picked up. Tracking: AGX-8842.",
        time: "3 days ago",
      },
    ],
  },
];

const TRANSACTIONS: Transaction[] = [
  {
    date: "21 May 2025",
    description: "Order #2048 — Basmati Rice",
    amount: "+₹3,500",
    type: "credit",
  },
  {
    date: "20 May 2025",
    description: "Order #2047 — Organic Tomatoes",
    amount: "+₹1,350",
    type: "credit",
  },
  {
    date: "19 May 2025",
    description: "Escrow release — Order #2045",
    amount: "+₹3,200",
    type: "credit",
  },
  {
    date: "18 May 2025",
    description: "Payout to Bank (ICICI)",
    amount: "-₹25,000",
    type: "debit",
  },
  {
    date: "17 May 2025",
    description: "Order #2043 — Wheat Seeds",
    amount: "+₹2,200",
    type: "credit",
  },
  {
    date: "16 May 2025",
    description: "Platform fee (monthly)",
    amount: "-₹499",
    type: "debit",
  },
  {
    date: "15 May 2025",
    description: "Order #2041 — Apples",
    amount: "+₹1,200",
    type: "credit",
  },
  {
    date: "14 May 2025",
    description: "Refund — Order #2039",
    amount: "-₹850",
    type: "debit",
  },
];

const SEASONAL_TRENDS = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 61 },
  { month: "May", value: 72 },
  { month: "Jun", value: 68 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getListingName(listingId: number): string {
  const listing = SELLER_LISTINGS.find((l) => l.id === listingId);
  return listing?.name ?? `Product #${listingId}`;
}

function getStockColor(current: number, threshold: number): string {
  if (current < threshold) return "bg-destructive";
  if (current < threshold * 1.5) return "bg-warning";
  return "bg-success";
}

function getStockTextColor(current: number, threshold: number): string {
  if (current < threshold) return "text-destructive";
  if (current < threshold * 1.5) return "text-warning";
  return "text-success";
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  badge,
  badgeTone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: string;
  badgeTone?: "positive" | "negative" | "neutral";
}) {
  const badgeClass =
    badgeTone === "positive"
      ? "bg-success/10 text-success border-success/20"
      : badgeTone === "negative"
        ? "bg-destructive/10 text-destructive border-destructive/20"
        : "bg-muted text-muted-foreground";

  return (
    <Card className="border-border bg-card" data-ocid="dashboard.stat_card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          {badge && (
            <Badge variant="outline" className={badgeClass}>
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: OrderRow["status"] }) {
  const map = {
    Processing: "bg-warning/10 text-warning border-warning/20",
    Shipped: "bg-primary/10 text-primary border-primary/20",
    Delivered: "bg-success/10 text-success border-success/20",
  };
  return (
    <Badge variant="outline" className={map[status]}>
      {status}
    </Badge>
  );
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const productName = getListingName(item.listingId);
  const maxStock = item.threshold * 5;
  const percentage = Math.min((item.currentStock / maxStock) * 100, 100);
  const isLow = item.currentStock < item.threshold;
  const barColor = getStockColor(item.currentStock, item.threshold);
  const textColor = getStockTextColor(item.currentStock, item.threshold);

  return (
    <Card
      className="border-border bg-card"
      data-ocid={`dashboard.inventory.item.${item.id}`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-foreground text-sm">{productName}</p>
            <p className={`text-xs mt-0.5 ${textColor}`}>
              {item.currentStock.toLocaleString()} units
            </p>
          </div>
          {isLow && (
            <Badge
              variant="outline"
              className="bg-destructive/10 text-destructive border-destructive/20 text-[0.65rem]"
            >
              Low stock
            </Badge>
          )}
        </div>
        <Progress value={percentage} className="h-2 bg-muted">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[0.65rem] bg-muted/50">
            Sell out in {item.forecastDays} days
          </Badge>
          {isLow && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              data-ocid={`dashboard.inventory.relist_button.${item.id}`}
            >
              Relist
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ChatThreadItem({
  thread,
  isActive,
  onClick,
}: {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted/50 border border-transparent"
      }`}
      data-ocid={`dashboard.messages.thread.${thread.id}`}
    >
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-primary">
          {thread.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground truncate">
            {thread.name}
          </p>
          <span className="text-[0.65rem] text-muted-foreground shrink-0">
            {thread.time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {thread.preview}
        </p>
      </div>
      {thread.unread > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-medium text-primary-foreground shrink-0">
          {thread.unread}
        </span>
      )}
    </button>
  );
}

function ChatView({
  thread,
  onBack,
}: {
  thread: ChatThread;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div
      className="flex flex-col h-full"
      data-ocid="dashboard.messages.chat_view"
    >
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1 rounded-md hover:bg-muted"
          data-ocid="dashboard.messages.back_button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {thread.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{thread.name}</p>
          <p className="text-[0.65rem] text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background">
        {thread.messages.map((msg, idx) => (
          <div
            key={msg.time + msg.text}
            className={`flex ${msg.sender === "buyer" ? "justify-start" : "justify-end"}`}
            data-ocid={`dashboard.messages.chat_message.${idx + 1}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.sender === "buyer"
                  ? "bg-muted text-foreground rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[0.6rem] mt-1 ${msg.sender === "buyer" ? "text-muted-foreground" : "text-primary-foreground/70"}`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-md hover:bg-muted text-muted-foreground"
          data-ocid="dashboard.messages.attach_button"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          data-ocid="dashboard.messages.input"
        />
        <Button
          size="icon"
          className="h-8 w-8 rounded-full"
          data-ocid="dashboard.messages.send_button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div
      className="flex items-center justify-between py-3 border-b border-border last:border-0"
      data-ocid="dashboard.wallet.transaction_row"
    >
      <div>
        <p className="text-sm text-foreground">{tx.description}</p>
        <p className="text-xs text-muted-foreground">{tx.date}</p>
      </div>
      <Badge
        variant="outline"
        className={
          tx.type === "credit"
            ? "bg-success/10 text-success border-success/20"
            : "bg-destructive/10 text-destructive border-destructive/20"
        }
      >
        {tx.amount}
      </Badge>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const timeAgo = useMemo(() => {
    const diff = Date.now() - member.lastActive;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, [member.lastActive]);

  return (
    <Card
      className="border-border bg-card"
      data-ocid={`dashboard.team.member.${member.id}`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <span className="text-[0.65rem] text-muted-foreground">
            {timeAgo}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {member.permissions.map((perm) => (
            <Badge
              key={perm}
              variant="outline"
              className="text-[0.6rem] bg-muted/50 capitalize"
            >
              {perm.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart() {
  const data = useMemo(() => {
    const monthly = SALES_ANALYTICS.filter((s) => s.period === "Monthly");
    return monthly.map((s) => ({
      name: s.cropName,
      revenue: s.totalRevenue,
    }));
  }, []);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Revenue by Crop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      index % 2 === 0
                        ? "hsl(var(--primary))"
                        : "hsl(var(--accent))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function SeasonalTrendsChart() {
  const maxValue = Math.max(...SEASONAL_TRENDS.map((d) => d.value));

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Seasonal Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full flex items-end gap-3 px-2">
          {SEASONAL_TRENDS.map((item, idx) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex justify-center">
                  <div
                    className="w-full max-w-[40px] rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${height * 1.8}px` }}
                    data-ocid={`dashboard.analytics.trend_bar.${idx + 1}`}
                  />
                </div>
                <span className="text-[0.65rem] text-muted-foreground">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

function DashboardContent() {
  const [mobileTab, setMobileTab] = useState("activity");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const sidebarItems = [
    { id: "activity", label: "Activity", icon: Activity },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "team", label: "Team", icon: Users },
  ];

  const activeSection =
    sidebarItems.find((s) => s.id === mobileTab)?.label ?? "Activity";

  // ─── Section Renderers ───────────────────────────────────────────────────

  const ActivitySection = () => (
    <div className="space-y-4" data-ocid="dashboard.activity.section">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Good morning, Rajesh!
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[0.65rem]"
            >
              Seller
            </Badge>
            <span className="text-xs text-muted-foreground">Punjab, India</span>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">RK</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={Wallet}
          label="Today's Earnings"
          value="₹8,450"
          badge="+12%"
          badgeTone="positive"
        />
        <StatCard icon={ShoppingCart} label="Pending Orders" value="3" />
        <StatCard
          icon={Inbox}
          label="New Messages"
          value="7"
          badge="2 unread"
          badgeTone="neutral"
        />
      </div>

      {/* Recent Orders */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-left px-4 py-2 font-medium">Order</th>
                  <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">
                    Buyer
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Product</th>
                  <th className="text-right px-4 py-2 font-medium">Amount</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    data-ocid={`dashboard.orders.row.${idx + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {order.buyer}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[120px]">
                      {order.product}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <div className="space-y-2">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              n.type === "warning"
                ? "bg-warning/5 border-warning/20"
                : "bg-destructive/5 border-destructive/20"
            }`}
            data-ocid={`dashboard.notification.${n.id}`}
          >
            <AlertTriangle
              className={`h-4 w-4 shrink-0 ${n.type === "warning" ? "text-warning" : "text-destructive"}`}
            />
            <p className="text-sm text-foreground">{n.text}</p>
          </div>
        ))}
      </div>

      {/* Mobile Analytics inside Activity */}
      <div className="md:hidden space-y-4 pt-2">
        <RevenueChart />
        <SeasonalTrendsChart />
        <LatencyReport />
      </div>
    </div>
  );

  const InventorySection = () => (
    <div className="space-y-4" data-ocid="dashboard.inventory.section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Inventory Management
        </h2>
        <Button
          size="sm"
          className="h-8 text-xs"
          data-ocid="dashboard.inventory.add_button"
        >
          <Box className="h-3.5 w-3.5 mr-1" />
          Add Inventory
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INVENTORY_ITEMS.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      {/* Forecasting Insight */}
      <Card className="border-border bg-card border-l-4 border-l-primary">
        <CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Forecasting Insight
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sell 200 kg of Rice Seeds to hit ₹1,00,000 target this month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MessagesSection = () => (
    <div
      className="h-[calc(100dvh-180px)] md:h-auto"
      data-ocid="dashboard.messages.section"
    >
      {activeChat ? (
        <ChatView thread={activeChat} onBack={() => setActiveChat(null)} />
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Messages
          </h2>
          {CHAT_THREADS.map((thread) => (
            <ChatThreadItem
              key={thread.id}
              thread={thread}
              isActive={false}
              onClick={() => setActiveChat(thread)}
            />
          ))}
        </div>
      )}
    </div>
  );

  const WalletSection = () => (
    <div className="space-y-4" data-ocid="dashboard.wallet.section">
      {/* Balance Card */}
      <Card className="border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Available Balance</p>
              <p className="text-3xl font-bold">₹45,280</p>
            </div>
            <Wallet className="h-8 w-8 opacity-60" />
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20 text-[0.65rem]"
            >
              ₹12,000 in escrow
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex-1"
              data-ocid="dashboard.wallet.payout_button"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Request Payout ₹45,280
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                You are about to request a payout of ₹45,280 to your linked bank
                account.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">₹45,280</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (1%)</span>
                <span className="font-medium">-₹453</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                <span>You will receive</span>
                <span>₹44,827</span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPayoutOpen(false)}
                data-ocid="dashboard.wallet.payout_cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setPayoutOpen(false)}
                data-ocid="dashboard.wallet.payout_confirm"
              >
                Confirm Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {TRANSACTIONS.map((tx) => (
            <TransactionRow key={tx.date + tx.description} tx={tx} />
          ))}
        </CardContent>
      </Card>

      {/* Tax Invoices */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Tax Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["March 2025 Invoice", "February 2025 Invoice"].map((name, idx) => (
            <button
              type="button"
              key={name}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              data-ocid={`dashboard.wallet.invoice.${idx + 1}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{name}</span>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const AnalyticsSection = () => (
    <div className="space-y-4" data-ocid="dashboard.analytics.section">
      <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <SeasonalTrendsChart />
      </div>
      <LatencyReport />
    </div>
  );

  function LatencyReport() {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Avg. Fulfillment</p>
              <p className="text-lg font-semibold text-foreground">2.3 days</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Top Region</p>
              <p className="text-lg font-semibold text-foreground">
                Maharashtra
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Return Rate</p>
              <p className="text-lg font-semibold text-foreground">1.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const TeamSection = () => (
    <div className="space-y-4" data-ocid="dashboard.team.section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Team Management
        </h2>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-8 text-xs"
              data-ocid="dashboard.team.invite_button"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your seller team.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label
                htmlFor="invite-email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="mt-1 w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                data-ocid="dashboard.team.invite_input"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteOpen(false)}
                data-ocid="dashboard.team.invite_cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setInviteOpen(false)}
                data-ocid="dashboard.team.invite_confirm"
              >
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM_MEMBERS.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );

  // ─── Mobile Layout ─────────────────────────────────────────────────────────

  const MobileView = () => (
    <div
      className="md:hidden min-h-screen bg-background pb-24"
      data-ocid="dashboard.page"
    >
      {/* Mobile Header */}
      <div className="bg-card border-b px-4 py-3 sticky top-0 z-30">
        <h1 className="font-display font-bold text-lg text-foreground">
          Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">{activeSection}</p>
      </div>

      {/* Mobile Tabs */}
      <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
        <div className="sticky top-[60px] z-20 bg-background border-b border-border px-2 py-2">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger
              value="activity"
              className="text-xs"
              data-ocid="dashboard.tab.activity"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="text-xs"
              data-ocid="dashboard.tab.inventory"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="text-xs"
              data-ocid="dashboard.tab.messages"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="text-xs"
              data-ocid="dashboard.tab.wallet"
            >
              Wallet
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4">
          <TabsContent value="activity" className="mt-0">
            <ActivitySection />
          </TabsContent>
          <TabsContent value="inventory" className="mt-0">
            <InventorySection />
          </TabsContent>
          <TabsContent value="messages" className="mt-0">
            <MessagesSection />
          </TabsContent>
          <TabsContent value="wallet" className="mt-0">
            <WalletSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  // ─── Web Layout ────────────────────────────────────────────────────────────

  const WebView = () => (
    <div
      className="hidden md:flex min-h-screen bg-background"
      data-ocid="dashboard.page"
    >
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="font-display font-bold text-lg text-foreground">
              Dashboard
            </h2>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-muted"
            data-ocid="dashboard.sidebar.toggle"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = mobileTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setMobileTab(item.id);
                  setActiveChat(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                data-ocid={`dashboard.sidebar.nav.${item.id}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">RK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Rajesh Kumar
                </p>
                <p className="text-[0.65rem] text-muted-foreground">Seller</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {mobileTab === "activity" && (
            <>
              <ActivitySection />
              <AnalyticsSection />
            </>
          )}
          {mobileTab === "inventory" && <InventorySection />}
          {mobileTab === "messages" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MessagesSection />
              </div>
              <div className="lg:col-span-2 h-[600px]">
                {activeChat ? (
                  <ChatView
                    thread={activeChat}
                    onBack={() => setActiveChat(null)}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center border-border bg-card border-dashed">
                    <div className="text-center p-8">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Select a conversation to start chatting
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
          {mobileTab === "analytics" && <AnalyticsSection />}
          {mobileTab === "wallet" && <WalletSection />}
          {mobileTab === "team" && <TeamSection />}
        </div>
      </main>
    </div>
  );

  return (
    <>
      <MobileView />
      <WebView />
    </>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardContent,
});
