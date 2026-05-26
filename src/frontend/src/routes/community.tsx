import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  MessageCircle,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { GroupView } from "../components/community/GroupView";
import { GroupsGrid } from "../components/community/GroupsGrid";
import { QAFeed } from "../components/community/QAFeed";
import { QuestionDetail } from "../components/community/QuestionDetail";
import type { Group, Question } from "../types";
import { Route as rootRoute } from "./__root";

function CommunityContent() {
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [search, setSearch] = useState("");

  if (activeGroup) {
    return (
      <GroupView group={activeGroup} onBack={() => setActiveGroup(null)} />
    );
  }

  if (activeQuestion) {
    return (
      <QuestionDetail
        question={activeQuestion}
        onBack={() => setActiveQuestion(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header with back to home */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-3 flex items-center gap-3">
        <a
          href="/"
          aria-label="Back to Home"
          data-ocid="community.back-home-btn"
        >
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </a>
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">Community</h1>
          <p className="text-[10px] text-muted-foreground">
            Q&amp;A, Groups &amp; Messages
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10 rounded-2xl bg-muted/50 border-transparent focus-visible:ring-1"
            placeholder="Search questions, groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="community.search-input"
          />
        </div>
      </div>

      <div className="px-4 pb-24">
        <Tabs defaultValue="qa" data-ocid="community.tabs">
          <TabsList className="w-full h-10 rounded-xl bg-muted/60 mb-4 mt-2">
            <TabsTrigger
              value="qa"
              className="flex-1 text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              data-ocid="community.tab-qa"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Q&amp;A Feed
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              data-ocid="community.tab-groups"
            >
              <Users className="h-3.5 w-3.5" />
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex-1 text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              data-ocid="community.tab-messages"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qa" className="mt-0">
            <QAFeed search={search} onSelectQuestion={setActiveQuestion} />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <GroupsGrid onSelectGroup={setActiveGroup} />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <DirectMessagesPlaceholder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DirectMessagesPlaceholder() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      data-ocid="community.messages-placeholder"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <MessageSquare className="h-9 w-9 text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-base text-foreground">
          Direct Messages
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-[220px] leading-relaxed">
          Role-aware secure messaging coming soon — with translation support
        </p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-primary/30" />
        ))}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityContent,
});
