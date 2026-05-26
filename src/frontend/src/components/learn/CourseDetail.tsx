import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Star,
  X,
} from "lucide-react";
import type { Course, Educator } from "../../backend";
import { KycStatus } from "../../backend";

interface CourseDetailProps {
  course: Course;
  educator?: Educator;
  onClose: () => void;
  onEnroll: () => void;
  isEnrolled?: boolean;
}

const SAMPLE_LESSONS = [
  "Introduction to the course and objectives",
  "Understanding soil types and their properties",
  "Seasonal crop planning techniques",
  "Irrigation methods — drip vs sprinkler",
  "Pest identification and organic management",
  "Harvesting, post-harvest handling, and storage",
];

export function CourseDetail({
  course,
  educator,
  onClose,
  onEnroll,
  isEnrolled,
}: CourseDetailProps) {
  const isFree = course.price === 0;
  const durationHours = Math.round(Number(course.durationMinutes) / 60);
  const isVerified = educator?.kycStatus === KycStatus.Verified;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto"
      data-ocid="learn.course.detail"
    >
      {/* Header image */}
      <div className="relative h-52 bg-muted flex-shrink-0">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-foreground"
          data-ocid="learn.course.detail.close_button"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {course.isCertified && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-[oklch(var(--certified))] text-white">
              ✓ Certified Program
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-24 flex flex-col gap-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {course.category} · {course.level}
          </span>
          <h2 className="font-display font-bold text-xl text-foreground mt-1">
            {course.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 border-y border-border">
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-[oklch(var(--accent))] text-[oklch(var(--accent))]" />
            <span className="font-semibold">{course.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs">
              ({Number(course.enrollmentCount).toLocaleString()} students)
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{durationHours} hours</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
            <BookOpen className="h-4 w-4" />
            <span>{SAMPLE_LESSONS.length} lessons</span>
          </div>
        </div>

        {/* Educator */}
        {educator && (
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <img
              src={educator.avatarUrl}
              alt={educator.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground">
                  {educator.name}
                </p>
                {isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {educator.specialty}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{Number(educator.courseCount)} courses</span>
                <span>
                  {Number(educator.studentCount).toLocaleString()} students
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum */}
        <div>
          <h3 className="font-semibold text-base text-foreground mb-3">
            Curriculum
          </h3>
          <div className="flex flex-col gap-2">
            {SAMPLE_LESSONS.map((lesson, i) => (
              <div
                key={lesson}
                className="flex items-center gap-3 p-2.5 bg-muted/20 rounded-lg"
              >
                <PlayCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{lesson}</span>
                <span className="text-xs text-muted-foreground">
                  {8 + i * 3}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-card/95 backdrop-blur-sm border-t border-border flex items-center gap-3">
        <div className="flex-1">
          {isFree ? (
            <p className="text-lg font-bold text-[oklch(var(--role-farmer))]">
              FREE
            </p>
          ) : (
            <p className="text-lg font-bold text-foreground">₹{course.price}</p>
          )}
          <p className="text-xs text-muted-foreground">Lifetime access</p>
        </div>
        <Button
          type="button"
          className="h-11 px-6 text-sm font-semibold"
          onClick={onEnroll}
          data-ocid="learn.course.detail.enroll_button"
        >
          {isEnrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </div>
    </div>
  );
}
