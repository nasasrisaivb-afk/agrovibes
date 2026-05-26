import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Globe,
  Mic,
  MicOff,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ROLE_CONFIG } from "../../context/RoleContext";
import { useGetDirectMessages, useSendDirectMessage } from "../../lib/backend";
import type { SampleConversation } from "./ConversationList";
import { MediaShareSheet } from "./MediaShareSheet";
import { MessageBubble } from "./MessageBubble";
import type { MessageData } from "./MessageBubble";

// Sample messages seeded per conversation
const SEED_MESSAGES: Record<string, MessageData[]> = {
  "1": [
    {
      id: BigInt(101),
      content: "Bhai, aaj kitna maal hai tumhare paas?",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "10:02 AM",
      isRead: true,
      canTranslate: true,
    },
    {
      id: BigInt(102),
      content: "Abhi 200kg tomato hai — fresh!",
      isVoiceMessage: false,
      isSent: true,
      timestamp: "10:05 AM",
      isRead: true,
    },
    {
      id: BigInt(103),
      content: "",
      isVoiceMessage: true,
      voiceDuration: "0:08",
      isSent: false,
      timestamp: "10:08 AM",
      isRead: true,
    },
    {
      id: BigInt(104),
      content: "Haan bhai, kal bhejna",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "10:10 AM",
      isRead: true,
      canTranslate: true,
    },
  ],
  "2": [
    {
      id: BigInt(201),
      content: "What is your best price for 500kg onions?",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "Yesterday",
      isRead: true,
    },
    {
      id: BigInt(202),
      content: "₹24/kg for bulk — minimum 200kg",
      isVoiceMessage: false,
      isSent: true,
      timestamp: "Yesterday",
      isRead: true,
    },
    {
      id: BigInt(203),
      content: "Price confirmed ₹24/kg",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "2:15 PM",
      isRead: true,
    },
  ],
  "3": [
    {
      id: BigInt(301),
      content: "You enrolled in Organic Farming Basics — welcome!",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "Mon",
      isRead: true,
    },
    {
      id: BigInt(302),
      content: "Check your course assignment",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "9:00 AM",
      isRead: false,
    },
  ],
  "4": [
    {
      id: BigInt(401),
      content: "Group created: FPO District 4",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "Mon",
      isRead: true,
    },
    {
      id: BigInt(402),
      content: "",
      isVoiceMessage: true,
      voiceDuration: "0:22",
      isSent: false,
      timestamp: "11:30 AM",
      isRead: true,
    },
    {
      id: BigInt(403),
      content: "Meeting at 3pm tomorrow",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "2:00 PM",
      isRead: false,
    },
  ],
  "5": [
    {
      id: BigInt(501),
      content: "Sat sri akal! Keda haal hai?",
      isVoiceMessage: false,
      isSent: false,
      timestamp: "Yesterday",
      isRead: true,
      canTranslate: true,
    },
    {
      id: BigInt(502),
      content: "",
      isVoiceMessage: true,
      voiceDuration: "0:14",
      isSent: false,
      timestamp: "Yesterday",
      isRead: true,
    },
  ],
};

const REC_WAVE = [
  { h: 3, pos: 0 },
  { h: 5, pos: 1 },
  { h: 8, pos: 2 },
  { h: 6, pos: 3 },
  { h: 4, pos: 4 },
  { h: 7, pos: 5 },
  { h: 5, pos: 6 },
  { h: 3, pos: 7 },
];

interface Props {
  conversation: SampleConversation;
  onBack: () => void;
}

