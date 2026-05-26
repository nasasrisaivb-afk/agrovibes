import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuestion } from "@/lib/backend";
import { CheckCircle2, ImagePlus, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AIEnhancementPanel } from "./AIEnhancementPanel";
import { VoiceInputButton } from "./VoiceInputButton";

const MOCK_AUTHOR_ID = BigInt(1);

const CATEGORIES = [
  { value: "Pest Control", emoji: "🐛" },
  { value: "Pricing", emoji: "💰" },
  { value: "Weather", emoji: "🌦️" },
  { value: "Equipment", emoji: "🚜" },
  { value: "Soil & Water", emoji: "🌱" },
  { value: "Market", emoji: "📈" },
  { value: "Schemes", emoji: "📋" },
  { value: "Other", emoji: "💬" },
];

export function AskQuestionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Pest Control");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [success, setSuccess] = useState(false);

  const createQuestion = useCreateQuestion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a question title.");
      return;
    }

    try {
      await createQuestion.mutateAsync({
        title: title.trim(),
        authorId: MOCK_AUTHOR_ID,
        description: description.trim(),
        category: selectedCategory,
      });
      setSuccess(true);
      toast.success("Question posted to the community!");
    } catch {
      toast.error("Failed to post question. Please try again.");
    }
  };

  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-10 text-center"
        data-ocid="question-success"
      >
        <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">
            Question Posted!
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Farmers in your community will answer soon.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSuccess(false);
              setTitle("");
              setDescription("");
              setSelectedCategory("Pest Control");
              setHasPhoto(false);
            }}
            data-ocid="ask-another-question"
          >
            Ask Another
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground"
            onClick={() => {
              window.location.href = "/community";
            }}
            data-ocid="view-community-link"
          >
            <MessageCircleQuestion className="h-3.5 w-3.5 mr-1" />
            View Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Category selector */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Category</Label>
        <div
          className="flex flex-wrap gap-2"
          data-ocid="question-category-group"
        >
          {CATEGORIES.map(({ value, emoji }) => (
            <button
              type="button"
              key={value}
              onClick={() => setSelectedCategory(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedCategory === value
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
              data-ocid="question-category"
            >
              <span>{emoji}</span>
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Question Title */}
      <div className="space-y-2">
        <Label htmlFor="question-title" className="text-sm font-semibold">
          Question Title
          <span className="text-destructive ml-0.5">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="question-title"
            placeholder="e.g. Best pesticide for tomato blight?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl flex-1"
            data-ocid="question-title-input"
          />
          <VoiceInputButton
            aria-label="Voice input for question"
            onResult={(text) =>
              setTitle((prev) => (prev ? `${prev} ${text}` : text))
            }
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="question-desc" className="text-sm font-semibold">
          Details{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (optional)
          </span>
        </Label>
        <div className="flex items-start gap-2">
          <Textarea
            id="question-desc"
            placeholder="Add more context — crop variety, region, symptoms..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-xl resize-none flex-1"
            data-ocid="question-desc-input"
          />
          <VoiceInputButton
            aria-label="Voice input for question details"
            onResult={(text) =>
              setDescription((prev) => (prev ? `${prev} ${text}` : text))
            }
            className="mt-1"
          />
        </div>
      </div>

      {/* Photo attachment */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Attach Photo</Label>
        {hasPhoto ? (
          <div className="h-28 w-full rounded-xl bg-muted/60 border border-border flex flex-col items-center justify-center gap-1.5">
            <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Photo attached (demo)
            </p>
            <button
              type="button"
              onClick={() => setHasPhoto(false)}
              className="text-xs text-destructive hover:underline"
              data-ocid="question-remove-photo"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setHasPhoto(true);
              toast.info("Camera integration coming soon!");
            }}
            className="h-16 w-full rounded-xl bg-muted/60 border-2 border-dashed border-border flex items-center justify-center gap-2 hover:bg-muted/80 transition-smooth"
            data-ocid="question-attach-photo-btn"
          >
            <ImagePlus className="h-5 w-5 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">
              Add a photo of the problem
            </span>
          </button>
        )}
      </div>

      {/* Tips box */}
      <div className="bg-muted/50 rounded-xl p-3 space-y-1">
        <p className="text-xs font-semibold text-foreground">
          💡 Tips for great answers
        </p>
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>Mention your region or state</li>
          <li>Include the crop variety and growth stage</li>
          <li>Describe visible symptoms if any</li>
        </ul>
      </div>

      <AIEnhancementPanel contentType="question" />

      <Button
        type="submit"
        disabled={createQuestion.isPending || !title.trim()}
        className="w-full bg-accent text-accent-foreground font-semibold rounded-xl h-12 text-base hover:bg-accent/90 transition-smooth gap-2"
        data-ocid="post-question-submit"
      >
        <MessageCircleQuestion className="h-4 w-4" />
        {createQuestion.isPending ? "Posting..." : "Post to Community"}
      </Button>
    </form>
  );
}
