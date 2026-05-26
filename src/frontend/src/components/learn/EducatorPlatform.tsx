import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Educator } from "../../backend";
import { KycStatus } from "../../backend";
import { useRoleContext } from "../../context/RoleContext";
import { useGetEducators } from "../../lib/backend";

const MY_COURSES_DATA = [
  {
    id: 1,
    title: "Organic Farming Basics",
    enrolled: 312,
    rating: 4.8,
    revenue: 78000,
  },
  {
    id: 2,
    title: "Soil Health & Fertility",
    enrolled: 189,
    rating: 4.6,
    revenue: 47250,
  },
  {
    id: 3,
    title: "Sustainable Pest Management",
    enrolled: 97,
    rating: 4.9,
    revenue: 24250,
  },
];

const RECENT_ENROLLMENTS = [
  {
    name: "Arjun Sharma",
    course: "Organic Farming Basics",
    time: "2 hours ago",
  },
  {
    name: "Radha Devi",
    course: "Soil Health & Fertility",
    time: "5 hours ago",
  },
  { name: "Karan Patel", course: "Organic Farming Basics", time: "1 day ago" },
  {
    name: "Sumitra Bai",
    course: "Sustainable Pest Management",
    time: "2 days ago",
  },
  {
    name: "Renjith Kumar",
    course: "Soil Health & Fertility",
    time: "3 days ago",
  },
];

function EducatorCard({
  educator,
  index,
  isFollowed,
  onFollow,
}: {
  educator: Educator;
  index: number;
  isFollowed: boolean;
  onFollow: () => void;
}) {
  const isVerified = educator.kycStatus === KycStatus.Verified;

  return (
    <div
      className="bg-card border border-border rounded-xl p-3"
      data-ocid={`learn.educator.item.${index}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={educator.avatarUrl}
            alt={educator.name}
            className="h-14 w-14 rounded-full object-cover bg-muted"
          />
          {isVerified && (
            <CheckCircle className="absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 text-primary fill-card" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground truncate">
              {educator.name}
            </p>
            {isVerified && (
              <span className="trust-indicator-badge text-[9px] px-1.5 py-0.5">
                KYC ✓
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {educator.specialty}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {Number(educator.courseCount)} courses
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {Number(educator.studentCount).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-[oklch(var(--accent))]">
              <Star className="h-3 w-3 fill-[oklch(var(--accent))]" />
              {educator.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          size="sm"
          variant={isFollowed ? "outline" : "default"}
          className="flex-1 h-8 text-xs"
          onClick={onFollow}
          data-ocid={`learn.educator.follow_button.${index}`}
        >
          {isFollowed ? "Following" : "Follow"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
          data-ocid={`learn.educator.view_courses_button.${index}`}
        >
          View Courses
        </Button>
      </div>
    </div>
  );
}

function EducatorDashboardPanel() {
  return (
    <div className="flex flex-col gap-5">
      {/* Analytics Summary */}
      <div className="bg-gradient-to-br from-[oklch(var(--role-educator)/0.12)] to-[oklch(var(--primary)/0.06)] border border-[oklch(var(--role-educator)/0.2)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-[oklch(var(--role-educator))]" />
          <span className="text-sm font-semibold text-foreground">
            Analytics Overview
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-primary font-display">598</p>
            <p className="text-[10px] text-muted-foreground">Students</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[oklch(var(--accent))] font-display">
              ₹1.5L
            </p>
            <p className="text-[10px] text-muted-foreground">Total Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[oklch(var(--role-educator))] font-display">
              4.8
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-2">
          My Courses
        </h3>
        <div className="flex flex-col gap-2">
          {MY_COURSES_DATA.map((course, i) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              data-ocid={`learn.my_course.item.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {course.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>{course.enrolled} enrolled</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-[oklch(var(--accent))] text-[oklch(var(--accent))]" />
                    {course.rating}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-foreground">
                  ₹{course.revenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Dashboard */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Revenue Dashboard
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-lg font-bold text-[oklch(var(--role-farmer))] font-display">
              ₹18,500
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Month</p>
            <p className="text-lg font-bold text-foreground font-display">
              ₹14,200
            </p>
          </div>
        </div>
        {/* Trend chart placeholder */}
        <div className="h-16 bg-muted/30 rounded-lg flex items-end gap-1 px-2 pb-2">
          {[35, 55, 45, 70, 60, 85, 100].map((h) => (
            <div
              key={h}
              className="flex-1 rounded-t bg-primary/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1">
          Last 7 days trend
        </p>
      </div>

      {/* Student Activity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground">
            Recent Enrollments
          </h3>
          <span className="text-xs text-muted-foreground">
            5 pending questions
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {RECENT_ENROLLMENTS.map((enr, idx) => (
            <div
              key={`${enr.name}-${enr.time}`}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              data-ocid={`learn.recent_enrollment.item.${idx + 1}`}
            >
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-semibold text-foreground">
                {enr.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">
                  {enr.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {enr.course}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {enr.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EducatorPlatform() {
  const { role } = useRoleContext();
  const { data: educators = [], isLoading } = useGetEducators();
  const [followedIds, setFollowedIds] = useState<bigint[]>([]);

  const educatorList = Array.isArray(educators) ? educators : [];

  function handleFollow(id: bigint, name: string) {
    setFollowedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    const isNowFollowing = !followedIds.includes(id);
    if (isNowFollowing) toast.success(`Following ${name}!`);
  }

  return (
    <div
      className="flex flex-col gap-5 px-4 pt-2 pb-6"
      data-ocid="learn.educators.section"
    >
      {/* Educator Dashboard for educator role */}
      {role === "educator" && (
        <section>
          <h2 className="font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[oklch(var(--role-educator))]" />
            My Educator Dashboard
          </h2>
          <EducatorDashboardPanel />
          <div className="border-t border-border my-5" />
        </section>
      )}

      {/* Educator Directory */}
      <section>
        <h2 className="font-semibold text-base text-foreground mb-3">
          Expert Educators
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {educatorList.map((edu: Educator, i: number) => (
              <EducatorCard
                key={edu.id.toString()}
                educator={edu}
                index={i + 1}
                isFollowed={followedIds.includes(edu.id)}
                onFollow={() => handleFollow(edu.id, edu.name)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
