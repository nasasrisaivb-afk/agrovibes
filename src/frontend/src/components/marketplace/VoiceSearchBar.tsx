import { Input } from "@/components/ui/input";
import { Camera, Mic, MicOff, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRoleContext } from "../../context/RoleContext";

interface VoiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

interface LocalSpeechEvent {
  results: SpeechRecognitionResultList;
}

interface LocalSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: LocalSpeechEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  farmer: [
    "organic tomatoes near me",
    "bulk wheat buyers",
    "fair price for rice",
  ],
  buyer: [
    "fresh vegetables this week",
    "certified organic produce",
    "bulk grain suppliers",
  ],
  educator: [
    "soil health workshops",
    "IPM certification courses",
    "agri tech webinars",
  ],
  machinery: [
    "tractor spare parts",
    "combine harvester maintenance",
    "irrigation pump repair",
  ],
  service: [
    "crop transport routes Punjab",
    "cold storage facilities",
    "agri processing units",
  ],
};

export function VoiceSearchBar({ value, onChange }: VoiceSearchBarProps) {
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);
  const { role } = useRoleContext();

  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const suggestions = ROLE_SUGGESTIONS[role] ?? ROLE_SUGGESTIONS.farmer;

  const toggleVoice = () => {
    if (!hasSpeechRecognition) {
      toast.info("Voice search not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR =
      (
        window as Window & {
          SpeechRecognition?: new () => LocalSpeechRecognition;
          webkitSpeechRecognition?: new () => LocalSpeechRecognition;
        }
      ).SpeechRecognition ||
      (
        window as Window & {
          webkitSpeechRecognition?: new () => LocalSpeechRecognition;
        }
      ).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: LocalSpeechEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      onChange(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleImageSearch = () => {
    toast.info("Image search coming soon! Snap a crop to identify it.", {
      duration: 4000,
      icon: "📸",
    });
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Hint text */}
      <p className="text-[10px] text-muted-foreground px-1">
        Try: <span className="text-accent italic">"{suggestions[0]}"</span>
      </p>

      {/* Search input row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9 pr-20 h-11 rounded-2xl bg-muted/50 border-transparent focus-visible:ring-accent focus-visible:border-accent"
          placeholder="Search by voice, text, or image..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          data-ocid="marketplace-search.input"
          aria-label="Search marketplace"
          aria-autocomplete="list"
        />
        {value && (
          <button
            type="button"
            className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
            onClick={handleImageSearch}
            aria-label="Image search"
            data-ocid="image-search-btn"
          >
            <Camera className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={`p-1.5 rounded-full transition-smooth relative ${isListening ? "text-destructive" : "text-accent"} ${!hasSpeechRecognition ? "opacity-40 cursor-not-allowed" : "hover:bg-accent/10"}`}
            onClick={toggleVoice}
            aria-label={
              isListening ? "Stop voice search" : "Start voice search"
            }
            data-ocid="voice-search-btn"
            disabled={!hasSpeechRecognition}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-destructive animate-ping opacity-60" />
            )}
          </button>
        </div>
      </div>

      {/* Voice animation indicator */}
      {isListening && (
        <div className="flex items-center gap-1.5 px-1">
          <div className="flex items-end gap-0.5 h-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-destructive"
                style={{
                  height: `${[60, 100, 80, 40][i]}%`,
                  animation: `pulse 0.${6 + i}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-destructive font-medium">
            Listening…
          </span>
        </div>
      )}

      {/* Predictive suggestions */}
      {showSuggestions && !value && (
        <div
          className="bg-card border border-border rounded-xl shadow-md py-1 z-20"
          data-ocid="search-suggestions"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
              onMouseDown={() => onChange(s)}
              data-ocid="search-suggestion"
            >
              <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
