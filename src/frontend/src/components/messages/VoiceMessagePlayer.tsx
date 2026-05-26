import { Pause, Play } from "lucide-react";
import { useState } from "react";

const WAVEFORM_HEIGHTS = [
  4, 8, 12, 16, 20, 14, 18, 10, 22, 16, 12, 8, 18, 20, 14, 10, 16, 12, 8, 20,
  18, 14, 10, 16, 22, 12, 8, 16, 20, 14,
];

interface Props {
  duration: string;
  isSent?: boolean;
}

export function VoiceMessagePlayer({ duration, isSent = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const [progress, setProgress] = useState(0);

  const speeds: Array<"1x" | "1.5x" | "2x"> = ["1x", "1.5x", "2x"];

  function togglePlay() {
    setIsPlaying((p) => {
      if (!p) {
        // Simulate progress animation
        let pct = 0;
        const interval = setInterval(() => {
          pct += 2;
          setProgress(pct);
          if (pct >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setProgress(0);
          }
        }, 150);
      }
      return !p;
    });
  }

  function cycleSpeed() {
    setSpeed((s) => {
      const idx = speeds.indexOf(s);
      return speeds[(idx + 1) % speeds.length];
    });
  }

  const barColor = isSent ? "bg-primary-foreground/70" : "bg-primary/50";
  const barActiveColor = isSent ? "bg-primary-foreground" : "bg-primary";

  return (
    <div
      className="flex items-center gap-2.5 min-w-0"
      data-ocid="voice_player.panel"
    >
      <button
        type="button"
        onClick={togglePlay}
        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isSent ? "bg-primary-foreground/20 hover:bg-primary-foreground/30" : "bg-primary/15 hover:bg-primary/25"}`}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        data-ocid="voice_player.toggle_button"
      >
        {isPlaying ? (
          <Pause
            className={`h-4 w-4 ${isSent ? "text-primary-foreground" : "text-primary"}`}
          />
        ) : (
          <Play
            className={`h-4 w-4 ${isSent ? "text-primary-foreground" : "text-primary"}`}
          />
        )}
      </button>

      {/* Waveform */}
      <div className="flex items-end gap-[2px] h-6 flex-1" aria-hidden="true">
        {WAVEFORM_HEIGHTS.map((h, idx) => {
          const barPct = (idx / WAVEFORM_HEIGHTS.length) * 100;
          const isActive = barPct <= progress;
          return (
            <div
              key={`waveform-bar-${WAVEFORM_HEIGHTS.length}-${h}-${idx}`}
              className={`w-[3px] rounded-full transition-colors ${isActive ? barActiveColor : barColor} ${isPlaying && isActive ? "voice-waveform" : ""}`}
              style={{
                height: `${h}px`,
                animationDelay: `${idx * 0.03}s`,
              }}
            />
          );
        })}
      </div>

      {/* Duration + speed */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span
          className={`text-[11px] font-mono ${isSent ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {duration}
        </span>
        <button
          type="button"
          onClick={cycleSpeed}
          className={`text-[9px] font-bold px-1 rounded transition-colors ${isSent ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          data-ocid="voice_player.speed_button"
        >
          {speed}
        </button>
      </div>
    </div>
  );
}
