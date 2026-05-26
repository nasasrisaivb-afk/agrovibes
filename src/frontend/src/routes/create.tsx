import { AskQuestionForm } from "@/components/create/AskQuestionForm";
import { EducationalContentCreator } from "@/components/create/EducationalContentCreator";
import { ListProduceForm } from "@/components/create/ListProduceForm";
import { LiveStreamCenter } from "@/components/create/LiveStreamCenter";
import { PostReelForm } from "@/components/create/PostReelForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleContext } from "@/context/RoleContext";
import { createRoute } from "@tanstack/react-router";
import {
  BookOpen,
  MessageCircleQuestion,
  Radio,
  ShoppingBasket,
  Video,
} from "lucide-react";
import { Route as rootRoute } from "./__root";

function CreateContent() {
  const { role } = useRoleContext();

  const showListProduce =
    role === "farmer" || role === "service" || role === "machinery";
  const showEducation = role === "educator";

  const defaultTab = "reel";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10 px-4 py-4">
        <h1 className="font-display font-bold text-xl text-foreground">
          Create+
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {role === "educator"
            ? "Share knowledge, run live lessons, engage your students"
            : role === "buyer"
              ? "Post live streams, ask questions, engage with farmers"
              : "Share produce, post reels, go live, ask the community"}
        </p>
      </div>

      <div className="p-4">
        <Tabs defaultValue={defaultTab} data-ocid="create-tabs">
          {/* Scrollable tab list */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <TabsList className="inline-flex h-11 rounded-xl bg-muted/60 mb-6 gap-0.5 min-w-max">
              {/* Reel — all roles */}
              <TabsTrigger
                value="reel"
                className="flex items-center gap-1.5 px-3 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg font-medium whitespace-nowrap"
                data-ocid="tab-post-reel"
              >
                <Video className="h-3.5 w-3.5" />
                Video Reel
              </TabsTrigger>

              {/* Live Stream — all roles */}
              <TabsTrigger
                value="livestream"
                className="flex items-center gap-1.5 px-3 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg font-medium whitespace-nowrap"
                data-ocid="tab-live-stream"
              >
                <Radio className="h-3.5 w-3.5" />
                Live Stream
              </TabsTrigger>

              {/* Ask Question — all roles */}
              <TabsTrigger
                value="question"
                className="flex items-center gap-1.5 px-3 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg font-medium whitespace-nowrap"
                data-ocid="tab-ask-question"
              >
                <MessageCircleQuestion className="h-3.5 w-3.5" />
                Ask
              </TabsTrigger>

              {/* List Produce — farmer / service / machinery */}
              {showListProduce && (
                <TabsTrigger
                  value="listing"
                  className="flex items-center gap-1.5 px-3 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg font-medium whitespace-nowrap"
                  data-ocid="tab-list-produce"
                >
                  <ShoppingBasket className="h-3.5 w-3.5" />
                  List Produce
                </TabsTrigger>
              )}

              {/* Educational Content — educator only */}
              {showEducation && (
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-1.5 px-3 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg font-medium whitespace-nowrap"
                  data-ocid="tab-educational-content"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Course
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="reel" className="mt-0">
            <PostReelForm />
          </TabsContent>

          <TabsContent value="livestream" className="mt-0">
            <LiveStreamCenter />
          </TabsContent>

          <TabsContent value="question" className="mt-0">
            <AskQuestionForm />
          </TabsContent>

          {showListProduce && (
            <TabsContent value="listing" className="mt-0">
              <ListProduceForm />
            </TabsContent>
          )}

          {showEducation && (
            <TabsContent value="education" className="mt-0">
              <EducationalContentCreator />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: CreateContent,
});
