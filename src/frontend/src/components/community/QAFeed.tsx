import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useGetQA } from "../../lib/backend";
import type { Question } from "../../types";

const CATEGORY_COLORS: Record<string, string> = {
  "Pest Control": "bg-destructive/10 text-destructive border-destructive/20",
  "Soil Health":
    "bg-success/10 text-success border-[oklch(var(--success)/0.2)]",
  Seeds: "bg-primary/10 text-primary border-primary/20",
  Irrigation: "bg-trust/10 text-trust border-trust/20",
  "Market Prices": "bg-accent/10 text-accent-foreground border-accent/20",
  Weather: "bg-warning/10 text-warning border-warning/20",
};

const AUTHOR_NAMES = [
  "Rajesh Kumar",
  "Sunita Devi",
  "Amit Patel",
  "Meera Singh",
  "Harpreet K.",
  "Lakshmi R.",
];

const FALLBACK_QA: Question[] = [
  {
    id: BigInt(1),
    title: "Best spray for controlling aphids on wheat?",
    upvoteCount: BigInt(34),
    authorId: BigInt(1),
    createdAt: BigInt(Date.now() - 1000 * 60 * 30),
    description:
      "Noticed aphids attacking my wheat crop. What's the most effective and affordable spray available locally?",
    answerCount: BigInt(12),
    category: "Pest Control",
  },
  {
    id: BigInt(2),
    title: "How to improve soil organic matter quickly?",
    upvoteCount: BigInt(21),
    authorId: BigInt(2),
    createdAt: BigInt(Date.now() - 86400000),
    description:
      "My soil pH is low and organic content is poor. Looking for quick improvement methods before the kharif season.",
    answerCount: BigInt(8),
    category: "Soil Health",
  },
  {
    id: BigInt(3),
    title: "Which tomato variety gives highest yield in Punjab?",
    upvoteCount: BigInt(45),
    authorId: BigInt(3),
    createdAt: BigInt(Date.now() - 172800000),
    description:
      "Planning to grow tomatoes this season. Which hybrid variety should I pick for Punjab climate and heat tolerance?",
    answerCount: BigInt(19),
    category: "Seeds",
  },
  {
    id: BigInt(4),
    title: "Drip vs flood irrigation for rice paddies?",
    upvoteCount: BigInt(18),
    authorId: BigInt(4),
    createdAt: BigInt(Date.now() - 259200000),
    description:
      "Want to switch from flood to drip irrigation to save water. Any experience with yields post switch?",
    answerCount: BigInt(6),
    category: "Irrigation",
  },
  {
    id: BigInt(5),
    title: "What's the MSP for wheat this year?",
    upvoteCount: BigInt(67),
    authorId: BigInt(5),
    createdAt: BigInt(Date.now() - 345600000),
    description:
      "Looking for official MSP rate and how to register for government procurement centres in Haryana.",
    answerCount: BigInt(22),
    category: "Market Prices",
  },
  {
    id: BigInt(6),
    title: "When to apply second dose of urea in sugarcane?",
    upvoteCount: BigInt(29),
    authorId: BigInt(6),
    createdAt: BigInt(Date.now() - 432000000),
    description:
      "My sugarcane is 3 months old. The leaves are turning yellowish. Is it time for the second urea dose?",
    answerCount: BigInt(9),
    category: "Soil Health",
  },
];

function relativeTime(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function QuestionCard({
  q,
  onClick,
}: {
  q: Question;
  onClick: (q: Question) => void;
}) {
  const authorName =
    AUTHOR_NAMES[(Number(q.authorId) - 1) % AUTHOR_NAMES.length];
  const colorClass =
    CATEGORY_COLORS[q.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <button
      type="button"
      className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-2.5 text-left w-full hover:border-primary/40 transition-smooth active:scale-[0.99]"
      onClick={() => onClick(q)}
      data-ocid="question-card"
    >
      {/* Author + time */}
      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
            {authorName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-foreground flex-1 truncate">
          {authorName}
        </span>
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          {relativeTime(q.createdAt)}
        </span>
      </div>

      {/* Category + title */}
      <div className="flex flex-col gap-1">
        <Badge
          variant="outline"
          className={`text-[9px] px-1.5 py-0 w-fit font-medium ${colorClass}`}
        >
          {q.category}
        </Badge>
        <p className="font-semibold text-sm leading-snug">{q.title}</p>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {q.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-0.5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <ThumbsUp className="h-3.5 w-3.5" />
          {q.upvoteCount.toString()}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          {q.answerCount.toString()} answers
        </span>
      </div>
    </button>
  );
}

export function QAFeed({
  search,
  onSelectQuestion,
}: {
  search: string;
  onSelectQuestion: (q: Question) => void;
}) {
  const { data: questions, isLoading } = useGetQA();

  const displayQA = (questions?.length ? questions : FALLBACK_QA).filter(
    (q) => !search || q.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {["q1", "q2", "q3"].map((k) => (
          <Skeleton key={k} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (displayQA.length === 0) {
    return (
      <div
        className="flex flex-col items-center py-16 gap-3"
        data-ocid="qa-empty"
      >
        <MessageCircle className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">No questions found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-ocid="qa-list">
      {displayQA.map((q) => (
        <QuestionCard key={q.id.toString()} q={q} onClick={onSelectQuestion} />
      ))}
    </div>
  );
}
