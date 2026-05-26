import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, DollarSign, Star, Users, Video } from "lucide-react";
import { StreamStatus } from "../../backend";
import { useGetCourses, useGetLiveStreams } from "../../lib/backend";

const RECENT_ACTIVITY = [
  { type: "enrollment", text: "5 new students enrolled", time: "2h ago" },
  {
    type: "question",
    text: "3 new questions in Irrigation Basics",
    time: "4h ago",
  },
  { type: "review", text: "New 5-star review received", time: "1d ago" },
];

export function EducatorDashboard() {
  const navigate = useNavigate();
  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const { data: streams, isLoading: streamsLoading } = useGetLiveStreams();

  const courseList = Array.isArray(courses) ? courses : [];
  const streamList = Array.isArray(streams) ? streams : [];

  const myCourses = courseList.slice(0, 3);
  const nextStream = streamList.find(
    (s) => s.status === StreamStatus.Scheduled,
  );

  return (
    <div className="flex flex-col gap-3 p-4" data-ocid="educator-dashboard">
      {/* Teaching Analytics */}
      <div className="bg-card border border-border rounded-2xl p-4 card-educator">
        <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-[oklch(var(--role-educator))]" />
          Teaching Analytics
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display font-bold text-xl leading-none text-[oklch(var(--role-educator))]">
              1,250
            </span>
            <span className="text-[10px] text-muted-foreground text-center">
              Total Students
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display font-bold text-xl leading-none text-success">
              ₹18,500
            </span>
            <span className="text-[10px] text-muted-foreground text-center">
              Revenue
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-0.5">
              <span className="font-display font-bold text-xl leading-none text-accent">
                4.9
              </span>
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            </div>
            <span className="text-[10px] text-muted-foreground text-center">
              Avg Rating
            </span>
          </div>
        </div>
      </div>

      {/* Active Courses */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[oklch(var(--role-educator))]" />
            Active Courses
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-accent"
            onClick={() => navigate({ to: "/learn" })}
            data-ocid="educator-see-all-courses"
          >
            Manage
          </Button>
        </div>
        {coursesLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {myCourses.map((course, idx) => {
              const enrollCount = Number(course.enrollmentCount);
              const fillW = Math.min(100, (enrollCount / 50) * 100);
              const isFree = course.price === 0;
              return (
                <div
                  key={course.id.toString()}
                  className="bg-card border border-border rounded-xl p-3"
                  data-ocid={`educator-course-item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-semibold line-clamp-1 flex-1">
                      {course.title}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1.5 flex-shrink-0"
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {enrollCount} enrolled
                    </span>
                    <DollarSign className="h-3 w-3 text-success ml-auto" />
                    <span className="text-[11px] text-success font-medium">
                      {isFree ? "Free" : `₹${course.price}`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-[oklch(var(--role-educator))] rounded-full transition-smooth"
                      style={{ width: `${fillW}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-muted/40 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Bell className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold">Recent Activity</span>
        </div>
        <div className="flex flex-col gap-2">
          {RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.text}
              className="flex items-start justify-between gap-2"
            >
              <p className="text-[11px] text-foreground flex-1">
                {activity.text}
              </p>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Session */}
      {streamsLoading ? (
        <Skeleton className="h-16 rounded-2xl" />
      ) : nextStream ? (
        <div
          className="bg-[oklch(var(--role-educator)/0.08)] border border-[oklch(var(--role-educator)/0.25)] rounded-2xl p-3 flex items-center gap-3"
          data-ocid="educator-upcoming-session"
        >
          <div className="w-9 h-9 rounded-xl bg-[oklch(var(--role-educator)/0.15)] flex items-center justify-center flex-shrink-0">
            <Video className="h-5 w-5 text-[oklch(var(--role-educator))]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{nextStream.title}</p>
            <p className="text-[11px] text-muted-foreground">Scheduled soon</p>
          </div>
          <Badge className="badge-live text-[9px] h-5">Upcoming</Badge>
        </div>
      ) : (
        <button
          type="button"
          className="bg-[oklch(var(--role-educator)/0.08)] border border-[oklch(var(--role-educator)/0.25)] rounded-2xl p-3 flex items-center gap-3 w-full text-left hover:bg-[oklch(var(--role-educator)/0.12)] transition-smooth"
          onClick={() => navigate({ to: "/create" })}
          data-ocid="educator-start-session-cta"
        >
          <div className="w-9 h-9 rounded-xl bg-[oklch(var(--role-educator)/0.15)] flex items-center justify-center flex-shrink-0">
            <Video className="h-5 w-5 text-[oklch(var(--role-educator))]" />
          </div>
          <div>
            <p className="text-sm font-semibold">Schedule a Session</p>
            <p className="text-[11px] text-muted-foreground">
              Start a live class or workshop
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
