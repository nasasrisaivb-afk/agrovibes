import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAddGroupMessage, useGetAnswers } from "../../lib/backend";
import type { Answer, Question } from "../../types";

type LocalSR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: { results: SpeechRecognitionResultList }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

const AUTHOR_NAMES = [
  "Rajesh Kumar",
  "Sunita Devi",
  "Amit Patel",
  "Meera Singh",
  "Harpreet K.",
  "Lakshmi R.",
  "Vijay Sharma",
  "Priya Nair",
];

// Fallback answers use only real Answer fields from backend.d.ts
// (content stored in a local display map, as backend Answer has no 'body' field)
const FALLBACK_ANSWER_BODIES: Record<string, string> = {
  "1": "Imidacloprid 17.8% SL works great at 0.5ml/L. Spray in early morning or late evening when bees aren't active. Two sprays 10 days apart should control the infestation.",
  "2": "Also try neem oil spray (5ml/L) as an organic alternative. It's cheaper and doesn't harm beneficial insects. Works slower but safer for soil health.",
  "3": "Make sure to rotate chemicals — aphids develop resistance quickly. Alternate between systemic and contact insecticides across seasons.",
};

const FALLBACK_ACCEPTED_IDS = new Set(["1"]);

const FALLBACK_ANSWERS: Answer[] = [
  {
    id: BigInt(1),
    questionId: BigInt(1),
    authorId: BigInt(2),
    content: FALLBACK_ANSWER_BODIES["1"] ?? "",
    upvoteCount: BigInt(18),
  },
  {
    id: BigInt(2),
    questionId: BigInt(1),
    authorId: BigInt(3),
    content: FALLBACK_ANSWER_BODIES["2"] ?? "",
    upvoteCount: BigInt(12),
  },
  {
    id: BigInt(3),
    questionId: BigInt(1),
    authorId: BigInt(4),
    content: FALLBACK_ANSWER_BODIES["3"] ?? "",
    upvoteCount: BigInt(7),
  },
];

function AnswerCard({ answer }: { answer: Answer }) {
  const authorName =
    AUTHOR_NAMES[(Number(answer.authorId) - 1) % AUTHOR_NAMES.length];
  const isAccepted = FALLBACK_ACCEPTED_IDS.has(answer.id.toString());
  return (
    <div
      className={`bg-card rounded-2xl border p-4 flex flex-col gap-2.5 ${isAccepted ? "border-[oklch(var(--success)/0.4)] bg-success/5" : "border-border"}`}
      data-ocid="answer-card"
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
            {authorName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium flex-1 truncate">
          {authorName}
        </span>
        {isAccepted && (
          <Badge className="bg-success/10 text-success border-0 text-[9px] gap-1 px-1.5">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Accepted
          </Badge>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">
        {answer.content}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          data-ocid="upvote-answer"
        >
          <ThumbsUp className="h-3 w-3" />
          {answer.upvoteCount.toString()}
        </button>
      </div>
    </div>
  );
}

export function QuestionDetail({
  question,
  onBack,
}: {
  question: Question;
  onBack: () => void;
}) {
  const [reply, setReply] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<LocalSR | null>(null);
  const { data: answersData, isLoading } = useGetAnswers(question.id);
  const addMessage = useAddGroupMessage();

  const answers = answersData?.length ? answersData : FALLBACK_ANSWERS;

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function toggleVoice() {
    const SR =
      window.SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => LocalSR })
        .webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR() as LocalSR;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      setReply((prev) => `${prev}${e.results[0][0].transcript} `);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }

  function handleSubmit() {
    if (!reply.trim()) return;
    addMessage.mutate(
      {
        groupId: BigInt(0),
        content: `[Answer to Q${String(question.id)}] ${reply}`,
        authorId: BigInt(0),
        isVoiceMessage: false,
      },
      {
        onSuccess: () => {
          setReply("");
          toast.success("Reply submitted!");
        },
        onError: () => {
          toast.error("Failed to submit. Please try again.");
        },
      },
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3 bg-background/95 backdrop-blur-sm border-b border-border">
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
        <p className="text-sm font-semibold truncate flex-1">Question Detail</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 pb-28">
        {/* Question */}
        <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-2.5">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 w-fit">
            {question.category}
          </Badge>
          <h2 className="font-display font-bold text-base leading-snug">
            {question.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.description}
          </p>
          <div className="flex items-center gap-4 pt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
              {question.upvoteCount.toString()} upvotes
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
              {question.answerCount.toString()} answers
            </span>
          </div>
        </div>

        {/* Answers */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {answers.length} Answers
          </p>
          {isLoading ? (
            <>
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </>
          ) : (
            answers.map((a) => <AnswerCard key={a.id.toString()} answer={a} />)
          )}
        </div>
      </div>

      {/* Reply Input */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-background border-t border-border flex gap-2 items-end">
        <button
          type="button"
          onClick={toggleVoice}
          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          aria-label={isListening ? "Stop recording" : "Voice reply"}
          data-ocid="voice-reply"
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
        <Input
          placeholder={isListening ? "Listening..." : "Write your answer..."}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          className="flex-1 rounded-2xl bg-muted border-transparent h-10"
          data-ocid="reply-input"
        />
        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex-shrink-0 hover:bg-accent/90"
          onClick={handleSubmit}
          disabled={!reply.trim() || addMessage.isPending}
          data-ocid="submit-reply"
          aria-label="Submit reply"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
