import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, Plus, Search } from "lucide-react";
import { ROLE_CONFIG, useRoleContext } from "../../context/RoleContext";

// SampleConversation is a UI-only type — not tied to the backend Conversation type
interface SampleConversation {
  id: bigint;
  participantIds: bigint[];
  participantName: string;
  participantAvatarUrl: string;
  lastMessage: string;
  lastMessageAt: bigint;
  unreadCount: number;
  roleLabel: string;
  roleKey: "farmer" | "buyer" | "educator" | "machinery" | "service";
  isVoiceMessage?: boolean;
  isGroup?: boolean;
}

const SAMPLE_CONVERSATIONS: SampleConversation[] = [
  {
    id: BigInt(1),
    participantIds: [BigInt(1), BigInt(2)],
    participantName: "Rajesh Kumar",
    participantAvatarUrl: "",
    lastMessage: "Haan bhai, kal bhejna",
    lastMessageAt: BigInt(Date.now() - 2 * 60 * 1000),
    unreadCount: 2,
    roleLabel: "Farmer",
    roleKey: "farmer",
    isVoiceMessage: false,
  },
  {
    id: BigInt(2),
    participantIds: [BigInt(1), BigInt(3)],
    participantName: "Sunita Devi",
    participantAvatarUrl: "",
    lastMessage: "Price confirmed ₹24/kg",
    lastMessageAt: BigInt(Date.now() - 35 * 60 * 1000),
    unreadCount: 0,
    roleLabel: "Buyer",
    roleKey: "buyer",
    isVoiceMessage: false,
  },
  {
    id: BigInt(3),
    participantIds: [BigInt(1), BigInt(4)],
    participantName: "Dr. Ramesh Sharma",
    participantAvatarUrl: "",
    lastMessage: "Check your course assignment",
    lastMessageAt: BigInt(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 1,
    roleLabel: "Educator",
    roleKey: "educator",
    isVoiceMessage: false,
  },
  {
    id: BigInt(4),
    participantIds: [BigInt(1), BigInt(5)],
    participantName: "FPO Group",
    participantAvatarUrl: "",
    lastMessage: "Meeting at 3pm tomorrow",
    lastMessageAt: BigInt(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 5,
    roleLabel: "Farmer",
    roleKey: "farmer",
    isVoiceMessage: false,
    isGroup: true,
  },
  {
    id: BigInt(5),
    participantIds: [BigInt(1), BigInt(6)],
    participantName: "Gurpreet Singh",
    participantAvatarUrl: "",
    lastMessage: "🎤 Voice message",
    lastMessageAt: BigInt(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    roleLabel: "Farmer",
    roleKey: "farmer",
    isVoiceMessage: true,
  },
];

function relativeTime(ts: bigint): string {
  const diffMs = Date.now() - Number(ts);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return "Yesterday";
}

function Initials({ name, isGroup }: { name: string; isGroup?: boolean }) {
  const parts = name.split(" ");
  const initials = isGroup
    ? name.slice(0, 2).toUpperCase()
    : parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
  return (
    <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
      {initials}
    </div>
  );
}

interface Props {
  conversations: unknown[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedId: bigint | null;
  onSelect: (conv: SampleConversation) => void;
  onNewMessage: () => void;
}

export function ConversationList({
  isLoading,
  searchQuery,
  onSearchChange,
  selectedId,
  onSelect,
  onNewMessage,
}: Props) {
  const { role } = useRoleContext();
  const roleConf = ROLE_CONFIG[role];

  const filtered = SAMPLE_CONVERSATIONS.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-full bg-card"
      data-ocid="conversation_list.panel"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-bold text-xl text-foreground">
            Messages
          </h1>
          <button
            type="button"
            onClick={onNewMessage}
            className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/20 active:scale-95"
            aria-label="New message"
            data-ocid="conversation_list.new_message_button"
          >
            <Plus className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Role chip */}
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{
              background: `oklch(${roleConf.color} / 0.1)`,
              borderColor: `oklch(${roleConf.color} / 0.25)`,
              color: `oklch(${roleConf.color})`,
            }}
          >
            {roleConf.label} Mode
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/50 border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="conversation_list.search_input"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-border">
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <div key={k} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-28 mb-2" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center pt-16 px-6 text-center"
            data-ocid="conversation_list.empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No conversations found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((conv, i) => {
              const isSelected = selectedId === conv.id;
              return (
                <button
                  type="button"
                  key={conv.id.toString()}
                  onClick={() => onSelect(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${isSelected ? "bg-primary/8" : "hover:bg-muted/30"}`}
                  data-ocid={`conversation_list.item.${i + 1}`}
                >
                  <div className="relative flex-shrink-0">
                    <Initials
                      name={conv.participantName}
                      isGroup={conv.isGroup}
                    />
                    {/* Online dot */}
                    {i < 2 && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[oklch(var(--success))] border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {conv.participantName}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-4 shrink-0 border"
                          style={{
                            background: `oklch(${ROLE_CONFIG[conv.roleKey].color} / 0.1)`,
                            borderColor: `oklch(${ROLE_CONFIG[conv.roleKey].color} / 0.25)`,
                            color: `oklch(${ROLE_CONFIG[conv.roleKey].color})`,
                          }}
                        >
                          {conv.roleLabel}
                        </Badge>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">
                          {relativeTime(conv.lastMessageAt)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-destructive flex items-center justify-center text-[9px] font-bold text-destructive-foreground">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {conv.isVoiceMessage && (
                        <Mic className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                      <p
                        className={`text-xs truncate ${conv.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {conv.lastMessage.slice(0, 40)}
                        {conv.lastMessage.length > 40 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export type { SampleConversation };
