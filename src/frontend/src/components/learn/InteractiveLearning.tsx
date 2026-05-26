import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  MessageCircle,
  Star,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VIRTUAL_CLASSES = [
  {
    id: 1,
    title: "Advanced Drip Irrigation Planning",
    instructor: "Dr. Rajesh Kumar",
    date: "Tomorrow, 10:00 AM",
    duration: "90 min",
    enrolled: 28,
    max: 40,
    category: "Irrigation",
  },
  {
    id: 2,
    title: "Organic Certification Process Workshop",
    instructor: "Priya Nair",
    date: "Fri, Apr 18 · 3:00 PM",
    duration: "60 min",
    enrolled: 15,
    max: 30,
    category: "Certification",
  },
  {
    id: 3,
    title: "Market Linkage Strategies for FPOs",
    instructor: "Suresh Patel",
    date: "Sat, Apr 19 · 11:00 AM",
    duration: "120 min",
    enrolled: 42,
    max: 50,
    category: "Business",
  },
];

const WORKSHOPS = [
  {
    id: 1,
    title: "Hands-on Soil Testing Lab",
    location: "Pune Agricultural Research Center",
    date: "Apr 22, 2026",
    fee: 0,
    registered: true,
    seats: "8 seats left",
  },
  {
    id: 2,
    title: "Drone Technology for Precision Farming",
    location: "Nashik Innovation Hub",
    date: "Apr 28, 2026",
    fee: 500,
    registered: false,
    seats: "12 seats left",
  },
];

const MENTORS = [
  {
    id: 1,
    name: "Dr. Ananya Krishnan",
    specialty: "Organic Farming & Soil Science",
    rating: 4.9,
    sessions: 124,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    available: true,
  },
  {
    id: 2,
    name: "Vikram Singh Rawat",
    specialty: "Agricultural Finance & FPO Management",
    rating: 4.7,
    sessions: 89,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    available: true,
  },
  {
    id: 3,
    name: "Kavitha Menon",
    specialty: "Horticulture & Export Compliance",
    rating: 4.8,
    sessions: 203,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavitha",
    available: false,
  },
];

const PEER_GROUPS = [
  {
    id: 1,
    name: "Young Farmers Network",
    topic: "Sustainable agriculture practices",
    members: 156,
    joined: false,
  },
  {
    id: 2,
    name: "Organic Growers Circle",
    topic: "Certification and premium markets",
    members: 89,
    joined: true,
  },
  {
    id: 3,
    name: "Tech-Savvy Farmers",
    topic: "Drones, sensors & smart irrigation",
    members: 234,
    joined: false,
  },
  {
    id: 4,
    name: "Women in Agriculture",
    topic: "Empowerment, finance & leadership",
    members: 312,
    joined: false,
  },
];

