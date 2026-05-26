import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Course,
  Educator,
  LiveStream,
  Notification,
  Conversation,
  DirectMessage,
  Enrollment,
  CreateCourseInput,
  CreateEnrollmentInput,
  CreateListingInput,
  CreateReelInput,
  CreateQuestionInput,
  AddGroupMessageInput,
  SubmitOrderInput,
} from "../backend";

export function useGetFarmers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["farmers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFarmers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReels() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQA() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["qa"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQA();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGroups() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGroupMessages(groupId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["groupMessages", groupId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroupMessages(groupId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return { logistics: [], experts: [], machinery: [] };
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAnswers(questionId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["answers", questionId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnswers(questionId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateListingInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createListing(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useCreateReel() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReelInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createReel(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reels"] }),
  });
}

export function useCreateQuestion() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateQuestionInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createQuestion(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["qa"] }),
  });
}

export function useSubmitOrder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitOrderInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitOrder(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useAddGroupMessage() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddGroupMessageInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addGroupMessage(input);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["groupMessages", vars.groupId.toString()],
      }),
  });
}

// ─── Educators, Courses, Streams, Notifications, Messaging ────────────────────

export function useGetEducators() {
  return useQuery<Educator[]>({
    queryKey: ["educators"],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getEducators();
    },
  });
}

export function useGetCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getCourses();
    },
  });
}

export function useGetLiveStreams() {
  return useQuery<LiveStream[]>({
    queryKey: ["liveStreams"],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getLiveStreams();
    },
  });
}

export function useGetNotifications(userId: bigint) {
  return useQuery<Notification[]>({
    queryKey: ["notifications", userId.toString()],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getNotifications(userId);
    },
  });
}

export function useGetConversations(userId: bigint) {
  return useQuery<Conversation[]>({
    queryKey: ["conversations", userId.toString()],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getConversations(userId);
    },
  });
}

export function useGetDirectMessages(conversationId: bigint) {
  return useQuery<DirectMessage[]>({
    queryKey: ["directMessages", conversationId.toString()],
    queryFn: async () => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.getDirectMessages(conversationId);
    },
  });
}

export function useSendDirectMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { conversationId: bigint; senderId: bigint; receiverId: bigint; content: string; isVoiceMessage: boolean }) => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.sendDirectMessage(input);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["directMessages", vars.conversationId.toString()] }),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notifId: bigint) => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.markNotificationRead(notifId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCourseInput) => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.createCourse(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useEnrollInCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEnrollmentInput) => {
      const { mockBackend } = await import("../mocks/backend");
      return mockBackend.enrollInCourse(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
