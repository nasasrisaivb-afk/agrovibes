import { Button } from "@/components/ui/button";
import {
  Calendar,
  Lightbulb,
  MapPin,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FORUM_THREADS = [
  {
    id: 1,
    topic: "Best time to sow wheat in Maharashtra this season?",
    replies: 23,
    lastActive: "1h ago",
    category: "Crops",
  },
  {
    id: 2,
    topic: "Which micronutrient deficiency causes yellowing in rice?",
    replies: 45,
    lastActive: "3h ago",
    category: "Plant Health",
  },
  {
    id: 3,
    topic: "PM-KISAN application rejected — what to do?",
    replies: 12,
    lastActive: "5h ago",
    category: "Schemes",
  },
  {
    id: 4,
    topic: "Comparing Mahindra 475 vs Sonalika 50 HP for small holdings",
    replies: 67,
    lastActive: "1d ago",
    category: "Equipment",
  },
  {
    id: 5,
    topic: "How to get organic certification for less than ₹5,000?",
    replies: 31,
    lastActive: "2d ago",
    category: "Certification",
  },
];

const PROBLEM_GROUPS = [
  {
    id: 1,
    problem: "Post-harvest loss reduction for perishables",
    members: 89,
    active: true,
  },
  {
    id: 2,
    problem: "Water scarcity solutions for Deccan Plateau farmers",
    members: 134,
    active: true,
  },
  {
    id: 3,
    problem: "Getting fair prices without middlemen in Tier-3 districts",
    members: 212,
    active: true,
  },
  {
    id: 4,
    problem: "Affordable cold storage solutions for small farmers",
    members: 67,
    active: false,
  },
];

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Laxmi Bai Yadav",
    district: "Jhansi, UP",
    crop: "Wheat & Mustard",
    metric: "Income tripled in 2 years",
    story:
      "Switched to direct market selling via AgriMarket. Now supplies 3 retail chains directly.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=laxmi",
  },
  {
    id: 2,
    name: "Bashir Ahmed",
    district: "Malda, West Bengal",
    crop: "Mango",
    metric: "Exported to 4 countries",
    story:
      "Completed export compliance certification and connected with an export aggregator through Learn community.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bashir",
  },
  {
    id: 3,
    name: "Sunita Kumari",
    district: "Vaishali, Bihar",
    crop: "Vegetables",
    metric: "₹80K+ savings annually",
    story:
      "Formed a 15-member SHG, purchased inputs in bulk and rented irrigation equipment collectively.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunita",
  },
];

const CHALLENGES = [
  {
    id: 1,
    title: "Smart Irrigation Innovation Challenge",
    prize: "₹50,000 + mentorship",
    deadline: "May 15, 2026",
    participants: 342,
    description:
      "Propose a low-cost smart irrigation solution for marginal farmers under 2 acres.",
  },
  {
    id: 2,
    title: "Agri-Fintech Startup Hackathon",
    prize: "₹2,00,000 + incubation",
    deadline: "Jun 1, 2026",
    participants: 89,
    description:
      "Build a financial product that improves credit access for tenant farmers.",
  },
];

