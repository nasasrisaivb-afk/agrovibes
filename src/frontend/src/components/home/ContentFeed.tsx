import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart2,
  BookOpen,
  Play,
  Radio,
  RefreshCw,
  Star,
} from "lucide-react";
import { StreamStatus } from "../../backend";
import type { UserRole } from "../../context/RoleContext";
import {
  useGetCourses,
  useGetLiveStreams,
  useGetReels,
} from "../../lib/backend";

const FEED_LABELS: Record<UserRole, string> = {
  farmer: "Trending in your area",
  buyer: "Recommended for you",
  educator: "For Educators",
  machinery: "Equipment & Farming",
  service: "Service Opportunities",
};

const MARKET_UPDATES = [
  {
    id: "mu-1",
    title: "Tomato prices surge 15% in Maharashtra markets",
    excerpt: "Increased demand from processors driving prices higher",
    time: "2h ago",
  },
  {
    id: "mu-2",
    title: "Wheat procurement targets updated for Rabi season",
    excerpt: "Government raises MSP by ₹110/quintal",
    time: "5h ago",
  },
];

const SUCCESS_STORIES = [
  {
    id: "ss-1",
    farmer: "Kavya Reddy",
    location: "Telangana",
    story:
      "Doubled yield using drip irrigation technique learned on AgriMarket",
    avatar: "/assets/images/farmer-kavya.jpg",
  },
];

function FeedCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

interface ContentFeedProps {
  role: UserRole;
}

export function ContentFeed({ role }: ContentFeedProps) {
  const navigate = useNavigate();
  const {
    data: reels,
    isLoading: reelsLoading,
    isError: reelsError,
    refetch,
  } = useGetReels();
  const { data: streams, isLoading: streamsLoading } = useGetLiveStreams();
  const { data: courses, isLoading: coursesLoading } = useGetCourses();

  const isLoading = reelsLoading || streamsLoading || coursesLoading;
  const feedLabel = FEED_LABELS[role];

  const streamList = Array.isArray(streams) ? streams : [];
  const reelList = Array.isArray(reels) ? reels : [];
  const courseList = Array.isArray(courses) ? courses : [];

  return (
    <section aria-label="Content feed" data-ocid="content-feed">
      {/* Section header for rest of feed */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-display font-semibold text-base flex items-center gap-1.5">
          <span className="text-lg">🎬</span>
          {feedLabel}
        </h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth h-7 px-2 rounded-lg hover:bg-muted/50"
          data-ocid="feed-refresh"
          aria-label="Refresh feed"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {reelsError && !isLoading && (
        <div
          className="mx-4 flex flex-col items-center gap-3 py-8 bg-muted/30 rounded-2xl text-center"
          data-ocid="feed-error"
        >
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-medium">Couldn't load content</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            data-ocid="feed-retry"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="flex flex-col gap-3 px-4" data-ocid="feed-loading">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      )}

      {!isLoading && !reelsError && (
        <div className="flex flex-col gap-3 px-4">
          {/* Live Streams */}
          {streamList.slice(0, 2).map((stream, idx) => (
            <article
              key={stream.id.toString()}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
              data-ocid={`feed-stream-item.${idx + 1}`}
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="badge-live">
                    <Radio className="h-2.5 w-2.5" />
                    {stream.status === StreamStatus.Live ? "LIVE" : "UPCOMING"}
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-black/40 rounded-full px-2 py-0.5 text-white text-[10px]">
                  {Number(stream.viewerCount).toLocaleString()} watching
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white font-bold text-sm line-clamp-1 drop-shadow">
                    {stream.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <Badge variant="outline" className="text-[10px] h-5 px-2">
                  Stream
                </Badge>
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs bg-primary text-primary-foreground"
                  data-ocid={`feed-stream-watch.${idx + 1}`}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Watch
                </Button>
              </div>
            </article>
          ))}

          {/* Educational Snippets (courses) */}
          {courseList.slice(0, 2).map((course, idx) => (
            <article
              key={course.id.toString()}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
              data-ocid={`feed-course-item.${idx + 1}`}
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="badge-course">
                    <BookOpen className="h-2.5 w-2.5" />
                    Course
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-1">
                  {course.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-muted-foreground">
                    {Number(course.enrollmentCount).toLocaleString()} students
                  </span>
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() => navigate({ to: "/learn" })}
                    data-ocid={`feed-course-enroll.${idx + 1}`}
                  >
                    Enroll
                  </Button>
                </div>
              </div>
            </article>
          ))}

          {/* Market Updates */}
          {MARKET_UPDATES.map((update, idx) => (
            <article
              key={update.id}
              className="bg-muted/40 border border-border rounded-2xl p-3 flex items-start gap-3"
              data-ocid={`feed-market-update.${idx + 1}`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold line-clamp-2">
                  {update.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {update.excerpt}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {update.time}
                </p>
              </div>
            </article>
          ))}

          {/* Success Stories */}
          {SUCCESS_STORIES.map((story, idx) => (
            <article
              key={story.id}
              className="bg-accent/10 border border-accent/25 rounded-2xl p-3 flex items-start gap-3"
              data-ocid={`feed-success-story.${idx + 1}`}
            >
              <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                <img
                  src={story.avatar}
                  alt={story.farmer}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <p className="text-xs font-semibold">
                    {story.farmer} · {story.location}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {story.story}
                </p>
              </div>
            </article>
          ))}

          {/* Empty State */}
          {reelList.length === 0 &&
            streamList.length === 0 &&
            courseList.length === 0 && (
              <div
                className="flex flex-col items-center gap-3 py-10 text-center"
                data-ocid="feed-empty"
              >
                <span className="text-5xl">🌱</span>
                <p className="font-display font-semibold text-base">
                  No content yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your story!
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/create" })}
                  data-ocid="feed-empty-create-cta"
                >
                  Create Content
                </Button>
              </div>
            )}
        </div>
      )}
    </section>
  );
}
