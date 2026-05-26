import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createRoute } from "@tanstack/react-router";
import {
  Bell,
  ExternalLink,
  FileText,
  HelpCircle,
  LogOut,
  MessageSquare,
  Settings2,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AccessibilitySettings } from "../components/profile/AccessibilitySettings";
import { NotificationSettings } from "../components/profile/NotificationSettings";
import { OrderHistory } from "../components/profile/OrderHistory";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { RoleSettings } from "../components/profile/RoleSettings";
import { WalletSection } from "../components/profile/WalletSection";
import { KycStatus } from "../types";
import { Route as rootRoute } from "./__root";

const MOCK_KYC_STATUS = KycStatus.Verified;

const SUPPORT_LINKS = [
  { icon: FileText, label: "Terms of Service", ocid: "terms-link" },
  { icon: Shield, label: "Privacy Policy", ocid: "privacy-link" },
  { icon: HelpCircle, label: "Help & Support", ocid: "help-link" },
  { icon: MessageSquare, label: "Send Feedback", ocid: "feedback-link" },
];

function ProfileContent() {
  const handleLogout = () => {
    toast.success("Logged out", {
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="flex flex-col pb-8">
      <ProfileHeader kycStatus={MOCK_KYC_STATUS} />

      <Tabs defaultValue="overview" className="flex-1" data-ocid="profile.tabs">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-3 pb-0">
          <TabsList className="w-full h-9 rounded-xl bg-muted/60 grid grid-cols-5">
            <TabsTrigger
              value="overview"
              className="text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-1"
              data-ocid="profile.tab-overview"
            >
              <User className="h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-1"
              data-ocid="profile.tab-wallet"
            >
              <Wallet className="h-3 w-3" />
              Wallet
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-1"
              data-ocid="profile.tab-orders"
            >
              <Shield className="h-3 w-3" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-1"
              data-ocid="profile.tab-notifications"
            >
              <Bell className="h-3 w-3" />
              Notifs
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-1"
              data-ocid="profile.tab-settings"
            >
              <Settings2 className="h-3 w-3" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent
          value="overview"
          className="mt-0 px-4 py-4 flex flex-col gap-5"
        >
          <RoleSettings />
          <Separator className="opacity-50" />
          <section>
            <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
              Support
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {SUPPORT_LINKS.map(({ icon: Icon, label, ocid }, i, arr) => (
                <button
                  type="button"
                  key={label}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                  data-ocid={ocid}
                  onClick={() =>
                    toast.info(label, { description: "Coming soon!" })
                  }
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">{label}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50" />
                </button>
              ))}
            </div>
          </section>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 transition-smooth"
            onClick={handleLogout}
            data-ocid="sign-out-btn"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>

          <div className="flex items-center gap-1.5 justify-center">
            <div className="h-px flex-1 bg-border/50" />
            <p className="text-center text-[10px] text-muted-foreground px-2">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                className="underline hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <div className="h-px flex-1 bg-border/50" />
          </div>
        </TabsContent>

        {/* Wallet */}
        <TabsContent value="wallet" className="mt-0 px-4 py-4">
          <WalletSection />
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="mt-0 px-4 py-4">
          <OrderHistory />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-0 px-4 py-4">
          <NotificationSettings />
        </TabsContent>

        {/* Settings */}
        <TabsContent
          value="settings"
          className="mt-0 px-4 py-4 flex flex-col gap-5"
        >
          <AccessibilitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfileContent,
});
