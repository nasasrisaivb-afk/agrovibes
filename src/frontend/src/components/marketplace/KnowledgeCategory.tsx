import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Course, Educator } from "../../backend";
import { KycStatus } from "../../backend";
import { useGetCourses, useGetEducators } from "../../lib/backend";

// ── Static consultation data ────────────────────────────────────────────────
const CONSULTATIONS = [
  {
    id: 1,
    name: "Dr. Arun Mehta",
    specialty: "Agronomy & Crop Science",
    rate: 500,
    rating: 4.9,
    avatar: "https://picsum.photos/seed/e1/80/80",
    available: true,
    nextSlot: "Today, 3 PM",
  },
  {
    id: 2,
    name: "Dr. Priya Sekharan",
    specialty: "Pest & Disease Management",
    rate: 600,
    rating: 4.8,
    avatar: "https://picsum.photos/seed/e2/80/80",
    available: true,
    nextSlot: "Tomorrow, 10 AM",
  },
  {
    id: 3,
    name: "CA Suresh Jha",
    specialty: "Farm Finance & Pricing",
    rate: 750,
    rating: 4.7,
    avatar: "https://picsum.photos/seed/e3/80/80",
    available: false,
    nextSlot: "Fri, Apr 18",
  },
];

type KnowledgeFilter = "all" | "free" | "paid" | "certified";

// ── Sub-components ─────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const isFree = course.price === 0;
  const durationHours = Math.round(Number(course.durationMinutes) / 60);

  const handleEnroll = () => {
    toast.success(`Enrolled in "${course.title}"!`, {
      duration: 3000,
      icon: "🎓",
    });
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col"
      data-ocid="course-card"
    >
      <div className="relative h-[130px] bg-muted overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {course.isCertified && (
          <div className="absolute top-1.5 left-1.5">
            <Badge className="bg-[oklch(var(--certified))]/90 text-white border-0 text-[9px] px-1.5 py-0.5 gap-0.5">
              <Award className="h-2.5 w-2.5" />
              Certified
            </Badge>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5">
          {isFree ? (
            <Badge className="bg-[oklch(var(--success))]/90 text-white border-0 text-[9px] px-1.5 py-0.5">
              Free
            </Badge>
          ) : (
            <Badge className="bg-card/90 text-foreground border-0 text-[9px] px-1.5 py-0.5">
              ₹{course.price}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <p className="font-semibold text-sm leading-tight line-clamp-2">
          {course.title}
        </p>
        <p className="text-[10px] text-muted-foreground line-clamp-1">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
            {course.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            {Number(course.enrollmentCount).toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {durationHours}h
          </span>
        </div>

        <Button
          size="sm"
          className="w-full h-7 text-xs mt-auto bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleEnroll}
          data-ocid="course-enroll-btn"
        >
          <BookOpen className="h-3 w-3 mr-1" />
          {isFree ? "Enroll Free" : `Enroll ₹${course.price}`}
        </Button>
      </div>
    </div>
  );
}

function EducatorCard({ educator }: { educator: Educator }) {
  const isVerified = educator.kycStatus === KycStatus.Verified;

  return (
    <div
      className="flex-shrink-0 w-36 bg-card rounded-2xl border border-border p-3 flex flex-col items-center gap-2 text-center shadow-sm"
      data-ocid="educator-spotlight-card"
    >
      <div className="relative">
        <img
          src={educator.avatarUrl}
          alt={educator.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-[oklch(var(--certified))]/40"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {isVerified && (
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[oklch(var(--trust))] rounded-full flex items-center justify-center">
            <Award className="h-2.5 w-2.5 text-white" />
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight line-clamp-1">
          {educator.name}
        </p>
        <p className="text-[10px] text-muted-foreground line-clamp-1">
          {educator.specialty}
        </p>
      </div>
      <div className="flex items-center gap-1 text-[10px]">
        <Star className="h-2.5 w-2.5 fill-accent text-accent" />
        <span>{educator.rating.toFixed(1)}</span>
        <span className="text-muted-foreground">
          · {Number(educator.studentCount).toLocaleString()} students
        </span>
      </div>
    </div>
  );
}

function ConsultationCard({ c }: { c: (typeof CONSULTATIONS)[0] }) {
  const handleBook = () => {
    toast.success(`Session with ${c.name} booking requested`, {
      duration: 3000,
      icon: "📅",
    });
  };
  return (
    <div
      className="bg-card rounded-2xl border border-border p-3 flex items-start gap-3 shadow-sm"
      data-ocid="consultation-card"
    >
      <img
        src={c.avatar}
        alt={c.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-[oklch(var(--certified))]/30 flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/images/placeholder.svg";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{c.name}</p>
        <p className="text-[10px] text-muted-foreground">{c.specialty}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px]">
          <span className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
            {c.rating}
          </span>
          <span className="font-medium text-primary">₹{c.rate}/hr</span>
          <span className="flex items-center gap-0.5 text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {c.nextSlot}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant={c.available ? "default" : "outline"}
        disabled={!c.available}
        className="h-7 text-[10px] shrink-0"
        onClick={handleBook}
        data-ocid="book-consultation-btn"
      >
        {c.available ? "Book" : "Notify"}
      </Button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function KnowledgeCategory() {
  const [filter, setFilter] = useState<KnowledgeFilter>("all");
  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const { data: educators, isLoading: educatorsLoading } = useGetEducators();

  const courseList = Array.isArray(courses) ? courses : [];
  const educatorList = Array.isArray(educators) ? educators : [];

  const filteredCourses = courseList.filter((c: Course) => {
    if (filter === "free") return c.price === 0;
    if (filter === "paid") return c.price > 0;
    if (filter === "certified") return c.isCertified;
    return true;
  });

  const FILTERS: Array<{ label: string; value: KnowledgeFilter }> = [
    { label: "All", value: "all" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
    { label: "Certified", value: "certified" },
  ];

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
            data-ocid="knowledge-filter"
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="px-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary" />
          Courses
        </h3>
        {coursesLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => `sk-${i}`).map((k) => (
              <div
                key={k}
                className="rounded-2xl overflow-hidden border border-border"
              >
                <Skeleton className="h-[130px] w-full rounded-none" />
                <div className="p-2.5 space-y-2">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-2/3 rounded-full" />
                  <Skeleton className="h-7 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCourses.map((course: Course) => (
              <CourseCard key={course.id.toString()} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Top educators */}
      <div>
        <h3 className="font-semibold text-sm mb-3 px-4 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-primary" />
          Top Educators
        </h3>
        {educatorsLoading ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4">
            {Array.from({ length: 4 }, (_, i) => `esk-${i}`).map((k) => (
              <Skeleton
                key={k}
                className="w-36 h-40 rounded-2xl flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4">
            {educatorList.map((edu: Educator) => (
              <EducatorCard key={edu.id.toString()} educator={edu} />
            ))}
          </div>
        )}
      </div>

      {/* Consultation booking */}
      <div className="px-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4 text-primary" />
          Expert Consultations
        </h3>
        <div className="flex flex-col gap-2.5">
          {CONSULTATIONS.map((c) => (
            <ConsultationCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
