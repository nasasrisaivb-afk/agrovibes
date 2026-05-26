import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import type { Course, Educator } from "../../backend";

interface CourseCardProps {
  course: Course;
  educator?: Educator;
  index: number;
  onEnroll: (course: Course) => void;
  isEnrolled?: boolean;
  progressPercent?: number;
}

const LEVEL_STYLES: Record<string, string> = {
  beginner:
    "bg-[oklch(var(--role-farmer)/0.15)] text-[oklch(var(--role-farmer))]",
  intermediate: "bg-[oklch(var(--accent)/0.15)] text-[oklch(var(--accent))]",
  advanced:
    "bg-[oklch(var(--destructive)/0.12)] text-[oklch(var(--destructive))]",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  farming:
    "from-[oklch(var(--role-farmer)/0.3)] to-[oklch(var(--primary)/0.2)]",
  equipment: "from-[oklch(var(--role-machinery)/0.3)] to-[oklch(var(--muted))]",
  business: "from-[oklch(var(--role-buyer)/0.3)] to-[oklch(var(--accent)/0.2)]",
  certifications:
    "from-[oklch(var(--certified)/0.3)] to-[oklch(var(--role-educator)/0.2)]",
  default: "from-[oklch(var(--primary)/0.2)] to-[oklch(var(--muted))]",
};

function getCategoryGradient(category: string): string {
  const key = category.toLowerCase();
  return CATEGORY_GRADIENTS[key] ?? CATEGORY_GRADIENTS.default;
}

function getLevelStyle(level: string): string {
  return LEVEL_STYLES[level.toLowerCase()] ?? LEVEL_STYLES.beginner;
}

export function CourseCard({
  course,
  educator,
  index,
  onEnroll,
  isEnrolled,
  progressPercent,
}: CourseCardProps) {
  const gradient = getCategoryGradient(course.category);
  const isFree = course.price === 0;
  const durationHours = Math.round(Number(course.durationMinutes) / 60);

  return (
    <div
      className="bg-card rounded-xl overflow-hidden border border-border shadow-sm flex flex-col"
      data-ocid={`learn.course.item.${index}`}
    >
      {/* Thumbnail */}
      <div className="relative h-28 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}

        {course.isCertified && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[oklch(var(--certified))] text-[oklch(var(--primary-foreground))]">
              ✓ Certified
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2">
          {isFree ? (
            <span className="inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[oklch(var(--role-farmer))] text-white">
              FREE
            </span>
          ) : (
            <span className="inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-card/90 text-foreground backdrop-blur-sm">
              ₹{course.price}
            </span>
          )}
        </div>

        {isEnrolled && progressPercent !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/60">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1 gap-1.5">
        {/* Level badge */}
        <span
          className={`self-start px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${getLevelStyle(course.level)}`}
        >
          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
        </span>

        <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
          {course.title}
        </p>

        {/* Educator row */}
        {educator && (
          <div className="flex items-center gap-1.5">
            <img
              src={educator.avatarUrl}
              alt={educator.name}
              className="h-4 w-4 rounded-full object-cover"
            />
            <span className="text-[10px] text-muted-foreground truncate">
              {educator.name}
            </span>
          </div>
        )}

        {/* Rating + duration */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-[oklch(var(--accent))] text-[oklch(var(--accent))]" />
            <span className="font-medium text-foreground">
              {course.rating.toFixed(1)}
            </span>
          </span>
          <span>({Number(course.enrollmentCount).toLocaleString()})</span>
          <span className="flex items-center gap-0.5 ml-auto">
            <Clock className="h-2.5 w-2.5" />
            {durationHours}h
          </span>
        </div>

        {/* Action */}
        <Button
          type="button"
          size="sm"
          variant={isEnrolled ? "outline" : "default"}
          className="w-full h-7 text-xs mt-auto"
          onClick={() => onEnroll(course)}
          data-ocid={`learn.course.enroll_button.${index}`}
        >
          {isEnrolled ? "Continue" : "Enroll Now"}
        </Button>
      </div>
    </div>
  );
}
