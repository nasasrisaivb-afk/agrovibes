import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BankAccountInput,
  CheckoutInput,
  DisputeOutcome,
  KycReviewDecision,
  KycSubmission,
  ListingInput,
  ModerationAction,
  OnboardingProfile,
  OrderStatus,
  ReportRange,
  SellerListingAction,
  TicketInput,
} from "../backend";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAuth } from "../context/AuthContext";
import { useBackendActor } from "./actor";
import { BackendError, unwrap } from "./errors";

function notReady(): never {
  throw new Error("Still connecting to CropVibe. Give it a second and try again.");
}

// ── Public (no session) ────────────────────────────────────────────────────

export function usePublicConfig() {
  const { actor, actorReady } = useBackendActor();
  return useQuery({
    queryKey: ["publicConfig"],
    enabled: actorReady,
    staleTime: 5 * 60_000,
    queryFn: () => (actor ? actor.getPublicConfig() : notReady()),
  });
}

export function useCategories() {
  const { actor, actorReady } = useBackendActor();
  return useQuery({
    queryKey: ["categories"],
    enabled: actorReady,
    staleTime: 5 * 60_000,
    queryFn: () => (actor ? actor.getCategories() : notReady()),
  });
}

export function useBrowseListings(filter: { categoryId?: bigint; search?: string }) {
  const { actor, actorReady } = useBackendActor();
  return useQuery({
    queryKey: ["listings", filter.categoryId?.toString() ?? "all", filter.search ?? ""],
    enabled: actorReady,
    queryFn: () => (actor ? actor.browseListings(filter) : notReady()),
  });
}

export function useListingDetail(listingId: bigint | null) {
  const { actor, actorReady } = useBackendActor();
  return useQuery({
    queryKey: ["listing", listingId?.toString()],
    enabled: actorReady && listingId !== null,
    queryFn: async () => (actor && listingId !== null ? unwrap(await actor.getListingDetail(listingId)) : notReady()),
  });
}

// ── Auth ───────────────────────────────────────────────────────────────────

export function useSendOtp() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (phone: string) => (actor ? unwrap(await actor.sendOtp(phone)) : notReady()),
  });
}

export function useVerifyOtp() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (args: { phone: string; otp: string; requestId: string }) =>
      actor ? unwrap(await actor.verifyOtp(args.phone, args.otp, args.requestId)) : notReady(),
  });
}

