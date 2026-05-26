import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GroupMessage } from "../../types";

const AUTHOR_NAMES = [
  "Rajesh Kumar",
  "Sunita Devi",
  "Amit Patel",
  "Meera Singh",
  "Harpreet K.",
  "Lakshmi R.",
  "Vijay Sharma",
  "Priya Nair",
];

const VOICE_TRANSCRIPTS = [
  "The mandi prices are good today. I sold at 2800 per quintal.",
  "Check the weather forecast — rain expected Thursday.",
  "Anyone near Amritsar for pickup?",
  "My yield this season was 40 quintals per acre with hybrid seeds.",
];

const WAVEFORM_HEIGHTS: { key: string; h: number }[] = [
  { key: "w1", h: 3 },
  { key: "w2", h: 5 },
  { key: "w3", h: 4 },
  { key: "w4", h: 7 },
  { key: "w5", h: 3 },
  { key: "w6", h: 6 },
  { key: "w7", h: 4 },
  { key: "w8", h: 5 },
  { key: "w9", h: 3 },
  { key: "w10", h: 6 },
  { key: "w11", h: 4 },
  { key: "w12", h: 7 },
  { key: "w13", h: 3 },
];

function relativeTime(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function playMockBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    toast.info("Voice playback unavailable in this browser");
  }
}

function VoiceMessageContent({ messageId }: { messageId: string }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptIndex =
    Number.parseInt(messageId, 10) % VOICE_TRANSCRIPTS.length;

  function handlePlay() {
    setPlaying(true);
    playMockBeep();
    setTimeout(() => setPlaying(false), 1500);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePlay}
          disabled={playing}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${
            playing
              ? "bg-foreground/20 opacity-60"
              : "bg-foreground/10 hover:bg-foreground/20"
          }`}
          aria-label="Play voice message"
          data-ocid="play-voice"
        >
          <Play className="h-3 w-3" fill="currentColor" />
        </button>

        <div className="flex gap-0.5 items-center">
          {WAVEFORM_HEIGHTS.map(({ key, h }) => (
            <div
              key={key}
              className={`w-0.5 rounded-full transition-all duration-150 ${
                playing
                  ? "bg-current opacity-90 animate-pulse"
                  : "bg-current opacity-50"
              }`}
              style={{
                height: `${playing ? h * 2.5 : h * 2}px`,
              }}
            />
          ))}
        </div>

        <span className="text-[10px] opacity-70 tabular-nums">
          0:{String(8 + (Number.parseInt(messageId, 10) % 20)).padStart(2, "0")}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setShowTranscript((s) => !s)}
        className="text-[10px] opacity-60 hover:opacity-80 text-left underline decoration-dotted"
        data-ocid="toggle-transcript"
      >
        {showTranscript ? "Hide transcript" : "Show transcript"}
      </button>

      {showTranscript && (
        <p className="text-[11px] opacity-75 italic leading-relaxed">
          "{VOICE_TRANSCRIPTS[transcriptIndex]}"
        </p>
      )}
    </div>
  );
}

export function MessageBubble({
  message,
  isMine,
  prevAuthorId,
}: {
  message: GroupMessage;
  isMine: boolean;
  prevAuthorId?: bigint;
}) {
  const authorName = isMine
    ? "You"
    : AUTHOR_NAMES[(Number(message.authorId) - 1) % AUTHOR_NAMES.length];
  const showAvatar = !isMine && prevAuthorId !== message.authorId;
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}
      data-ocid="chat-message"
    >
      {/* Avatar placeholder keeps alignment even when hidden */}
      <div className="w-7 flex-shrink-0">
        {showAvatar && !isMine && (
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div
        className={`flex flex-col gap-0.5 max-w-[76%] ${isMine ? "items-end" : "items-start"}`}
      >
        {showAvatar && !isMine && (
          <span className="text-[10px] font-semibold text-muted-foreground px-1">
            {authorName}
          </span>
        )}

        <div
          className={`rounded-2xl px-3 py-2.5 ${
            isMine
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          }`}
        >
          {message.isVoiceMessage ? (
            <VoiceMessageContent messageId={message.id.toString()} />
          ) : (
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          )}
        </div>

        <span className="text-[9px] px-1 text-muted-foreground">
          {relativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
