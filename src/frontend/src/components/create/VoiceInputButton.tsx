import { Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VoiceInputButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
  "aria-label"?: string;
}

type LocalSpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type LocalSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: LocalSpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => LocalSpeechRecognition;
    webkitSpeechRecognition?: new () => LocalSpeechRecognition;
  }
}

export function VoiceInputButton({
  onResult,
  className = "",
  "aria-label": ariaLabel = "Voice input",
}: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [onResult]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isRecording ? "Stop recording" : ariaLabel}
      data-ocid="voice-input-btn"
      className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isRecording
          ? "bg-destructive text-destructive-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent"
      } ${className}`}
    >
      {isRecording ? (
        <>
          <MicOff className="h-4 w-4 relative z-10" />
          <span className="absolute inset-0 rounded-full animate-ping bg-destructive/40" />
          <span className="absolute inset-[-4px] rounded-full animate-ping bg-destructive/20 [animation-delay:0.15s]" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}
