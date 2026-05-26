import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pin, Users } from "lucide-react";
import type { Group } from "../../types";
import { GroupChat } from "./GroupChat";

const GROUP_EMOJIS = ["🌾", "🤝", "📍", "💰", "🔧"];
const GROUP_COLORS = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
  "from-success/20 to-success/5",
  "from-trust/20 to-trust/5",
  "from-warning/20 to-warning/5",
];

const PINNED_CONTENT = [
  "📢 Weekly market rate update posted every Friday",
  "🌦️ Weather advisory: Light rainfall expected this week in northern zones",
  "📋 FPO registration deadline: June 30 — apply via SFAC portal",
];

export function GroupView({
  group,
  onBack,
}: {
  group: Group;
  onBack: () => void;
}) {
  const groupIndex = Number(group.id - BigInt(1)) % GROUP_EMOJIS.length;
  const emoji = GROUP_EMOJIS[groupIndex];
  const colorClass = GROUP_COLORS[groupIndex];

  return (
    <div className="flex flex-col min-h-full">
      {/* Group header */}
      <div
        className={`bg-gradient-to-r ${colorClass} border-b border-border px-4 pt-4 pb-3`}
        data-ocid="group-header"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={onBack}
            aria-label="Back"
            data-ocid="back-button"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-card/60 backdrop-blur-sm flex items-center justify-center text-xl flex-shrink-0">
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-base">{group.name}</p>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {group.memberCount.toString()} members
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-success ml-1 inline-block" />
              <span className="text-[10px] text-success">Active</span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
            Join
          </Badge>
        </div>

        {/* Pinned content */}
        <div className="mt-3 bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Pin className="h-3 w-3 text-accent" />
            <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
              Pinned
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {PINNED_CONTENT.map((item) => (
              <p
                key={item}
                className="text-[11px] text-muted-foreground leading-relaxed"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <GroupChat group={group} />
    </div>
  );
}
