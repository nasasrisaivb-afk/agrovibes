import { createRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { ChatWindow } from "../components/messages/ChatWindow";
import { ConversationList } from "../components/messages/ConversationList";
import type { SampleConversation } from "../components/messages/ConversationList";
import { useGetConversations } from "../lib/backend";
import { Route as rootRoute } from "./__root";

function MessagesPage() {
  const { data: conversations = [], isLoading } = useGetConversations(
    BigInt(1),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<SampleConversation | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Mobile: show chat if selected, else show list
  const showChat = selectedConversation !== null;

  return (
    <div className="flex h-full bg-background" data-ocid="messages.page">
      {/* Conversation list — full on mobile, fixed width on desktop */}
      <div
        className={`
          flex-shrink-0 border-r border-border bg-card
          w-full md:w-80 lg:w-96
          ${showChat ? "hidden md:flex md:flex-col" : "flex flex-col"}
        `}
        style={{ height: "calc(100vh - 112px)" }}
      >
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedId={selectedConversation?.id ?? null}
          onSelect={(conv) => {
            setSelectedConversation(conv);
            setShowNewMessage(false);
          }}
          onNewMessage={() => setShowNewMessage(true)}
        />
      </div>

      {/* Chat window — full on mobile (overlays list), flex-1 on desktop */}
      <div
        className={`
          flex-1 min-w-0
          ${!showChat ? "hidden md:flex md:flex-col" : "flex flex-col"}
        `}
        style={{ height: "calc(100vh - 112px)" }}
      >
        {showNewMessage ? (
          <NewMessagePanel
            onClose={() => setShowNewMessage(false)}
            onSelect={(conv) => {
              setSelectedConversation(conv);
              setShowNewMessage(false);
            }}
          />
        ) : selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-muted/10"
      data-ocid="messages.no_chat_selected"
    >
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Send className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-semibold text-foreground mb-1">
        Select a conversation
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">
        Choose a conversation from the left or start a new message.
      </p>
    </div>
  );
}

const NEW_MESSAGE_USERS = [
  { name: "Priya Patel", role: "farmer" as const, district: "Pune" },
  { name: "Arjun Mehta", role: "buyer" as const, district: "Mumbai" },
  { name: "Kavya Reddy", role: "educator" as const, district: "Hyderabad" },
  { name: "Harpreet Kaur", role: "machinery" as const, district: "Ludhiana" },
  { name: "Deepak Nair", role: "service" as const, district: "Kochi" },
];

interface NewMessagePanelProps {
  onClose: () => void;
  onSelect: (conv: SampleConversation) => void;
}

function NewMessagePanel({ onClose, onSelect }: NewMessagePanelProps) {
  const [search, setSearch] = useState("");

  const filtered = NEW_MESSAGE_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-full"
      data-ocid="messages.new_message_panel"
    >
      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">New Message</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-primary hover:underline"
            data-ocid="messages.new_message_cancel"
          >
            Cancel
          </button>
        </div>
        <input
          type="text"
          placeholder="Search farmers, buyers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="messages.new_message_search"
        />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {filtered.map((user, i) => (
          <button
            type="button"
            key={user.name}
            onClick={() =>
              onSelect({
                id: BigInt(100 + i),
                participantIds: [BigInt(1), BigInt(100 + i)],
                participantName: user.name,
                participantAvatarUrl: "",
                lastMessage: "",
                lastMessageAt: BigInt(Date.now()),
                unreadCount: 0,
                roleLabel:
                  user.role.charAt(0).toUpperCase() + user.role.slice(1),
                roleKey: user.role,
              })
            }
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
            data-ocid={`messages.new_message_user.${i + 1}`}
          >
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {user.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role} · {user.district}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: MessagesPage,
});
