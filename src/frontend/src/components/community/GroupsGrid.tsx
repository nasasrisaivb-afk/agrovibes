import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useGetGroups } from "../../lib/backend";
import type { Group } from "../../types";

const GROUP_COLORS = [
  "from-primary/30 to-primary/10",
  "from-accent/30 to-accent/10",
  "from-success/30 to-success/10",
  "from-trust/30 to-trust/10",
  "from-warning/30 to-warning/10",
];

const GROUP_EMOJIS = ["🌾", "🤝", "📍", "💰", "🔧"];

const FALLBACK_GROUPS: Group[] = [
  {
    id: BigInt(1),
    name: "General",
    memberCount: BigInt(3240),
    description: "General discussion for all farmers across India",
    iconUrl: "",
  },
  {
    id: BigInt(2),
    name: "FPOs",
    memberCount: BigInt(1850),
    description: "Farmer Producer Organisations collaboration and networking",
    iconUrl: "",
  },
  {
    id: BigInt(3),
    name: "Regional Support",
    memberCount: BigInt(920),
    description: "State-wise support groups for regional farmers",
    iconUrl: "",
  },
  {
    id: BigInt(4),
    name: "Market Tips",
    memberCount: BigInt(2100),
    description: "Pricing, MSP updates, and mandi rate discussions",
    iconUrl: "",
  },
  {
    id: BigInt(5),
    name: "Equipment Exchange",
    memberCount: BigInt(760),
    description: "Buy, sell, and rent agricultural equipment",
    iconUrl: "",
  },
];

function GroupCard({
  group,
  index,
  onSelect,
}: {
  group: Group;
  index: number;
  onSelect: (g: Group) => void;
}) {
  const colorClass = GROUP_COLORS[index % GROUP_COLORS.length];
  const emoji = GROUP_EMOJIS[index % GROUP_EMOJIS.length];

  return (
    <button
      type="button"
      className="flex gap-3 bg-card rounded-2xl border border-border p-3.5 items-center text-left w-full hover:border-primary/40 active:scale-[0.99] transition-smooth"
      onClick={() => onSelect(group)}
      data-ocid="group-card"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 text-2xl`}
      >
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{group.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {group.description}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            {group.memberCount.toString()} members
          </span>
        </div>
      </div>

      <Badge className="bg-primary/10 text-primary border-0 text-[10px] flex-shrink-0">
        Join
      </Badge>
    </button>
  );
}

export function GroupsGrid({
  onSelectGroup,
}: {
  onSelectGroup: (g: Group) => void;
}) {
  const { data: groups, isLoading } = useGetGroups();
  const displayGroups = groups?.length ? groups : FALLBACK_GROUPS;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {["g1", "g2", "g3"].map((k) => (
          <Skeleton key={k} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-ocid="groups-list">
      {displayGroups.map((g, i) => (
        <GroupCard
          key={g.id.toString()}
          group={g}
          index={i}
          onSelect={onSelectGroup}
        />
      ))}
    </div>
  );
}
