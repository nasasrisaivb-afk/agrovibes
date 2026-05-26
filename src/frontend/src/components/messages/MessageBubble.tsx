import { CheckCheck, Download, Globe } from "lucide-react";
import { useState } from "react";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";

export interface MessageData {
  id: bigint;
  content: string;
  isVoiceMessage: boolean;
  isSent: boolean;
  timestamp: string;
  isRead: boolean;
  attachment?: {
    type: "image" | "document";
    url: string;
    name: string;
  };
  voiceDuration?: string;
  canTranslate?: boolean;
}

interface Props {
  message: MessageData;
}

export function MessageBubble({ message }: Props) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div
      className={`flex ${message.isSent ? "justify-end" : "justify-start"} mb-1.5`}
      data-ocid={`message.bubble.${message.id.toString()}`}
    >
      <div
        className={`max-w-[78%] rounded-2xl px-3 py-2 ${
          message.isSent
            ? "bg-accent text-accent-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {/* Voice message */}
        {message.isVoiceMessage ? (
          <div className="py-0.5 min-w-[180px]">
            <VoiceMessagePlayer
              duration={message.voiceDuration ?? "0:14"}
              isSent={message.isSent}
            />
          </div>
        ) : message.attachment ? (
          /* Attachment */
          <div>
            {message.attachment.type === "image" ? (
              <div className="relative rounded-xl overflow-hidden mb-1 -mx-1 -mt-1">
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name}
                  className="w-full max-h-48 object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-foreground/60 flex items-center justify-center"
                  aria-label="Download image"
                >
                  <Download className="h-3.5 w-3.5 text-background" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-background/20 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">
                    PDF
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {message.attachment.name}
                  </p>
                </div>
                <button type="button" aria-label="Download document">
                  <Download className="h-3.5 w-3.5 opacity-70" />
                </button>
              </div>
            )}
            {message.content && (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
          </div>
        ) : (
          /* Text message */
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
        )}

        {/* Translation link */}
        {message.canTranslate && !message.isVoiceMessage && (
          <div className="mt-1">
            {showTranslation ? (
              <p className="text-[11px] italic opacity-70 border-t border-current/20 pt-1 mt-1">
                Translation coming soon
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowTranslation(true)}
                className="flex items-center gap-0.5 text-[11px] opacity-70 hover:opacity-100 transition-opacity"
                data-ocid="message.translate_button"
              >
                <Globe className="h-3 w-3" />
                <span>Translate</span>
              </button>
            )}
          </div>
        )}

        {/* Footer: time + read receipt */}
        <div
          className={`flex items-center gap-1 mt-0.5 ${message.isSent ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[10px] opacity-60">{message.timestamp}</span>
          {message.isSent && (
            <CheckCheck
              className={`h-3 w-3 ${message.isRead ? "text-[oklch(var(--success))]" : "opacity-50"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
