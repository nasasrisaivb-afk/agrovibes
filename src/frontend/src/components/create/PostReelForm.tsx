import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReel, useGetListings } from "@/lib/backend";
import type { Listing } from "@/types";
import { Camera, CheckCircle2, Music, Play, Type, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AIEnhancementPanel } from "./AIEnhancementPanel";
import { VoiceInputButton } from "./VoiceInputButton";

const MOCK_FARMER_ID = BigInt(1);

const DURATION_OPTIONS = [
  { value: "9", label: "9s — Snappy" },
  { value: "15", label: "15s — Standard" },
  { value: "30", label: "30s — Extended" },
];

const MUSIC_OPTIONS = [
  { value: "none", label: "No Music" },
  { value: "harvest", label: "🎵 Harvest Beats" },
  { value: "nature", label: "🌿 Nature Ambience" },
  { value: "folk", label: "🪘 Desi Folk" },
  { value: "upbeat", label: "⚡ Upbeat Farm" },
];

export function PostReelForm() {
  const [title, setTitle] = useState("");
  const [linkedListingId, setLinkedListingId] = useState<string>("");
  const [duration, setDuration] = useState("15");
  const [music, setMusic] = useState("none");
  const [textOverlay, setTextOverlay] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: listings = [] } = useGetListings();
  const createReel = useCreateReel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a reel title.");
      return;
    }

    try {
      await createReel.mutateAsync({
        title: title.trim(),
        thumbnailUrl: "",
        farmerId: MOCK_FARMER_ID,
        linkedListingId: linkedListingId ? BigInt(linkedListingId) : undefined,
      });
      setSuccess(true);
      setTitle("");
      setLinkedListingId("");
      toast.success("Reel posted successfully!");
    } catch {
      toast.error("Failed to post reel. Please try again.");
    }
  };

  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-10 text-center"
        data-ocid="reel-success"
      >
        <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">
            Reel Posted!
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your reel is live and visible to the community.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSuccess(false)}
            data-ocid="post-another-reel"
          >
            Post Another
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground"
            data-ocid="view-reels-link"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            View Reels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Upload area */}
      <div
        className="aspect-video bg-muted/60 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/80 transition-smooth"
        data-ocid="reel-upload"
      >
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <Video className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Tap to record or upload video
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <Camera className="h-3.5 w-3.5" /> Camera
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <Play className="h-3.5 w-3.5" /> Gallery
          </Button>
        </div>
      </div>

      {/* Duration selector */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Video Duration</Label>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map(({ value, label }) => (
            <button
              type="button"
              key={value}
              onClick={() => setDuration(value)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-smooth ${
                duration === value
                  ? "bg-accent/10 border-accent text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40"
              }`}
              data-ocid={`reel-duration-${value}s`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reel Title */}
      <div className="space-y-2">
        <Label htmlFor="reel-title" className="text-sm font-semibold">
          Reel Title
          <span className="text-destructive ml-0.5">*</span>
        </Label>
        <div className="relative flex items-center gap-2">
          <Input
            id="reel-title"
            placeholder="e.g. Harvesting fresh tomatoes today..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl pr-4 flex-1"
            data-ocid="reel-title-input"
          />
          <VoiceInputButton
            aria-label="Voice input for reel title"
            onResult={(text) =>
              setTitle((prev) => (prev ? `${prev} ${text}` : text))
            }
          />
        </div>
      </div>

      {/* Background Music */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Music className="h-3.5 w-3.5 text-accent" />
          Background Music
        </Label>
        <Select value={music} onValueChange={setMusic}>
          <SelectTrigger className="rounded-xl" data-ocid="reel-music-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MUSIC_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text overlay toggle */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-accent" />
          <div>
            <p className="text-sm font-semibold">Text Overlay</p>
            <p className="text-xs text-muted-foreground">
              Add captions over your video
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={textOverlay}
          onClick={() => setTextOverlay((v) => !v)}
          className={`relative w-10 h-6 rounded-full transition-smooth ${textOverlay ? "bg-primary" : "bg-muted"}`}
          data-ocid="reel-text-overlay-toggle"
        >
          <span
            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-card transition-smooth ${textOverlay ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Link Product */}
      <div className="space-y-2">
        <Label htmlFor="linked-listing" className="text-sm font-semibold">
          Link a Product{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (optional)
          </span>
        </Label>
        <Select value={linkedListingId} onValueChange={setLinkedListingId}>
          <SelectTrigger
            id="linked-listing"
            className="rounded-xl"
            data-ocid="linked-listing-select"
          >
            <SelectValue placeholder="Select a listing to link..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No product linked</SelectItem>
            {(listings as Listing[]).map((listing) => (
              <SelectItem key={String(listing.id)} value={String(listing.id)}>
                {listing.name} — ₹{listing.price}/kg
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {linkedListingId && (
          <p className="text-xs text-success flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Viewers can buy directly from your reel
          </p>
        )}
      </div>

      {/* AI Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          AI-Suggested Tags
          <Badge
            variant="outline"
            className="ml-2 text-[10px] px-1.5 py-0 border-accent/50 text-accent"
          >
            AI
          </Badge>
        </Label>
        <div className="flex flex-wrap gap-2">
          {["Fresh Harvest", "Organic", "Farm-to-Table", "Local Produce"].map(
            (tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer text-xs hover:bg-primary/10 hover:border-primary transition-colors"
                data-ocid="reel-tag-chip"
              >
                #{tag}
              </Badge>
            ),
          )}
        </div>
      </div>

      <AIEnhancementPanel contentType="reel" />

      <Button
        type="submit"
        disabled={createReel.isPending || !title.trim()}
        className="w-full bg-accent text-accent-foreground font-semibold rounded-xl h-12 text-base hover:bg-accent/90 transition-smooth"
        data-ocid="post-reel-submit"
      >
        {createReel.isPending ? "Posting..." : "Post Reel"}
      </Button>
    </form>
  );
}
