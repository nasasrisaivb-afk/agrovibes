import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  GraduationCap,
  Leaf,
  MapPin,
  Mic,
  Search,
  Send,
  ShoppingBag,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  LANGUAGES,
  type LanguageOption,
  type UserRoleSimple,
  useRoleContext,
} from "../../context/RoleContext";
import { useCart } from "../../hooks/useCart";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "transaction",
    priority: "high",
    title: "Order #2048 Delivered",
    body: "Your Alphonso Mangoes order has been delivered.",
    time: "2m ago",
    icon: ShoppingBag,
  },
  {
    id: 2,
    type: "educational",
    priority: "normal",
    title: "New Lesson Available",
    body: "Precision Irrigation Techniques — Module 3 is live.",
    time: "1h ago",
    icon: GraduationCap,
  },
  {
    id: 3,
    type: "market",
    priority: "normal",
    title: "Tomato Price Spike",
    body: "Tomato prices up 18% in Maharashtra markets.",
    time: "3h ago",
    icon: TrendingUp,
  },
  {
    id: 4,
    type: "emergency",
    priority: "critical",
    title: "Pest Alert: Fall Armyworm",
    body: "FAW detected in Karnataka maize belt. Take action now.",
    time: "5h ago",
    icon: AlertTriangle,
  },
  {
    id: 5,
    type: "system",
    priority: "low",
    title: "KYC Reminder",
    body: "Complete your KYC to unlock all features.",
    time: "1d ago",
    icon: User,
  },
];

const NOTIF_TYPE_COLORS: Record<string, string> = {
  transaction: "text-primary",
  educational: "text-accent",
  market: "text-trust",
  emergency: "text-destructive",
  system: "text-muted-foreground",
};

const LOCATIONS = [
  { district: "Mumbai", village: "Dharavi" },
  { district: "Pune", village: "Khadki" },
  { district: "Nashik", village: "Igatpuri" },
  { district: "Amritsar", village: "Majitha" },
  { district: "Guntur", village: "Tenali" },
];

const SIMPLE_ROLE_META: Record<
  UserRoleSimple,
  { label: string; icon: React.ReactNode }
