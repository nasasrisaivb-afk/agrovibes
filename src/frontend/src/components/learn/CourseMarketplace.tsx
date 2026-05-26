import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Course, LiveStream } from "../../backend";
import { StreamStatus } from "../../backend";
import {
  useGetCourses,
  useGetEducators,
  useGetLiveStreams,
} from "../../lib/backend";
import { CourseCard } from "./CourseCard";
import { CourseDetail } from "./CourseDetail";

const CATEGORIES = [
  "All",
  "Farming Basics",
  "Advanced",
  "Equipment",
  "Business",
  "Certifications",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const ENROLLED_IDS = [1n, 3n];
const ENROLLED_PROGRESS: Record<string, number> = { "1": 65, "3": 30 };

// UI lookup for host info (since backend LiveStream doesn't have hostName/hostAvatarUrl)
const HOST_INFO: Record<string, { name: string; avatarUrl: string }> = {
  "1": {
    name: "Dr. Ramesh Singh",
    avatarUrl: "https://picsum.photos/seed/edu1/80/80",
  },
  "2": {
    name: "Saham Hanani",
    avatarUrl: "https://picsum.photos/seed/edu2/80/80",
  },
  "3": {
    name: "Prof. Aruna Menon",
    avatarUrl: "https://picsum.photos/seed/edu3/80/80",
  },
  "4": {
    name: "Vikram Bhat",
    avatarUrl: "https://picsum.photos/seed/edu4/80/80",
  },
  "5": {
    name: "Dr. Sunita Gupta",
    avatarUrl: "https://picsum.photos/seed/edu5/80/80",
  },
  "6": {
    name: "Manpreet Kaur",
    avatarUrl: "https://picsum.photos/seed/edu6/80/80",
  },
};

function StreamCard({ stream, index }: { stream: LiveStream; index: number }) {
  const isLive = stream.status === StreamStatus.Live;
  const host = HOST_INFO[stream.hostId.toString()];

  function handleJoin() {
    toast.info("🔴 Live streaming coming soon", {
      description:
        "This feature is being rolled out. You'll be notified when it's available.",
      duration: 4000,
    });
  }

  return (
    <div
      className="flex-shrink-0 w-48 rounded-xl overflow-hidden bg-card border border-border shadow-sm"
      data-ocid={`learn.stream.item.${index}`}
    >
      <div className="relative h-24 bg-muted/40">
        {stream.thumbnailUrl ? (
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[oklch(var(--live-indicator)/0.3)] to-muted flex items-center justify-center">
            <PlayCircle className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          {isLive ? (
            <span className="badge-live text-[9px] px-1.5 py-0.5 gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-muted/80 text-foreground backdrop-blur-sm">
              ⏰ Scheduled
            </span>
          )}
        </div>
        {isLive && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-1.5 py-0.5">
            <Users className="h-2.5 w-2.5 text-white" />
            <span className="text-[9px] text-white font-medium">
              {Number(stream.viewerCount).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight">
          {stream.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {host?.avatarUrl && (
            <img
              src={host.avatarUrl}
              alt={host.name}
              className="h-3.5 w-3.5 rounded-full object-cover"
            />
          )}
          <span className="text-[10px] text-muted-foreground truncate flex-1">
            {host?.name ?? "Educator"}
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full h-6 text-[10px] mt-2"
          onClick={handleJoin}
          data-ocid={`learn.stream.join_button.${index}`}
        >
          Join
        </Button>
      </div>
    </div>
  );
}

export function CourseMarketplace() {
  const { data: courses = [], isLoading: coursesLoading } = useGetCourses();
  const { data: educators = [] } = useGetEducators();
  const { data: streams = [] } = useGetLiveStreams();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<bigint[]>(ENROLLED_IDS);

  const courseList = Array.isArray(courses) ? courses : [];
  const educatorList = Array.isArray(educators) ? educators : [];
  const streamList = Array.isArray(streams) ? streams : [];

  const educatorMap = Object.fromEntries(
    educatorList.map((e) => [e.id.toString(), e]),
  );

  const filteredCourses =
    selectedCategory === "All"
      ? courseList
      : courseList.filter((c) => {
          const cat = selectedCategory.toLowerCase().replace(" ", "");
          return c.category
            .toLowerCase()
            .replace(" ", "")
            .includes(cat.slice(0, 6));
        });

  const featured = filteredCourses[0];
  const remaining = filteredCourses.slice(1);

  function handleEnroll(course: Course) {
    if (enrolledIds.includes(course.id)) {
      toast.success("Continuing your learning journey!");
    } else {
      setEnrolledIds((prev) => [...prev, course.id]);
      toast.success(`Enrolled in "${course.title}"! 🎉`, {
        description: "Demo mode — your progress is saved locally.",
        duration: 4000,
      });
    }
    setSelectedCourse(null);
  }

  const liveAndScheduled = streamList.filter(
    (s) => s.status !== StreamStatus.Ended,
  );

  return (
    <div className="flex flex-col gap-0" data-ocid="learn.courses.section">
      {/* Category filters */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat, i) => (
            <button
              type="button"
              key={cat}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-foreground border-border"
              }`}
              onClick={() => setSelectedCategory(cat)}
              data-ocid={`learn.courses.filter.${i + 1}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured course banner */}
      {!coursesLoading && featured && (
        <section className="px-4 pb-4">
          <h2 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
            Featured Course
          </h2>
          <button
            type="button"
            className="w-full text-left rounded-2xl overflow-hidden border border-border shadow-sm bg-card relative"
            onClick={() => setSelectedCourse(featured)}
            data-ocid="learn.courses.featured_card"
          >
            <div className="relative h-36">
              {featured.thumbnailUrl ? (
                <img
                  src={featured.thumbnailUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/25 to-[oklch(var(--role-educator)/0.2)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
            </div>
            <div className="p-3 -mt-6 relative z-10">
              {featured.isCertified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[oklch(var(--certified))] text-white mb-2">
                  ✓ Certified
                </span>
              )}
              <p className="font-display font-bold text-base text-foreground line-clamp-2">
                {featured.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                {educatorMap[featured.educatorId.toString()] && (
                  <div className="flex items-center gap-1.5">
                    <img
                      src={
                        educatorMap[featured.educatorId.toString()].avatarUrl
                      }
                      alt={educatorMap[featured.educatorId.toString()].name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-muted-foreground">
                      {educatorMap[featured.educatorId.toString()].name}
                    </span>
                  </div>
                )}
                <span className="ml-auto text-sm font-bold text-primary">
                  {featured.price === 0 ? "FREE" : `₹${featured.price}`}
                </span>
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Live streams row */}
      {liveAndScheduled.length > 0 && (
        <section className="pb-4">
          <div className="px-4 flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[oklch(var(--live-indicator))] animate-pulse" />
              Live & Upcoming Streams
            </h2>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-none">
            {liveAndScheduled.map((stream, i) => (
              <StreamCard
                key={stream.id.toString()}
                stream={stream}
                index={i + 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Course grid */}
      <section className="px-4 pb-6">
        <h2 className="font-semibold text-sm text-foreground mb-3">
          {selectedCategory === "All" ? "All Courses" : selectedCategory}
          {!coursesLoading && (
            <span className="text-muted-foreground font-normal ml-1">
              ({filteredCourses.length})
            </span>
          )}
        </h2>

        {coursesLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {remaining.map((course, i) => (
              <button
                type="button"
                key={course.id.toString()}
                className="text-left"
                onClick={() => setSelectedCourse(course)}
              >
                <CourseCard
                  course={course}
                  educator={educatorMap[course.educatorId.toString()]}
                  index={i + 2}
                  onEnroll={handleEnroll}
                  isEnrolled={enrolledIds.includes(course.id)}
                  progressPercent={ENROLLED_PROGRESS[course.id.toString()]}
                />
              </button>
            ))}
          </div>
        )}

        {!coursesLoading && filteredCourses.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="learn.courses.empty_state"
          >
            <BookOpenIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No courses found</p>
            <p className="text-xs mt-1">Try selecting a different category</p>
          </div>
        )}
      </section>

      {/* Course detail overlay */}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          educator={educatorMap[selectedCourse.educatorId.toString()]}
          onClose={() => setSelectedCourse(null)}
          onEnroll={() => handleEnroll(selectedCourse)}
          isEnrolled={enrolledIds.includes(selectedCourse.id)}
        />
      )}
    </div>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-label="No courses"
    >
      <title>No courses</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}
