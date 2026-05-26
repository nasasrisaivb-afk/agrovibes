import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Send,
  ShieldCheck,
  ShoppingBag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface AgriReel {
  id: string;
  gradient: string;
  duration: number;
  creator: {
    name: string;
    avatar: string;
    role: string;
    roleColor: string;
    location: string;
    verified: boolean;
  };
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  category: string;
  linkedProduct?: {
    name: string;
    price: number;
    unit: string;
  };
}

interface ReelCardProps {
  reel: AgriReel;
  isActive: boolean;
  index: number;
  onNext: () => void;
  onPrev: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function ReelCard({ reel, isActive, index, onNext }: ReelCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [showMuteToast, setShowMuteToast] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = reel.duration * 1000;

  // Reset state when active reel changes
  useEffect(() => {
    if (isActive) {
      setProgress(0);
      setIsPlaying(true);
      setCaptionExpanded(false);
    }
  }, [isActive]);

  // Progress timer
  useEffect(() => {
    if (!isActive || !isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          onNext();
          return 0;
        }
        return p + 100 / (DURATION / 100);
      });
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPlaying, DURATION, onNext]);

  const handleTap = () => {
    setIsPlaying((p) => !p);
  };

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
  };

  const handleMute = () => {
    setMuted((v) => !v);
    setShowMuteToast(true);
    setTimeout(() => setShowMuteToast(false), 1500);
  };

  const roleColorStyle = { color: reel.creator.roleColor };

  return (
    <div
      className="relative w-full h-full bg-black"
      data-ocid={`reel-card.${index + 1}`}
    >
      {/* Gradient background (video placeholder) */}
      <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient}`} />

      {/* Subtle animated overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

      {/* Category chip - top left corner */}
      <div className="absolute top-[130px] left-4 z-30">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white">
          {reel.category}
        </span>
      </div>

      {/* Progress bar - very top */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/20">
        <div
          className="h-full bg-white rounded-full transition-none"
          style={{ width: `${isActive ? progress : 0}%` }}
        />
      </div>

      {/* Tap to play/pause overlay */}
      <button
        type="button"
        className="absolute inset-0 z-10"
        onClick={handleTap}
        aria-label={isPlaying ? "Pause" : "Play"}
        data-ocid="reel-play-toggle"
      />

      {/* Pause indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-7 bg-white rounded-sm" />
              <div className="w-1.5 h-7 bg-white rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Mute toast */}
      {showMuteToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2 pointer-events-none">
          {muted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
          <span className="text-white text-sm font-medium">
            {muted ? "Muted" : "Sound On"}
          </span>
        </div>
      )}

      {/* ─── RIGHT SIDE ACTIONS ─── */}
      <div
        className="absolute right-3 z-30 flex flex-col items-center gap-5"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" }}
      >
        {/* Creator avatar + follow */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-white/10">
              <img
                src={reel.creator.avatar}
                alt={reel.creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = reel.gradient.includes("4a2e")
                      ? "#2d7a4f"
                      : "#c85a00";
                  }
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all active:scale-95 ${following ? "bg-white/20 border-white/30 text-white" : "bg-white text-black border-transparent"}`}
            onClick={() => setFollowing((v) => !v)}
            data-ocid="reel-follow-button"
            aria-label={following ? "Following" : "Follow creator"}
          >
            {following ? "✓ Following" : "+ Follow"}
          </button>
        </div>

        {/* Like */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 z-20"
          onClick={handleLike}
          aria-label="Like reel"
          data-ocid="reel-like-button"
        >
          <div
            className={`w-12 h-12 rounded-full reels-action-card flex items-center justify-center transition-transform active:scale-90 ${likeAnimating ? "scale-125" : ""}`}
            style={{ transitionDuration: likeAnimating ? "150ms" : "200ms" }}
          >
            <Heart
              className={`h-6 w-6 transition-colors duration-200 ${liked ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-white"}`}
            />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-sm leading-none">
            {formatCount(reel.likes + (liked ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          aria-label="Comment on reel"
          data-ocid="reel-comment-button"
        >
          <div className="w-12 h-12 rounded-full reels-action-card flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-sm leading-none">
            {formatCount(reel.comments)}
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          aria-label="Share reel"
          data-ocid="reel-share-button"
        >
          <div className="w-12 h-12 rounded-full reels-action-card flex items-center justify-center">
            <Send className="h-6 w-6 text-white -rotate-12" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-sm leading-none">
            {formatCount(reel.shares)}
          </span>
        </button>

        {/* Save */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          onClick={() => setSaved((v) => !v)}
          aria-label="Save reel"
          data-ocid="reel-save-button"
        >
          <div className="w-12 h-12 rounded-full reels-action-card flex items-center justify-center">
            <Bookmark
              className={`h-6 w-6 transition-colors duration-200 ${saved ? "fill-[#fbbf24] text-[#fbbf24]" : "text-white"}`}
            />
          </div>
        </button>

        {/* More */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          aria-label="More options"
          data-ocid="reel-more-button"
        >
          <div className="w-12 h-12 rounded-full reels-action-card flex items-center justify-center">
            <MoreHorizontal className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>

      {/* ─── BOTTOM-LEFT CREATOR INFO ─── */}
      <div
        className="absolute left-0 right-16 z-30"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)" }}
      >
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        <div className="relative px-4 pb-3">
          {/* Creator row */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/10 flex-shrink-0">
              <img
                src={reel.creator.avatar}
                alt={reel.creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-bold text-sm leading-tight">
                  {reel.creator.name}
                </span>
                {reel.creator.verified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-[#60a5fa] flex-shrink-0" />
                )}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20"
                  style={{
                    backgroundColor: `${reel.creator.roleColor}22`,
                    ...roleColorStyle,
                  }}
                >
                  {reel.creator.role}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-white/60 flex-shrink-0" />
                <span className="text-white/70 text-xs">
                  {reel.creator.location}
                </span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <button
            type="button"
            className="text-left w-full"
            onClick={() => setCaptionExpanded((v) => !v)}
            data-ocid="reel-caption-toggle"
          >
            <p
              className={`text-white text-sm leading-snug drop-shadow-sm ${captionExpanded ? "" : "line-clamp-2"}`}
            >
              {reel.caption}
            </p>
            {!captionExpanded && reel.caption.length > 80 && (
              <span className="text-white/60 text-xs mt-0.5 inline-block">
                more
              </span>
            )}
          </button>

          {/* Hashtags */}
          <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {reel.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[#60c8ff] text-xs font-medium flex-shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Linked product chip */}
          {reel.linkedProduct && (
            <div className="mt-2.5 flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-2xl px-3 py-2.5 border border-white/15">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {reel.linkedProduct.name}
                </p>
                <p className="text-[#4ade80] text-xs font-bold">
                  ₹{reel.linkedProduct.price}/{reel.linkedProduct.unit}
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 bg-[#4ade80] text-black text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 active:scale-95 transition-transform"
                data-ocid="reel-buy-now"
              >
                Buy Now
              </button>
            </div>
          )}

          {/* Audio indicator */}
          <div className="flex items-center gap-1.5 mt-2">
            <div
              className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <Music2 className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-white/70 text-[10px] truncate max-w-[160px]">
              Original audio · {reel.creator.name}
            </span>
          </div>
        </div>
      </div>

      {/* Mute button — bottom right above nav */}
      <button
        type="button"
        className="absolute right-4 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/15 active:scale-90 transition-transform"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          transform: "none",
        }}
        onClick={handleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        data-ocid="reel-mute-button"
      >
        {muted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
}
