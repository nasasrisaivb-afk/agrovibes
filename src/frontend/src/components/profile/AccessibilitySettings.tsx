import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Contrast, Globe, Maximize2, Mic, Minimize2, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccessibilityContext } from "../../context/AccessibilityContext";
import type { AccessibilityState } from "../../types";

const FONT_SIZES: {
  label: string;
  value: AccessibilityState["fontSizeClass"];
}[] = [
  { label: "Small", value: "text-sm" },
  { label: "Normal", value: "text-base" },
  { label: "Large", value: "text-lg" },
  { label: "XL", value: "text-xl" },
];

const VOICE_LANGUAGES = [
  { label: "English", value: "en" },
  { label: "हिंदी", value: "hi" },
  { label: "தமிழ்", value: "ta" },
  { label: "తెలుగు", value: "te" },
];

export function AccessibilitySettings() {
  const { fontSizeClass, isHighContrast, setFontSize, setHighContrast } =
    useAccessibilityContext();

  const [voiceFeedback, setVoiceFeedback] = useState<boolean>(
    () => localStorage.getItem("agri-voice-feedback") === "true",
  );
  const [voiceLang, setVoiceLang] = useState<string>(
    () => localStorage.getItem("agri-voice-lang") ?? "en",
  );
  const [reduceMotion, setReduceMotion] = useState<boolean>(
    () => localStorage.getItem("agri-reduce-motion") === "true",
  );
  const [touchTarget, setTouchTarget] = useState<"normal" | "large">(
    () =>
      (localStorage.getItem("agri-touch-target") as "normal" | "large") ??
      "normal",
  );

  const toggleVoiceFeedback = (val: boolean) => {
    setVoiceFeedback(val);
    localStorage.setItem("agri-voice-feedback", String(val));
    toast.success(`Voice feedback ${val ? "enabled" : "disabled"}`);
  };

  const toggleReduceMotion = (val: boolean) => {
    setReduceMotion(val);
    localStorage.setItem("agri-reduce-motion", String(val));
    if (val) document.documentElement.classList.add("reduce-motion");
    else document.documentElement.classList.remove("reduce-motion");
  };

  const handleTouchTarget = (size: "normal" | "large") => {
    setTouchTarget(size);
    localStorage.setItem("agri-touch-target", size);
    toast.success(
      `Touch target set to ${size === "large" ? "large (56px)" : "normal (44px)"}`,
    );
  };

  const handleVoiceLang = (val: string) => {
    setVoiceLang(val);
    localStorage.setItem("agri-voice-lang", val);
  };

  return (
    <section>
      <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
        Accessibility
      </h2>
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-4">
        {/* Font size */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            Font Size
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {FONT_SIZES.map((fs) => (
              <button
                type="button"
                key={fs.value}
                onClick={() => setFontSize(fs.value)}
                className={`h-9 rounded-xl border text-xs font-medium transition-smooth ${
                  fontSizeClass === fs.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                aria-label={`Font size ${fs.label}`}
                aria-pressed={fontSizeClass === fs.value}
                data-ocid="a11y.font-size-btn"
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* High contrast */}
        <div className="flex items-center justify-between">
          <Label
            className="text-sm flex items-center gap-2 cursor-pointer"
            htmlFor="a11y-high-contrast"
          >
            <Contrast className="h-4 w-4 text-primary" />
            High Contrast Mode
          </Label>
          <Switch
            id="a11y-high-contrast"
            checked={isHighContrast}
            onCheckedChange={setHighContrast}
            data-ocid="a11y.high-contrast-toggle"
          />
        </div>

        <Separator />

        {/* Voice feedback */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label
              className="text-sm flex items-center gap-2 cursor-pointer"
              htmlFor="a11y-voice"
            >
              <Mic className="h-4 w-4 text-primary" />
              Voice Feedback
            </Label>
            <Switch
              id="a11y-voice"
              checked={voiceFeedback}
              onCheckedChange={toggleVoiceFeedback}
              data-ocid="a11y.voice-feedback-toggle"
            />
          </div>

          {voiceFeedback && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Language for voice feedback
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {VOICE_LANGUAGES.map((lang) => (
                  <button
                    type="button"
                    key={lang.value}
                    onClick={() => handleVoiceLang(lang.value)}
                    className={`h-8 rounded-lg border text-[10px] font-medium transition-smooth ${
                      voiceLang === lang.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                    aria-label={`Voice language ${lang.label}`}
                    aria-pressed={voiceLang === lang.value}
                    data-ocid="a11y.voice-lang-btn"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Reduce animations */}
        <div className="flex items-center justify-between">
          <Label
            className="text-sm flex items-center gap-2 cursor-pointer"
            htmlFor="a11y-motion"
          >
            <Minimize2 className="h-4 w-4 text-primary" />
            Reduce Animations
          </Label>
          <Switch
            id="a11y-motion"
            checked={reduceMotion}
            onCheckedChange={toggleReduceMotion}
            data-ocid="a11y.reduce-motion-toggle"
          />
        </div>

        <Separator />

        {/* Touch target size */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-primary" />
            Touch Target Size
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(["normal", "large"] as const).map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleTouchTarget(size)}
                className={`h-10 rounded-xl border text-xs font-medium transition-smooth ${
                  touchTarget === size
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                aria-pressed={touchTarget === size}
                data-ocid="a11y.touch-target-btn"
              >
                {size === "normal" ? "Normal (44px)" : "Large (56px)"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