> = {
  Buyer: { label: "Buyer", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  Seller: { label: "Seller", icon: <Leaf className="h-3.5 w-3.5" /> },
  Expert: { label: "Expert", icon: <GraduationCap className="h-3.5 w-3.5" /> },
};

export function GlobalTopBar() {
  const {
    language,
    location,
    wallet,
    notificationCount,
    activeRole,
    setActiveRole,
    setLanguage,
    setLocation,
    setNotificationCount,
  } = useRoleContext();
  const { items, openCart } = useCart();
  const navigate = useNavigate();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showWalletPanel, setShowWalletPanel] = useState(false);

  const handleSelectLang = (l: LanguageOption) => {
    setLanguage(l);
    setShowLangMenu(false);
  };

  const handleOpenNotif = () => {
    setShowNotifPanel(true);
    setNotificationCount(0);
  };

  return (
    <>
      {/* Mobile header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border shadow-sm flex items-center justify-between px-3 lg:hidden"
        data-ocid="global-top-bar"
      >
        <button
          type="button"
          className="flex items-center gap-1.5 text-foreground"
          onClick={() => navigate({ to: "/" })}
          data-ocid="logo-button"
          aria-label="Go home"
        >
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-sm">AgriMarket</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-accent/15 text-accent transition-smooth active:scale-95"
            aria-label="Voice search"
            data-ocid="voice-search-button"
          >
            <Mic className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
            onClick={handleOpenNotif}
            data-ocid="notifications-button"
            aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Web header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border shadow-sm hidden lg:flex items-center gap-4 px-6"
        data-ocid="global-top-bar-web"
      >
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 text-foreground flex-shrink-0"
          onClick={() => navigate({ to: "/" })}
          data-ocid="logo-button-web"
          aria-label="Go home"
        >
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg">AgriMarket</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/60 border border-border focus-within:border-primary/50 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search seeds, produce, equipment..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              data-ocid="search-input"
              aria-label="Search"
            />
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center rounded-full bg-accent/15 text-accent transition-smooth active:scale-95 flex-shrink-0"
              aria-label="Voice search"
              data-ocid="voice-search-button-web"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Role chips */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(Object.keys(SIMPLE_ROLE_META) as UserRoleSimple[]).map((r) => {
            const isActive = activeRole === r;
            return (
              <button
                type="button"
                key={r}
                onClick={() => setActiveRole(r)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-smooth ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`role-chip-${r.toLowerCase()}`}
                aria-pressed={isActive}
              >
                {SIMPLE_ROLE_META[r].icon}
                {SIMPLE_ROLE_META[r].label}
              </button>
            );
          })}
        </div>

        {/* Location */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-muted-foreground transition-colors"
            onClick={() => setShowLocationMenu((v) => !v)}
            data-ocid="location-button-web"
            aria-label="Change location"
            aria-expanded={showLocationMenu}
          >
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="truncate max-w-[80px]">{location.district}</span>
          </button>
          {showLocationMenu && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setShowLocationMenu(false)}
                onKeyDown={() => setShowLocationMenu(false)}
                role="presentation"
              />
              <div className="absolute top-full right-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-[160] py-1 overflow-hidden">
                {LOCATIONS.map((loc) => (
                  <button
                    type="button"
                    key={loc.district}
                    className="w-full flex flex-col items-start px-3 py-2 hover:bg-muted/60 transition-colors text-left"
                    onClick={() => {
                      setLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    data-ocid={`location-option-${loc.district.toLowerCase()}`}
                  >
                    <span className="text-xs font-medium text-foreground">
                      {loc.district}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {loc.village}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Language */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            className="h-8 w-10 flex items-center justify-center rounded-full bg-muted/60 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
            onClick={() => setShowLangMenu((v) => !v)}
            data-ocid="language-selector-web"
            aria-label="Select language"
            aria-expanded={showLangMenu}
          >
            {language.code}
          </button>
          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setShowLangMenu(false)}
                onKeyDown={() => setShowLangMenu(false)}
                role="presentation"
              />
              <div className="absolute top-full right-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-[160] py-1 overflow-hidden max-h-72 overflow-y-auto">
                {LANGUAGES.map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-muted/60 transition-colors ${l.code === language.code ? "font-semibold text-accent" : "text-foreground"}`}
                    onClick={() => handleSelectLang(l)}
                    data-ocid={`lang-option-${l.code.toLowerCase()}`}
                  >
                    <span>{l.native}</span>
                    <span className="text-muted-foreground font-mono">
                      {l.code}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors flex-shrink-0"
          onClick={handleOpenNotif}
          data-ocid="notifications-button-web"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
        >
          <Bell className="h-[18px] w-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Wallet */}
        <button
          type="button"
          className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0 transition-smooth active:scale-95"
          onClick={() => setShowWalletPanel(true)}
          data-ocid="wallet-button-web"
          aria-label="Open wallet"
        >
          <span className="text-sm font-bold">₹</span>
          <span>
            {wallet.balance.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </span>
        </button>

        {/* Cart chip */}
        {totalItems > 0 && (
          <button
            type="button"
            onClick={openCart}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0"
            data-ocid="cart-chip-web"
            aria-label={`Cart, ${totalItems} items`}
          >
            {totalItems}
          </button>
        )}
      </header>

      {/* Notification Panel */}
      <Sheet open={showNotifPanel} onOpenChange={setShowNotifPanel}>
        <SheetContent
          side="right"
          className="w-full max-w-sm p-0 flex flex-col"
          data-ocid="notification-panel"
        >
          <SheetHeader className="p-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold">
                Notifications
              </SheetTitle>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
                onClick={() => setShowNotifPanel(false)}
                data-ocid="notification-panel.close_button"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {MOCK_NOTIFICATIONS.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors ${n.priority === "critical" ? "bg-destructive/5" : ""}`}
                  data-ocid={`notification.item.${n.id}`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center ${NOTIF_TYPE_COLORS[n.type]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {n.time}
                  </span>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Wallet Panel */}
      <Sheet open={showWalletPanel} onOpenChange={setShowWalletPanel}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl p-0 max-h-[85vh]"
          data-ocid="wallet-panel"
        >
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle className="text-base font-semibold">
                Wallet
              </SheetTitle>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
                onClick={() => setShowWalletPanel(false)}
                data-ocid="wallet-panel.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">
                  Available
                </p>
                <p className="text-sm font-bold text-primary">
                  ₹
                  {wallet.balance.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="bg-accent/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Escrow</p>
                <p className="text-sm font-bold text-accent">
                  ₹
                  {wallet.escrow.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">
                  Earnings
                </p>
                <p className="text-sm font-bold text-accent">
                  ₹
                  {wallet.earnings.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
            <Separator className="mb-4" />
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Quick Actions
            </p>
            <div className="grid grid-cols-3 gap-2 pb-6">
              {[
                {
                  label: "Withdraw",
                  icon: ArrowUpRight,
                  ocid: "wallet-panel.withdraw_button",
                },
                {
                  label: "Top Up",
                  icon: ArrowDownLeft,
                  ocid: "wallet-panel.topup_button",
                },
                { label: "Send", icon: Send, ocid: "wallet-panel.send_button" },
              ].map(({ label, icon: Icon, ocid }) => (
                <button
                  type="button"
                  key={label}
                  className="flex flex-col items-center gap-2 py-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                  data-ocid={ocid}
                  onClick={() => navigate({ to: "/profile" })}
                >
                  <div className="h-9 w-9 rounded-full bg-card flex items-center justify-center shadow-sm">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
