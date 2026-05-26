import { Button } from "@/components/ui/button";
import {
  Award,
  Briefcase,
  CheckCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const MY_PROGRESS = [
  {
    id: 1n,
    title: "Organic Farming Certification Course",
    instructor: "Dr. Ananya Krishnan",
    progressPercent: 65,
    lessonsCompleted: 8,
    totalLessons: 12,
    category: "Certifications",
  },
  {
    id: 2n,
    title: "Modern Irrigation Systems & Water Management",
    instructor: "Vikram Singh",
    progressPercent: 30,
    lessonsCompleted: 3,
    totalLessons: 10,
    category: "Advanced",
  },
];

const EARNED_BADGES = [
  {
    id: 1,
    name: "Soil Science Pro",
    icon: "🌱",
    earned: true,
    earnedOn: "March 2026",
  },
  {
    id: 2,
    name: "Irrigation Expert",
    icon: "💧",
    earned: true,
    earnedOn: "January 2026",
  },
  {
    id: 3,
    name: "Digital Farmer",
    icon: "📱",
    earned: true,
    earnedOn: "December 2025",
  },
  {
    id: 4,
    name: "Organic Certified",
    icon: "🏆",
    earned: false,
    requirement: "Complete Organic Course",
  },
  {
    id: 5,
    name: "Market Master",
    icon: "📈",
    earned: false,
    requirement: "Complete Business Course",
  },
  {
    id: 6,
    name: "Community Leader",
    icon: "👥",
    earned: false,
    requirement: "Help 50 farmers",
  },
];

const CERT_PROGRAMS = [
  {
    id: 1,
    name: "Certified Organic Farmer",
    issuer: "APEDA India",
    duration: "3 months",
    cost: 2500,
    requirements: "Complete 5 courses + field assessment",
    enrolled: 3247,
    level: "Intermediate",
  },
  {
    id: 2,
    name: "Precision Agriculture Specialist",
    issuer: "IARI New Delhi",
    duration: "4 months",
    cost: 3800,
    requirements: "Complete 7 courses + online exam",
    enrolled: 1890,
    level: "Advanced",
  },
  {
    id: 3,
    name: "Agricultural Entrepreneur",
    issuer: "NABARD",
    duration: "6 weeks",
    cost: 0,
    requirements: "Complete FPO Management + Finance courses",
    enrolled: 5600,
    level: "Beginner",
  },
  {
    id: 4,
    name: "Farm Safety & Compliance",
    issuer: "Ministry of Agriculture",
    duration: "2 weeks",
    cost: 0,
    requirements: "Complete safety module + quiz",
    enrolled: 8900,
    level: "Beginner",
  },
  {
    id: 5,
    name: "Export Quality Compliance",
    issuer: "APEDA India",
    duration: "8 weeks",
    cost: 5000,
    requirements: "Complete 6 courses + practical assessment",
    enrolled: 892,
    level: "Advanced",
  },
];

const LEVEL_STYLES: Record<string, string> = {
  Beginner:
    "bg-[oklch(var(--role-farmer)/0.15)] text-[oklch(var(--role-farmer))]",
  Intermediate: "bg-[oklch(var(--accent)/0.15)] text-[oklch(var(--accent))]",
  Advanced:
    "bg-[oklch(var(--destructive)/0.12)] text-[oklch(var(--destructive))]",
};

export function SkillCertification() {
  function handleAssessment(title: string) {
    toast.info(`Assessment for "${title}"`, {
      description:
        "Assessment module launching soon. Complete all lessons first.",
      duration: 4000,
    });
  }

  function handleEnrollProgram(name: string) {
    toast.success(`Enrolled in ${name}!`, {
      description: "Demo mode — check your progress tracker.",
      duration: 4000,
    });
  }

  return (
    <div
      className="flex flex-col gap-6 px-4 pt-2 pb-6"
      data-ocid="learn.certification.section"
    >
      {/* My Progress */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-base text-foreground">
            My Progress
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {MY_PROGRESS.map((prog, i) => (
            <div
              key={prog.id.toString()}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.progress.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">
                    {prog.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {prog.instructor}
                  </p>
                </div>
                <span className="flex-shrink-0 text-sm font-bold text-primary">
                  {prog.progressPercent}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${prog.progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  {prog.lessonsCompleted}/{prog.totalLessons} lessons
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs"
                  data-ocid={`learn.progress.continue_button.${i + 1}`}
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badge Showcase */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-[oklch(var(--accent))]" />
          <h2 className="font-semibold text-base text-foreground">
            Badge Showcase
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {EARNED_BADGES.map((badge, i) => (
            <div
              key={badge.id}
              className={`rounded-xl p-3 text-center flex flex-col items-center gap-1.5 border ${
                badge.earned
                  ? "bg-gradient-to-b from-[oklch(var(--accent)/0.15)] to-[oklch(var(--accent)/0.05)] border-[oklch(var(--accent)/0.3)]"
                  : "bg-muted/30 border-border opacity-50"
              }`}
              data-ocid={`learn.badge.item.${i + 1}`}
            >
              <span
                className={`text-2xl ${badge.earned ? "drop-shadow-sm" : "grayscale"}`}
              >
                {badge.icon}
              </span>
              <p className="text-[10px] font-semibold text-foreground leading-tight text-center">
                {badge.name}
              </p>
              {badge.earned ? (
                <p className="text-[9px] text-muted-foreground">
                  {badge.earnedOn}
                </p>
              ) : (
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {badge.requirement}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certification Programs */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-[oklch(var(--role-educator))]" />
          <h2 className="font-semibold text-base text-foreground">
            Certification Programs
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {CERT_PROGRAMS.map((prog, i) => (
            <div
              key={prog.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.cert_program.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-sm font-semibold text-foreground flex-1">
                  {prog.name}
                </p>
                <span
                  className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${LEVEL_STYLES[prog.level] ?? ""}`}
                >
                  {prog.level}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                By {prog.issuer}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {prog.requirements}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>⏱ {prog.duration}</span>
                <span>{prog.enrolled.toLocaleString()} enrolled</span>
                <span className="ml-auto font-semibold text-foreground">
                  {prog.cost === 0 ? (
                    <span className="text-[oklch(var(--role-farmer))]">
                      FREE
                    </span>
                  ) : (
                    `₹${prog.cost}`
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleAssessment(prog.name)}
                  data-ocid={`learn.cert_program.assessment_button.${i + 1}`}
                >
                  Take Assessment
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleEnrollProgram(prog.name)}
                  data-ocid={`learn.cert_program.enroll_button.${i + 1}`}
                >
                  Enroll
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Employment Matching */}
      <section data-ocid="learn.employment.section">
        <div className="bg-gradient-to-br from-[oklch(var(--trust)/0.1)] to-[oklch(var(--role-educator)/0.08)] border border-[oklch(var(--trust)/0.2)] rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[oklch(var(--trust)/0.15)] flex items-center justify-center flex-shrink-0">
            <Briefcase className="h-5 w-5 text-[oklch(var(--trust))]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Connect with Employers
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Match your skills with agri-sector opportunities
            </p>
          </div>
          <div className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">
            Coming Soon
          </div>
        </div>
      </section>
    </div>
  );
}
