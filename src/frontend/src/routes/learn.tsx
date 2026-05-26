import { createRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Mic,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { CommunityLearning } from "../components/learn/CommunityLearning";
import { CourseMarketplace } from "../components/learn/CourseMarketplace";
import { EducatorPlatform } from "../components/learn/EducatorPlatform";
import { InteractiveLearning } from "../components/learn/InteractiveLearning";
import { KnowledgeRepository } from "../components/learn/KnowledgeRepository";
import { SkillCertification } from "../components/learn/SkillCertification";
import { useRoleContext } from "../context/RoleContext";
import { Route as rootRoute } from "./__root";

type TabId =
  | "courses"
  | "interactive"
  | "repository"
  | "certification"
  | "educators"
  | "community";

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: "courses", label: "Courses", shortLabel: "Courses", icon: BookOpen },
  {
    id: "interactive",
    label: "Interactive",
    shortLabel: "Interactive",
    icon: Video,
  },
  {
    id: "repository",
    label: "Repository",
    shortLabel: "Repo",
    icon: FolderOpen,
  },
  {
    id: "certification",
    label: "Certification",
    shortLabel: "Certify",
    icon: Award,
  },
  { id: "educators", label: "Educators", shortLabel: "Educators", icon: Users },
  {
    id: "community",
    label: "Community",
    shortLabel: "Community",
    icon: MessageCircle,
  },
];

function LearnPage() {
  const { role } = useRoleContext();

  // Educator role opens to educators tab by default
  const defaultTab: TabId = role === "educator" ? "educators" : "courses";
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  return (
    <div
      className="flex flex-col bg-background min-h-full"
      data-ocid="learn.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-0 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Learn
            </h1>
            <p className="text-xs text-muted-foreground">
              Courses, certifications & community
            </p>
          </div>
          <button
            type="button"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-accent/15 text-[oklch(var(--accent))] flex-shrink-0"
            aria-label="Voice search"
            data-ocid="learn.voice_search_button"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {/* Section tabs — horizontal scroll */}
        <div className="flex gap-0 overflow-x-auto scrollbar-none -mx-4 px-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3.5 py-2.5 text-[11px] font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`learn.tab.${tab.id}`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pt-3">
        {activeTab === "courses" && <CourseMarketplace />}
        {activeTab === "interactive" && <InteractiveLearning />}
        {activeTab === "repository" && <KnowledgeRepository />}
        {activeTab === "certification" && <SkillCertification />}
        {activeTab === "educators" && <EducatorPlatform />}
        {activeTab === "community" && <CommunityLearning />}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: LearnPage,
});
