import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  Mic,
  Sparkles,
  Tag,
  TrendingUp,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIEnhancementPanelProps {
  contentType: "reel" | "listing" | "question" | "livestream" | "course";
}

const TAGS_BY_TYPE: Record<string, string[]> = {
  reel: [
    "Fresh Harvest",
    "Organic",
    "Farm-to-Table",
    "Local Produce",
    "Field Day",
    "Seasonal",
    "Grade A",
  ],
  listing: [
    "Pesticide-Free",
    "Grade A",
    "Farm Fresh",
    "Naturally Grown",
    "Direct Farm",
    "Certified Organic",
  ],
  question: [
    "Pest Control",
    "Best Practices",
    "Weather Impact",
    "Crop Disease",
    "Soil Health",
    "Expert Advice",
  ],
  livestream: [
    "Live Demo",
    "Q&A Session",
    "Market Update",
    "Expert Talk",
    "Seasonal Tips",
    "Community",
  ],
  course: [
    "Beginner Friendly",
    "Hands-on",
    "Certified",
    "Video Lessons",
    "Expert Instructor",
    "Agriculture",
  ],
};

const TIPS_BY_TYPE: Record<string, string[]> = {
  reel: [
    "Videos between 15–30s get 40% more views",
    "Add a crop tag to reach targeted buyers directly",
    "Morning light boosts video engagement by 25%",
  ],
  listing: [
    "Listings with 3+ photos sell 60% faster",
    "Escrow-enabled listings attract premium buyers",
    "AI-priced listings match market rates within 5%",
  ],
  question: [
    "Questions with region details get answered 2× faster",
    "Add a photo to get more accurate diagnoses",
    "Tag 'Pest Control' for fastest expert responses",
  ],
  livestream: [
    "Streams at 7–9 AM attract peak farmer viewers",
    "Q&A segments boost watch time by 35%",
    "Linking a product during stream doubles conversions",
  ],
  course: [
    "Courses under 2 hours have 80% completion rates",
    "Adding a certificate increases enrollment by 55%",
    "Short quizzes every 3 lessons improve retention",
  ],
};

export function AIEnhancementPanel({ contentType }: AIEnhancementPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [enhanceVideo, setEnhanceVideo] = useState(false);

  const handleSuggestTags = () => {
    setSuggestedTags(TAGS_BY_TYPE[contentType] ?? []);
  };

  const removeTag = (tag: string) => {
    setSuggestedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTranscribe = () => {
    toast.info("Voice transcription coming soon!");
  };

  const handleTranslate = () => {
    toast.info("Translation coming soon — Hindi, Telugu, Tamil and more.");
  };

  const tips = TIPS_BY_TYPE[contentType] ?? [];

  return (
    <div className="rounded-2xl border border-border bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-smooth"
        data-ocid="ai-panel-toggle"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-accent/20 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            AI Enhancement
          </span>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-accent/50 text-accent"
          >
            AI
          </Badge>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/60">
          {/* Auto-tagging */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Auto-Tagging
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={handleSuggestTags}
                data-ocid="ai-suggest-tags-btn"
              >
                <Sparkles className="h-3 w-3" />
                Suggest Tags
              </Button>
            </div>
            {suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5" data-ocid="ai-tags-list">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs gap-1 pr-1.5 border-accent/40 text-accent bg-accent/10"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Transcription */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Transcription
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleTranscribe}
              data-ocid="ai-transcribe-btn"
            >
              Transcribe Voice
            </Button>
          </div>

          {/* Translation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-semibold text-foreground">
                Translation
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleTranslate}
              data-ocid="ai-translate-btn"
            >
              Translate to Hindi
            </Button>
          </div>

          {/* Video Enhancement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Enhance Video Quality
              </span>
            </div>
            <Switch
              checked={enhanceVideo}
              onCheckedChange={setEnhanceVideo}
              data-ocid="ai-enhance-video-switch"
            />
          </div>

          {/* Performance Tips */}
          <div className="bg-card rounded-xl p-3 space-y-2 border border-border/60">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold text-foreground">
                Performance Tips
              </span>
            </div>
            <ul className="space-y-1.5">
              {tips.map((tip, i) => (
                <li
                  key={i.toString()}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="text-accent mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