export function useCompleteOnboarding() {
  const { actor } = useBackendActor();
  const { token, refetchMe } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: OnboardingProfile) =>
      actor && token ? unwrap(await actor.completeOnboarding(token, profile)) : notReady(),
    onSuccess: () => {
      refetchMe();
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

// ── Consumer queries ───────────────────────────────────────────────────────

function useConsumerQuery<T>(key: unknown[], fn: (actor: NonNullable<ReturnType<typeof useBackendActor>["actor"]>, token: string) => Promise<T>) {
  const { actor, actorReady } = useBackendActor();
  const { token } = useAuth();
  return useQuery({
    queryKey: [...key, token],
    enabled: actorReady && !!token,
    queryFn: () => (actor && token ? fn(actor, token) : notReady()),
  });
}

export function useKycState() {
  return useConsumerQuery(["kycState"], async (actor, token) => unwrap(await actor.getKycState(token)));
}

export function useMyListings() {
  return useConsumerQuery(["myListings"], async (actor, token) => unwrap(await actor.getMyListings(token)));
}

export function useMyListing(listingId: bigint | null) {
  const { actor, actorReady } = useBackendActor();
  const { token } = useAuth();
  return useQuery({
    queryKey: ["myListing", listingId?.toString(), token],
    enabled: actorReady && !!token && listingId !== null,
    queryFn: async () =>
      actor && token && listingId !== null ? unwrap(await actor.getMyListing(token, listingId)) : notReady(),
  });
}

export function useMyOrders() {
  return useConsumerQuery(["myOrders"], async (actor, token) => unwrap(await actor.getMyOrders(token)));
}

export function useSellerOrders(enabled: boolean) {
  const { actor, actorReady } = useBackendActor();
  const { token } = useAuth();
  return useQuery({
    queryKey: ["sellerOrders", token],
    enabled: actorReady && !!token && enabled,
    queryFn: async () => (actor && token ? unwrap(await actor.getSellerOrders(token)) : notReady()),
  });
}

export function useOrder(orderId: bigint | null) {
  const { actor, actorReady } = useBackendActor();
  const { token } = useAuth();
  return useQuery({
    queryKey: ["order", orderId?.toString(), token],
    enabled: actorReady && !!token && orderId !== null,
    queryFn: async () =>
      actor && token && orderId !== null ? unwrap(await actor.getOrder(token, orderId)) : notReady(),
  });
}

export function useMyBankAccounts() {
  return useConsumerQuery(["bankAccounts"], async (actor, token) => unwrap(await actor.getMyBankAccounts(token)));
}

export function useMyPayouts() {
  // Update call on the canister: it settles any due payouts before returning.
  return useConsumerQuery(["payouts"], async (actor, token) => unwrap(await actor.getMyPayouts(token)));
}

export function useMyNotifications() {
  return useConsumerQuery(["notifications"], async (actor, token) => unwrap(await actor.getMyNotifications(token)));
}

export function useMySupportTickets() {
  return useConsumerQuery(["supportTickets"], async (actor, token) => unwrap(await actor.getMySupportTickets(token)));
}

// ── Consumer mutations ─────────────────────────────────────────────────────

function useConsumerMutation<TArgs, TResult>(
  fn: (actor: NonNullable<ReturnType<typeof useBackendActor>["actor"]>, token: string, args: TArgs) => Promise<TResult>,
  invalidate: string[][],
) {
  const { actor } = useBackendActor();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: TArgs) => (actor && token ? fn(actor, token, args) : notReady()),
    onSuccess: () => {
      for (const key of invalidate) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function useCreateListing() {
  return useConsumerMutation(
    async (actor, token, input: ListingInput) => unwrap(await actor.createListing(token, input)),
    [["myListings"]],
  );
}

export function useUpdateListing() {
  return useConsumerMutation(
    async (actor, token, args: { listingId: bigint; input: ListingInput }) =>
      unwrap(await actor.updateListing(token, args.listingId, args.input)),
    [["myListings"], ["myListing"], ["listings"], ["listing"]],
  );
}

export function useSubmitListingForPublish() {
  return useConsumerMutation(
    async (actor, token, listingId: bigint) => unwrap(await actor.submitListingForPublish(token, listingId)),
    [["myListings"], ["myListing"], ["listings"]],
  );
}

export function useManageListing() {
  return useConsumerMutation(
    async (actor, token, args: { listingId: bigint; action: SellerListingAction }) =>
      unwrap(await actor.manageListing(token, args.listingId, args.action)),
    [["myListings"], ["myListing"], ["listings"], ["listing"]],
  );
}

export function useSubmitKyc() {
  return useConsumerMutation(
    async (actor, token, submission: KycSubmission) => unwrap(await actor.submitKycDocument(token, submission)),
    [["kycState"], ["me"], ["notifications"]],
  );
}

export function useLookupIfsc() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (ifsc: string) => (actor ? unwrap(await actor.lookupIfsc(ifsc)) : notReady()),
  });
}

export function useAddBankAccount() {
  return useConsumerMutation(
    async (actor, token, input: BankAccountInput) => unwrap(await actor.addBankAccount(token, input)),
    [["bankAccounts"], ["me"], ["payouts"], ["notifications"]],
  );
}

export function useInitiateCheckout() {
  return useConsumerMutation(
    async (actor, token, input: CheckoutInput) => unwrap(await actor.initiateCheckout(token, input)),
    [],
  );
}

export function useConfirmCheckout() {
  return useConsumerMutation(
    async (actor, token, args: { idempotencyKey: string; succeed: boolean }) =>
      unwrap(await actor.confirmCheckout(token, args.idempotencyKey, args.succeed)),
    [["myOrders"], ["listings"], ["listing"], ["notifications"], ["me"]],
  );
}

