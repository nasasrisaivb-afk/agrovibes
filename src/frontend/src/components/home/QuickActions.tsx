import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  FileText,
  MessageCircleQuestion,
  Wrench,
} from "lucide-react";
import type { UserRole } from "../../context/RoleContext";

interface ActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  color: string;
  bg: string;
  ocid: string;
}

const BASE_ACTIONS: ActionItem[] = [
  {
    label: "Explore",
    icon: Compass,
    href: "/marketplace",
    color: "text-primary",
    bg: "bg-primary/10",
    ocid: "quick-action-explore",
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
    color: "text-[oklch(var(--role-educator))]",
    bg: "bg-[oklch(var(--role-educator)/0.1)]",
    ocid: "quick-action-learn",
  },
  {
    label: "Community",
    icon: MessageCircleQuestion,
    href: "/community",
    color: "text-accent",
    bg: "bg-accent/10",
    ocid: "quick-action-community",
  },
];

const ROLE_ACTIONS: Record<UserRole, ActionItem> = {
  farmer: {
    label: "List Produce",
    icon: FileText,
    href: "/create",
    color: "text-[oklch(var(--role-farmer))]",
    bg: "bg-[oklch(var(--role-farmer)/0.1)]",
    ocid: "quick-action-farmer-list",
  },
  buyer: {
    label: "Services",
    icon: Wrench,
    href: "/services",
    color: "text-[oklch(var(--role-buyer))]",
    bg: "bg-[oklch(var(--role-buyer)/0.1)]",
    ocid: "quick-action-buyer-services",
  },
  educator: {
    label: "My Courses",
    icon: BookOpen,
    href: "/learn",
    color: "text-[oklch(var(--role-educator))]",
    bg: "bg-[oklch(var(--role-educator)/0.1)]",
    ocid: "quick-action-educator-courses",
  },
  machinery: {
    label: "Bookings",
    icon: Wrench,
    href: "/services",
    color: "text-[oklch(var(--role-machinery))]",
    bg: "bg-[oklch(var(--role-machinery)/0.1)]",
    ocid: "quick-action-machinery-bookings",
  },
  service: {
    label: "My Jobs",
    icon: Wrench,
    href: "/services",
    color: "text-[oklch(var(--role-service))]",
    bg: "bg-[oklch(var(--role-service)/0.1)]",
    ocid: "quick-action-service-jobs",
  },
};

interface QuickActionsProps {
  role?: UserRole;
}

export function QuickActions({ role }: QuickActionsProps) {
  const navigate = useNavigate();

  const roleAction = role ? ROLE_ACTIONS[role] : null;
  const actions = roleAction
    ? [BASE_ACTIONS[0], roleAction, BASE_ACTIONS[1], BASE_ACTIONS[2]]
    : BASE_ACTIONS;

  return (
    <nav
      className="flex items-center justify-around gap-2 py-3"
      aria-label="Quick actions"
    >
      {actions.map(({ label, icon: Icon, href, color, bg, ocid }) => (
        <button
          key={ocid}
          type="button"
          onClick={() => navigate({ to: href })}
          className="flex flex-col items-center gap-1.5 flex-1 py-2 px-1 rounded-2xl transition-smooth hover:bg-muted/60 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-ocid={ocid}
        >
          <span
            className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
          >
            <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
          </span>
          <span className="text-[11px] font-medium text-muted-foreground leading-tight text-center">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