const MEETUPS = [
  {
    id: 1,
    title: "Kisan Mela & Knowledge Exchange",
    location: "Aurangabad Agricultural College",
    date: "Apr 26, 2026",
    time: "9:00 AM",
    attendees: 120,
    rsvped: false,
  },
  {
    id: 2,
    title: "FPO Formation Workshop — District Level",
    location: "Collectorate Hall, Nashik",
    date: "May 5, 2026",
    time: "11:00 AM",
    attendees: 55,
    rsvped: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Crops: "bg-[oklch(var(--role-farmer)/0.15)] text-[oklch(var(--role-farmer))]",
  "Plant Health":
    "bg-[oklch(var(--role-educator)/0.15)] text-[oklch(var(--role-educator))]",
  Schemes: "bg-[oklch(var(--trust)/0.12)] text-[oklch(var(--trust))]",
  Equipment:
    "bg-[oklch(var(--role-machinery)/0.15)] text-[oklch(var(--role-machinery))]",
  Certification: "bg-[oklch(var(--accent)/0.15)] text-[oklch(var(--accent))]",
};

export function CommunityLearning() {
  const [rsvpedMeetups, setRsvpedMeetups] = useState<number[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [participating, setParticipating] = useState<number[]>([]);

  function handleRsvp(id: number, title: string) {
    setRsvpedMeetups((prev) => [...prev, id]);
    toast.success(`RSVP confirmed for "${title}"!`, {
      description: "You'll receive a reminder 1 day before.",
      duration: 4000,
    });
  }

  function handleJoinGroup(id: number) {
    setJoinedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (!joinedGroups.includes(id))
      toast.success("Joined problem-solving group!");
  }

  function handleParticipate(id: number, title: string) {
    setParticipating((prev) => [...prev, id]);
    toast.success(`Participating in "${title}"!`, {
      description: "Check the challenge details in your profile.",
      duration: 4000,
    });
  }

  return (
    <div
      className="flex flex-col gap-6 px-4 pt-2 pb-6"
      data-ocid="learn.community.section"
    >
      {/* Discussion Forums */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-base text-foreground">
            Discussion Forums
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {FORUM_THREADS.map((thread, i) => (
            <div
              key={thread.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.forum.item.${i + 1}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {thread.topic}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[thread.category] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {thread.category}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="h-2.5 w-2.5" />
                      {thread.replies} replies
                    </span>
                    <span className="ml-auto">{thread.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem-Solving Groups */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-[oklch(var(--accent))]" />
          <h2 className="font-semibold text-base text-foreground">
            Problem-Solving Groups
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {PROBLEM_GROUPS.map((grp, i) => (
            <div
              key={grp.id}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              data-ocid={`learn.problem_group.item.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {grp.problem}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-2.5 w-2.5" />
                    {grp.members} members
                  </span>
                  {grp.active && (
                    <span className="flex items-center gap-1 text-[oklch(var(--role-farmer))]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(var(--role-farmer))] animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant={joinedGroups.includes(grp.id) ? "outline" : "default"}
                className="flex-shrink-0 h-7 px-2.5 text-xs"
                onClick={() => handleJoinGroup(grp.id)}
                data-ocid={`learn.problem_group.join_button.${i + 1}`}
              >
                {joinedGroups.includes(grp.id) ? "Joined" : "Join"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-[oklch(var(--accent))]" />
          <h2 className="font-semibold text-base text-foreground">
            Success Stories
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {SUCCESS_STORIES.map((story, i) => (
            <div
              key={story.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.success_story.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={story.avatarUrl}
                  alt={story.name}
                  className="h-11 w-11 rounded-full object-cover bg-muted flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {story.name}
                    </p>
                    <span className="text-xs font-bold text-[oklch(var(--role-farmer))] flex-shrink-0">
                      {story.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {story.district} · {story.crop}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Innovation Challenges */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-[oklch(var(--role-educator))]" />
          <h2 className="font-semibold text-base text-foreground">
            Innovation Challenges
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {CHALLENGES.map((challenge, i) => (
            <div
              key={challenge.id}
              className="bg-gradient-to-br from-[oklch(var(--accent)/0.08)] to-[oklch(var(--role-educator)/0.05)] border border-[oklch(var(--accent)/0.2)] rounded-xl p-3"
              data-ocid={`learn.challenge.item.${i + 1}`}
            >
              <p className="text-sm font-semibold text-foreground">
                {challenge.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {challenge.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="font-semibold text-[oklch(var(--accent))]">
                  {challenge.prize}
                </span>
                <span className="flex items-center gap-0.5 ml-auto">
                  <Calendar className="h-3 w-3" />
                  Deadline: {challenge.deadline}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-muted-foreground">
                  {challenge.participants} participants
                </span>
                {participating.includes(challenge.id) ? (
                  <span className="text-xs font-semibold text-[oklch(var(--role-farmer))]">
                    ✓ Participating
                  </span>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() =>
                      handleParticipate(challenge.id, challenge.title)
                    }
                    data-ocid={`learn.challenge.participate_button.${i + 1}`}
                  >
                    Participate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Meetups */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[oklch(var(--role-service))]" />
          <h2 className="font-semibold text-base text-foreground">
            Local Meetups
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {MEETUPS.map((meetup, i) => (
            <div
              key={meetup.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.meetup.item.${i + 1}`}
            >
              <p className="text-sm font-semibold text-foreground">
                {meetup.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{meetup.location}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {meetup.date} · {meetup.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {meetup.attendees} attending
                </span>
              </div>
              <div className="mt-3">
                {rsvpedMeetups.includes(meetup.id) ? (
                  <div className="h-8 flex items-center justify-center text-xs font-semibold text-[oklch(var(--role-farmer))]">
                    ✓ RSVP Confirmed
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs"
                    onClick={() => handleRsvp(meetup.id, meetup.title)}
                    data-ocid={`learn.meetup.rsvp_button.${i + 1}`}
                  >
                    RSVP
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