export function ChatWindow({ conversation, onBack }: Props) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showMediaSheet, setShowMediaSheet] = useState(false);
  const [translateToast, setTranslateToast] = useState(false);
  const [localMessages, setLocalMessages] = useState<MessageData[]>(
    () => SEED_MESSAGES[conversation.id.toString()] ?? [],
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendMsg = useSendDirectMessage();

  // Sync seed when switching conversations
  useEffect(() => {
    setLocalMessages(SEED_MESSAGES[conversation.id.toString()] ?? []);
  }, [conversation.id]);

  // Scroll to latest message
  const messageCount = localMessages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally trigger on count only
  useLayoutEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageCount]);

  // Fetch from backend (overlay on top of seeds)
  const { data: backendMessages = [] } = useGetDirectMessages(conversation.id);

  const allMessages: MessageData[] = [
    ...localMessages,
    ...backendMessages.map((m) => ({
      id: m.id,
      content: m.content,
      isVoiceMessage: m.isVoiceMessage,
      isSent: m.senderId === BigInt(1),
      timestamp: new Date(Number(m.timestamp)).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: m.isRead,
    })),
  ];

  function handleSend() {
    if (!inputText.trim()) return;
    const newMsg: MessageData = {
      id: BigInt(Date.now()),
      content: inputText.trim(),
      isVoiceMessage: false,
      isSent: true,
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    sendMsg.mutate({
      conversationId: conversation.id,
      senderId: BigInt(1),
      receiverId: conversation.participantIds[1] ?? BigInt(2),
      content: inputText.trim(),
      isVoiceMessage: false,
    });
    setInputText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleVoiceHold() {
    setIsRecording(true);
  }

  function handleVoiceRelease() {
    if (!isRecording) return;
    setIsRecording(false);
    const newMsg: MessageData = {
      id: BigInt(Date.now()),
      content: "",
      isVoiceMessage: true,
      voiceDuration: "0:03",
      isSent: true,
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    toast.success("Voice message sent");
  }

  function handleTranslateToggle() {
    if (translateToast) return;
    setTranslateToast(true);
    toast.info("Translation coming soon");
    setTimeout(() => setTranslateToast(false), 3000);
  }

  const roleConf = ROLE_CONFIG[conversation.roleKey];

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="chat_window.panel"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors md:hidden"
          aria-label="Back to conversations"
          data-ocid="chat_window.back_button"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
          {conversation.participantName
            .split(" ")
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-foreground truncate">
              {conversation.participantName}
            </span>
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 h-4 shrink-0"
              style={{
                background: `oklch(${roleConf.color} / 0.1)`,
                borderColor: `oklch(${roleConf.color} / 0.25)`,
                color: `oklch(${roleConf.color})`,
              }}
            >
              {conversation.roleLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[oklch(var(--trust))]" />
            <span className="text-[10px] text-muted-foreground">
              End-to-end encrypted
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleTranslateToggle}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${translateToast ? "bg-primary/20 text-primary" : "hover:bg-muted/60 text-muted-foreground"}`}
            aria-label="Toggle translation"
            data-ocid="chat_window.translate_button"
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground"
            aria-label="Voice call (coming soon)"
            data-ocid="chat_window.call_button"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground"
            aria-label="Video call (coming soon)"
            data-ocid="chat_window.video_button"
          >
            <Video className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"
        data-ocid="chat_window.message_list"
      >
        {allMessages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full text-center px-6"
            data-ocid="chat_window.empty_state"
          >
            <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Start the conversation
            </p>
            <p className="text-xs text-muted-foreground">
              Messages are end-to-end encrypted.
            </p>
          </div>
        ) : (
          allMessages.map((msg) => (
            <MessageBubble key={msg.id.toString()} message={msg} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Recording overlay */}
      {isRecording && (
        <div
          className="flex items-center justify-center gap-3 bg-destructive/10 border-t border-destructive/20 px-4 py-3"
          data-ocid="chat_window.recording_state"
        >
          <div className="flex items-center gap-1">
            {REC_WAVE.map(({ h, pos }) => (
              <div
                key={`rec-wave-${pos}`}
                className="w-[3px] rounded-full bg-destructive voice-waveform"
                style={{
                  height: `${h * 2}px`,
                  animationDelay: `${pos * 0.08}s`,
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-destructive">
            Recording…
          </span>
          <span className="text-xs text-muted-foreground">Release to send</span>
        </div>
      )}

      {/* Input area */}
      <div className="bg-card border-t border-border px-3 py-2.5 flex items-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowMediaSheet(true)}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground flex-shrink-0"
          aria-label="Attach file or media"
          data-ocid="chat_window.attach_button"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 px-4 rounded-full bg-muted/50 border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="chat_window.message_input"
        />

        {inputText.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-smooth hover:opacity-90 active:scale-95"
            aria-label="Send message"
            data-ocid="chat_window.send_button"
          >
            <Send className="h-4.5 w-4.5 text-primary-foreground" />
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={handleVoiceHold}
            onMouseUp={handleVoiceRelease}
            onTouchStart={handleVoiceHold}
            onTouchEnd={handleVoiceRelease}
            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isRecording ? "bg-destructive scale-110" : "bg-muted/60 hover:bg-muted"}`}
            aria-label={
              isRecording
                ? "Recording voice message"
                : "Hold to record voice message"
            }
            data-ocid="chat_window.voice_button"
          >
            {isRecording ? (
              <MicOff className="h-5 w-5 text-destructive-foreground" />
            ) : (
              <Mic className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {showMediaSheet && (
        <MediaShareSheet
          onClose={() => setShowMediaSheet(false)}
          onSelect={(type) => toast.info(`${type} sharing coming soon`)}
        />
      )}
    </div>
  );
}