export function InteractiveLearning() {
  const [joinedGroups, setJoinedGroups] = useState<number[]>(
    PEER_GROUPS.filter((g) => g.joined).map((g) => g.id),
  );
  const [registeredWorkshops, setRegisteredWorkshops] = useState<number[]>(
    WORKSHOPS.filter((w) => w.registered).map((w) => w.id),
  );

  function handleJoinClass(title: string) {
    toast.info("Virtual classroom opening soon", {
      description: `"${title}" will be available 10 minutes before start time.`,
      duration: 4000,
    });
  }

  function handleRequestMentor(name: string) {
    toast.success(`Mentor request sent to ${name}!`, {
      description: "You'll receive a response within 24 hours.",
      duration: 4000,
    });
  }

  function handleJoinGroup(id: number) {
    setJoinedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    const group = PEER_GROUPS.find((g) => g.id === id);
    if (group) toast.success(`Joined ${group.name}!`);
  }

  function handleWorkshopRegister(id: number, title: string) {
    setRegisteredWorkshops((prev) => [...prev, id]);
    toast.success(`Registered for "${title}"!`, {
      description: "Check your profile for workshop details.",
    });
  }

  return (
    <div
      className="flex flex-col gap-6 px-4 pt-2 pb-6"
      data-ocid="learn.interactive.section"
    >
      {/* Virtual Classrooms */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Video className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-base text-foreground">
            Virtual Classrooms
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {VIRTUAL_CLASSES.map((cls, i) => (
            <div
              key={cls.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.virtual_class.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {cls.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cls.instructor}
                  </p>
                </div>
                <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {cls.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {cls.date}
                </span>
                <span>{cls.duration}</span>
                <span className="flex items-center gap-1 ml-auto">
                  <Users className="h-3 w-3" />
                  {cls.enrolled}/{cls.max}
                </span>
              </div>
              {/* Progress bar for seats */}
              <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(cls.enrolled / cls.max) * 100}%` }}
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => handleJoinClass(cls.title)}
                data-ocid={`learn.virtual_class.join_button.${i + 1}`}
              >
                Join Class
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Sessions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-[oklch(var(--accent))]" />
          <h2 className="font-semibold text-base text-foreground">
            Workshop Sessions
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {WORKSHOPS.map((ws, i) => (
            <div
              key={ws.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.workshop.item.${i + 1}`}
            >
              <p className="text-sm font-semibold text-foreground">
                {ws.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ws.location}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>
                  <Calendar className="h-3 w-3 inline mr-0.5" />
                  {ws.date}
                </span>
                <span className="ml-auto font-semibold text-foreground">
                  {ws.fee === 0 ? (
                    <span className="text-[oklch(var(--role-farmer))]">
                      FREE
                    </span>
                  ) : (
                    `₹${ws.fee}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {ws.seats}
                </span>
                {registeredWorkshops.includes(ws.id) ? (
                  <span className="text-xs font-semibold text-[oklch(var(--role-farmer))] flex items-center gap-1">
                    ✓ Registered
                  </span>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-3"
                    onClick={() => handleWorkshopRegister(ws.id, ws.title)}
                    data-ocid={`learn.workshop.register_button.${i + 1}`}
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor Matching */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-[oklch(var(--accent))]" />
          <h2 className="font-semibold text-base text-foreground">
            Mentor Matching
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {MENTORS.map((mentor, i) => (
            <div
              key={mentor.id}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              data-ocid={`learn.mentor.item.${i + 1}`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="h-11 w-11 rounded-full object-cover bg-muted"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${mentor.available ? "bg-[oklch(var(--role-farmer))]" : "bg-muted-foreground"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {mentor.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {mentor.specialty}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-[oklch(var(--accent))] text-[oklch(var(--accent))]" />
                    {mentor.rating}
                  </span>
                  <span>{mentor.sessions} sessions</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant={mentor.available ? "default" : "outline"}
                className="flex-shrink-0 h-8 px-2.5 text-xs"
                disabled={!mentor.available}
                onClick={() => handleRequestMentor(mentor.name)}
                data-ocid={`learn.mentor.request_button.${i + 1}`}
              >
                {mentor.available ? "Request" : "Busy"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Q&A Forums */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-4 w-4 text-[oklch(var(--role-service))]" />
          <h2 className="font-semibold text-base text-foreground">
            Q&A Forums
          </h2>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Community Q&A Feed
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ask questions, share knowledge
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            data-ocid="learn.interactive.qa_link"
          >
            Browse
          </Button>
        </div>
      </section>

      {/* Peer Learning Groups */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-[oklch(var(--role-buyer))]" />
          <h2 className="font-semibold text-base text-foreground">
            Peer Learning Groups
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {PEER_GROUPS.map((grp, i) => (
            <div
              key={grp.id}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              data-ocid={`learn.peer_group.item.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {grp.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {grp.topic}
                </p>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <Users className="h-3 w-3" />
                  {grp.members.toLocaleString()} members
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant={joinedGroups.includes(grp.id) ? "outline" : "default"}
                className="flex-shrink-0 h-8 px-3 text-xs"
                onClick={() => handleJoinGroup(grp.id)}
                data-ocid={`learn.peer_group.join_button.${i + 1}`}
              >
                {joinedGroups.includes(grp.id) ? "Joined" : "Join"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