export function useTransitionOrder() {
  return useConsumerMutation(
    async (actor, token, args: { orderId: bigint; newStatus: OrderStatus }) =>
      unwrap(await actor.transitionOrderStatus(token, args.orderId, args.newStatus)),
    [["myOrders"], ["sellerOrders"], ["order"], ["payouts"], ["notifications"], ["listings"], ["listing"]],
  );
}

export function useMarkNotificationRead() {
  return useConsumerMutation(
    async (actor, token, notificationId: bigint) => unwrap(await actor.markNotificationRead(token, notificationId)),
    [["notifications"], ["me"]],
  );
}

export function useMarkAllNotificationsRead() {
  return useConsumerMutation(
    async (actor, token, _args: void) => unwrap(await actor.markAllNotificationsRead(token)),
    [["notifications"], ["me"]],
  );
}

export function useCreateSupportTicket() {
  return useConsumerMutation(
    async (actor, token, input: TicketInput) => unwrap(await actor.createSupportTicket(token, input)),
    [["supportTickets"]],
  );
}

// ── Admin (separate employee session) ──────────────────────────────────────

export function useAdminLogin() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (args: { email: string; password: string }) =>
      actor ? unwrap(await actor.adminLogin(args.email, args.password)) : notReady(),
  });
}

function useAdminQuery<T>(key: unknown[], fn: (actor: NonNullable<ReturnType<typeof useBackendActor>["actor"]>, token: string) => Promise<T>) {
  const { actor, actorReady } = useBackendActor();
  const { adminToken, invalidateAdminSession } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", ...key, adminToken],
    enabled: actorReady && !!adminToken,
    retry: false,
    queryFn: async () => {
      if (!actor || !adminToken) notReady();
      try {
        return await fn(actor, adminToken);
      } catch (error) {
        if (error instanceof BackendError && error.apiError.__kind__ === "Unauthorized") {
          invalidateAdminSession();
        }
        throw error;
      }
    },
  });
}

export function useAdminKycQueue() {
  return useAdminQuery(["kycQueue"], async (actor, token) => unwrap(await actor.adminGetKycQueue(token)));
}

export function useAdminListingQueue() {
  return useAdminQuery(["listingQueue"], async (actor, token) => unwrap(await actor.adminGetListingQueue(token)));
}

export function useAdminReports(range: ReportRange) {
  const { actor, actorReady } = useBackendActor();
  const { adminToken } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", "reports", range.fromNs.toString(), range.toNs.toString(), adminToken],
    enabled: actorReady && !!adminToken,
    queryFn: async () => (actor && adminToken ? unwrap(await actor.adminGetReports(adminToken, range)) : notReady()),
  });
}

function useAdminMutation<TArgs, TResult>(
  fn: (actor: NonNullable<ReturnType<typeof useBackendActor>["actor"]>, token: string, args: TArgs) => Promise<TResult>,
) {
  const { actor } = useBackendActor();
  const { adminToken } = useAdminAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: TArgs) => (actor && adminToken ? fn(actor, adminToken, args) : notReady()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminStartKycReview() {
  return useAdminMutation(async (actor, token, documentId: bigint) =>
    unwrap(await actor.adminStartKycReview(token, documentId)),
  );
}

export function useAdminReviewKyc() {
  return useAdminMutation(async (actor, token, args: { documentId: bigint; decision: KycReviewDecision }) =>
    unwrap(await actor.adminReviewKyc(token, args.documentId, args.decision)),
  );
}

export function useAdminModerateListing() {
  return useAdminMutation(async (actor, token, args: { listingId: bigint; action: ModerationAction }) =>
    unwrap(await actor.adminModerateListing(token, args.listingId, args.action)),
  );
}

export function useAdminResolveDispute() {
  return useAdminMutation(async (actor, token, args: { orderId: bigint; outcome: DisputeOutcome; note: string }) =>
    unwrap(await actor.adminResolveDispute(token, args.orderId, args.outcome, args.note)),
  );
}
