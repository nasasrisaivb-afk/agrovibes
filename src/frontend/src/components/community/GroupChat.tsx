import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, MicOff, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAddGroupMessage, useGetGroupMessages } from "../../lib/backend";
import type { Group, GroupMessage } from "../../types";
import { MessageBubble } from "./MessageBubble";

type LocalSR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: { results: SpeechRecognitionResultList }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

const MOCK_MESSAGES: GroupMessage[] = [
  {
    id: BigInt(1),
    groupId: BigInt(1),
    authorId: BigInt(2),
    content:
      "Has anyone tried the new Bayer fungicide for wheat blight this season?",
    isVoiceMessage: false,
    timestamp: BigInt(Date.now() - 1000 * 60 * 18),
  },
  {
    id: BigInt(2),
    groupId: BigInt(1),
    authorId: BigInt(3),
    content: "Yes, works well but expensive. Price jumped 20% this year.",
    isVoiceMessage: false,
    timestamp: BigInt(Date.now() - 1000 * 60 * 15),
  },
  {
    id: BigInt(3),
    groupId: BigInt(1),
    authorId: BigInt(4),
    content: "",
    isVoiceMessage: true,
    timestamp: BigInt(Date.now() - 1000 * 60 * 12),
  },
  {
    id: BigInt(4),
    groupId: BigInt(1),
    authorId: BigInt(5),
    content:
      "Mandi rates for wheat are up 5% today in Amritsar. Good time to sell.",
    isVoiceMessage: false,
    timestamp: BigInt(Date.now() - 1000 * 60 * 8),
  },
  {
    id: BigInt(5),
    groupId: BigInt(1),
    authorId: BigInt(6),
    content: "",
    isVoiceMessage: true,
    timestamp: BigInt(Date.now() - 1000 * 60 * 5),
  },
  {
    id: BigInt(6),
    groupId: BigInt(1),
    authorId: BigInt(7),
    content: "Anyone have contact for the FCI procurement agent in Ludhiana?",
    isVoiceMessage: false,
    timestamp: BigInt(Date.now() - 1000 * 60 * 2),
  },
];

export function GroupChat({ group }: { group: Group }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [localMessages, setLocalMessages] = useState<GroupMessage[]>([]);
  const recognitionRef = useRef<LocalSR | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addMessage = useAddGroupMessage();

  const { data: fetched, isLoading } = useGetGroupMessages(group.id);
  const allMessages = [
    ...(fetched?.length ? fetched : MOCK_MESSAGES),
    ...localMessages,
  ];

  const msgCount = allMessages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgCount]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  function toggleVoice() {
    const SR =
      window.SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => LocalSR })
        .webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR() as LocalSR;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => `${prev}${transcript} `);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error");
    };
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }

  function handleSend(asVoice = false) {
    const content = text.trim();
    if (!content && !asVoice) return;

    const optimistic: GroupMessage = {
      id: BigInt(Date.now()),
      groupId: group.id,
      authorId: BigInt(0),
      content: asVoice ? "" : content,
      isVoiceMessage: asVoice,
      timestamp: BigInt(Date.now()),
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    setText("");

    addMessage.mutate(
      {
        groupId: group.id,
        content: asVoice ? "" : content,
        authorId: BigInt(0),
        isVoiceMessage: asVoice,
      },
      {
        onError: () => {
          toast.error("Failed to send message");
          setLocalMessages((prev) =>
            prev.filter((m) => m.id !== optimistic.id),
          );
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(false);
    }
  }

  return (
    <div className="flex flex-col flex-1" style={{ minHeight: 0 }}>
      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2"
        style={{ maxHeight: "calc(100vh - 340px)" }}
        data-ocid="chat-messages"
      >
        {isLoading ? (
          <div className="flex flex-col gap-3 pt-2">
            {["m1", "m2", "m3"].map((k) => (
              <Skeleton key={k} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : (
          allMessages.map((msg, i) => (
            <MessageBubble
              key={msg.id.toString()}
              message={msg}
              isMine={msg.authorId === BigInt(0)}
              prevAuthorId={i > 0 ? allMessages[i - 1].authorId : undefined}
            />
          ))
        )}
      </div>

      {/* Voice recording indicator */}
      {isListening && (
        <div className="mx-4 mb-2 flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-destructive font-medium">
            Recording... speak now
          </span>
          <div className="flex gap-0.5 items-center ml-auto">
            {(["3h", "6h", "4h", "7h", "5h", "3h", "6h"] as const).map(
              (hKey) => (
                <div
                  key={`wave-${hKey}`}
                  className="w-0.5 bg-destructive rounded-full animate-pulse"
                  style={{ height: `${Number(hKey.replace("h", "")) * 2}px` }}
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="px-4 py-3 border-t border-border bg-background flex gap-2 items-end">
        <button
          type="button"
          onClick={toggleVoice}
          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${
            isListening
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          aria-label={isListening ? "Stop recording" : "Voice message"}
          data-ocid="voice-message-btn"
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>

        <Input
          placeholder={isListening ? "Listening..." : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-2xl bg-muted border-transparent h-10 focus-visible:ring-1"
          data-ocid="chat-input"
        />

        {/* Send voice snippet */}
        {isListening && text && (
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full flex-shrink-0"
            onClick={() => handleSend(true)}
            aria-label="Send voice message"
            data-ocid="send-voice"
          >
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[8px]">VM</AvatarFallback>
            </Avatar>
          </Button>
        )}

        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex-shrink-0 hover:bg-accent/90"
          onClick={() => handleSend(false)}
          disabled={!text.trim() || addMessage.isPending}
          aria-label="Send message"
          data-ocid="send-message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
