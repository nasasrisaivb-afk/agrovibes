import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TicketInput {
    subject: string;
    body: string;
    category: TicketCategory;
}
export type Result_2 = {
    __kind__: "ok";
    ok: OrderView;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface ReportRange {
    toNs: Timestamp;
    fromNs: Timestamp;
}
export interface Payout {
    id: bigint;
    status: PayoutStatus;
    bankAccountId: bigint;
    userId: bigint;
    createdAt: Timestamp;
    orderId?: bigint;
    scheduledFor: Timestamp;
    amountInr: bigint;
    paidAt?: Timestamp;
}
export interface BankAccountInput {
    ifsc: string;
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
}
export interface AppConfig {
    sessionTtlHours: bigint;
    kycAutoApproveThreshold: number;
    kycPriorityHighBelow: number;
    commissionBps: bigint;
    kycAttemptWindowHours: bigint;
    otpRateLimitWindowSecs: bigint;
    kycMaxAttempts: bigint;
    kycCheckoutThresholdInr: bigint;
    otpExpirySecs: bigint;
    environment: Environment;
    kycPriorityMediumBelow: number;
    payoutHoldHours: bigint;
    otpRateLimitMax: bigint;
}
export interface SendOtpResult {
    requestId: string;
    expiresInSecs: bigint;
}
export type Result_5 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: SendOtpResult;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_7 = {
    __kind__: "ok";
    ok: CheckoutIntent;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface AttributeField {
    key: string;
    fieldLabel: string;
    unit?: string;
    required: boolean;
    options: Array<string>;
    fieldType: AttributeFieldType;
}
export type OnboardingProfile = {
    __kind__: "Buyer";
    Buyer: {
        name: string;
        deliveryLocation: string;
    };
} | {
    __kind__: "Seller";
    Seller: {
        name: string;
        businessType: BusinessType;
        primaryCategoryId: bigint;
    };
};
export interface ConfirmCheckoutResult {
    order?: OrderView;
    payment: Payment;
}
export type Result_6 = {
    __kind__: "ok";
    ok: {
        branch: string;
        bankName: string;
    };
} | {
    __kind__: "err";
    err: ApiError;
};
export type KycReviewDecision = {
    __kind__: "Approve";
    Approve: null;
} | {
    __kind__: "Reject";
    Reject: KycRejectionReason;
};
export type Result_12 = {
    __kind__: "ok";
    ok: Array<Listing>;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_9 = {
    __kind__: "ok";
    ok: Array<SupportTicket>;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface Payment {
    status: PaymentStatus;
    method: PaymentMethod;
    idempotencyKey: string;
    provider: string;
    listingId: bigint;
    createdAt: Timestamp;
    providerPaymentId: string;
    orderId?: bigint;
    updatedAt: Timestamp;
    buyerId: bigint;
    quantity: bigint;
    amountInr: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    listingId: bigint;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    totalAmountInr: bigint;
    buyerId: bigint;
    quantity: bigint;
    sellerId: bigint;
    timeline: Array<OrderEvent>;
}
export interface KycQueueRow {
    applicantName: string;
    applicantPhone: string;
    applicantRoles: Array<UserRole>;
    document: KycDocument;
    priority: Priority;
}
export type ModerationAction = {
    __kind__: "Approve";
    Approve: null;
} | {
    __kind__: "Reject";
    Reject: string;
} | {
    __kind__: "RequestChanges";
    RequestChanges: string;
};
export type Result = {
    __kind__: "ok";
    ok: VerifyOtpResult;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_10 = {
    __kind__: "ok";
    ok: Array<Payout>;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface Notification {
    id: bigint;
    title: string;
    body: string;
    userId: bigint;
    notificationType: NotificationType;
    createdAt: Timestamp;
    read: boolean;
    payload: NotificationPayload;
}
export type Result_8 = {
    __kind__: "ok";
    ok: Array<OrderView>;
} | {
    __kind__: "err";
    err: ApiError;
};
export type ApiError = {
    __kind__: "InvalidInput";
    InvalidInput: string;
} | {
    __kind__: "ProviderUnavailable";
    ProviderUnavailable: string;
} | {
    __kind__: "KycInProgress";
    KycInProgress: KycGateInfo;
} | {
    __kind__: "InvalidTransition";
    InvalidTransition: {
        toStatus: string;
        fromStatus: string;
        message: string;
    };
} | {
    __kind__: "NotFound";
    NotFound: string;
} | {
    __kind__: "Unauthorized";
    Unauthorized: string;
} | {
    __kind__: "RateLimited";
    RateLimited: {
        message: string;
        retryAfterSecs: bigint;
    };
} | {
    __kind__: "KycRequired";
    KycRequired: KycGateInfo;
} | {
    __kind__: "Forbidden";
    Forbidden: string;
} | {
    __kind__: "Conflict";
    Conflict: string;
};
export interface AdminLoginResult {
    token: string;
    name: string;
    email: string;
    adminId: bigint;
}
export interface KycSubmission {
    selfieUrl?: string;
    docType: KycDocType;
    fileUrl: string;
}
export interface OrderView {
    order: Order;
    listingUnit: string;
    sellerName: string;
    listingImageUrl?: string;
    listingTitle: string;
    buyerName: string;
}
export interface MeView {
    hasVerifiedBankAccount: boolean;
    unreadNotifications: bigint;
    user: User;
}
export type Timestamp = bigint;
export type Result_17 = {
    __kind__: "ok";
    ok: ConfirmCheckoutResult;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_13 = {
    __kind__: "ok";
    ok: Array<BankAccount>;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_25 = {
    __kind__: "ok";
    ok: BankAccount;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface VerifyOtpResult {
    isNewUser: boolean;
    user: User;
    sessionToken: string;
}
export interface KycDocument {
    id: bigint;
    status: KycDocStatus;
    userId: bigint;
    rejectionReason?: KycRejectionReason;
    submittedAt: Timestamp;
    selfieUrl?: string;
    reviewedAt?: Timestamp;
    reviewedBy?: bigint;
    confidenceScore?: number;
    isLatest: boolean;
    docType: KycDocType;
    fileUrl: string;
    attemptNumber: bigint;
}
export interface KycState {
    status: KycStatus;
    documents: Array<KycDocument>;
    attemptsUsedInWindow: bigint;
    rejectionReason?: KycRejectionReason;
    canResubmit: boolean;
    maxAttempts: bigint;
}
export type Result_16 = {
    __kind__: "ok";
    ok: SupportTicket;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: Listing;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface ModerationRow {
    listing: Listing;
    categoryName: string;
    sellerName: string;
    sellerKycStatus: KycStatus;
}
export type Result_22 = {
    __kind__: "ok";
    ok: Reports;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_11 = {
    __kind__: "ok";
    ok: Array<Notification>;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface ListingInput {
    categoryId: bigint;
    title: string;
    unit: string;
    description: string;
    attributes: Array<[string, string]>;
    quantity: bigint;
    priceInr: bigint;
    location: string;
    images: Array<ListingImage>;
}
export interface OrderEvent {
    at: Timestamp;
    status: OrderStatus;
    note: string;
}
export type Result_19 = {
    __kind__: "ok";
    ok: AppConfig;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface ListingImage {
    url: string;
    qualityFlag?: ImageQualityFlag;
    order: bigint;
}
export type Result_24 = {
    __kind__: "ok";
    ok: Array<KycQueueRow>;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_14 = {
    __kind__: "ok";
    ok: MeView;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface PublicListing {
    id: bigint;
    categoryId: bigint;
    status: ListingStatus;
    title: string;
    categoryName: string;
    createdAt: Timestamp;
    unit: string;
    sellerKycVerified: boolean;
    description: string;
    sellerName: string;
    attributes: Array<[string, string]>;
    quantity: bigint;
    sellerId: bigint;
    priceInr: bigint;
    location: string;
    images: Array<ListingImage>;
}
export interface PublicConfig {
    commissionBps: bigint;
    kycAttemptWindowHours: bigint;
    otpRateLimitWindowSecs: bigint;
    kycMaxAttempts: bigint;
    kycCheckoutThresholdInr: bigint;
    otpExpirySecs: bigint;
    environment: Environment;
    payoutHoldHours: bigint;
    otpRateLimitMax: bigint;
}
export interface Category {
    id: bigint;
    attributeSchema: Array<AttributeField>;
    name: string;
    parentId?: bigint;
}
export interface SupportTicket {
    id: bigint;
    status: TicketStatus;
    subject: string;
    body: string;
    userId: bigint;
    createdAt: Timestamp;
    category: TicketCategory;
    priority: Priority;
    assignedAdminId?: bigint;
}
export interface BankAccount {
    id: bigint;
    branch: string;
    userId: bigint;
    ifsc: string;
    createdAt: Timestamp;
    accountHolderName: string;
    bankName: string;
    providerToken: string;
    accountNumberLast4: string;
    verificationStatus: BankVerificationStatus;
}
export interface Listing {
    id: bigint;
    categoryId: bigint;
    status: ListingStatus;
    title: string;
    moderationNote?: string;
    createdAt: Timestamp;
    unit: string;
    description: string;
    updatedAt: Timestamp;
    attributes: Array<[string, string]>;
    quantity: bigint;
    sellerId: bigint;
    priceInr: bigint;
    location: string;
    images: Array<ListingImage>;
}
export interface User {
    id: bigint;
    name: string;
    createdAt: Timestamp;
    kycRejectionReason?: KycRejectionReason;
    businessType?: BusinessType;
    kycStatus: KycStatus;
    deliveryLocation?: string;
    primaryCategoryId?: bigint;
    phone: string;
    roles: Array<UserRole>;
}
export type Result_21 = {
    __kind__: "ok";
    ok: AdminLoginResult;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface CheckoutIntent {
    listingTitle: string;
    payment: Payment;
}
export type SellerListingAction = {
    __kind__: "Restock";
    Restock: bigint;
} | {
    __kind__: "Resume";
    Resume: null;
} | {
    __kind__: "Pause";
    Pause: null;
} | {
    __kind__: "Archive";
    Archive: null;
};
export type Result_18 = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: KycState;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface KycGateInfo {
    rejectionReason?: KycRejectionReason;
    kycStatus: KycStatus;
    message: string;
    canResubmit: boolean;
}
export type Result_23 = {
    __kind__: "ok";
    ok: Array<ModerationRow>;
} | {
    __kind__: "err";
    err: ApiError;
};
export type Result_15 = {
    __kind__: "ok";
    ok: PublicListing;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface NotificationPayload {
    listingId?: bigint;
    payoutId?: bigint;
    orderId?: bigint;
    kycDocumentId?: bigint;
}
export interface BrowseFilter {
    categoryId?: bigint;
    search?: string;
}
export interface CheckoutInput {
    method: PaymentMethod;
    idempotencyKey: string;
    listingId: bigint;
    quantity: bigint;
}
export type Result_20 = {
    __kind__: "ok";
    ok: KycDocument;
} | {
    __kind__: "err";
    err: ApiError;
};
export interface Reports {
    newUserCount: bigint;
    activeUserCount: bigint;
    gmvInr: bigint;
    toNs: Timestamp;
    orderCount: bigint;
    payoutPaidInr: bigint;
    publishedListingCount: bigint;
    fromNs: Timestamp;
    totalUserCount: bigint;
    refundedOrderCount: bigint;
    newListingCount: bigint;
}
export enum AttributeFieldType {
    SELECT = "SELECT",
    DATE = "DATE",
    TEXT = "TEXT",
    NUMBER = "NUMBER"
}
export enum BankVerificationStatus {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
    PENNY_DROP_PENDING = "PENNY_DROP_PENDING",
    FAILED = "FAILED"
}
export enum BusinessType {
    INDIVIDUAL = "INDIVIDUAL",
    REGISTERED = "REGISTERED"
}
export enum DisputeOutcome {
    RefundBuyer = "RefundBuyer",
    ReleaseToSeller = "ReleaseToSeller"
}
export enum Environment {
    Production = "Production",
    Development = "Development"
}
export enum ImageQualityFlag {
    BLURRY = "BLURRY",
    LOW_RESOLUTION = "LOW_RESOLUTION"
}
export enum KycDocStatus {
    REJECTED = "REJECTED",
    VERIFIED = "VERIFIED",
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW"
}
export enum KycDocType {
    GST = "GST",
    PAN = "PAN",
    AADHAAR = "AADHAAR"
}
export enum KycRejectionReason {
    SELFIE_MISMATCH = "SELFIE_MISMATCH",
    NAME_MISMATCH = "NAME_MISMATCH",
    EXPIRED_DOCUMENT = "EXPIRED_DOCUMENT",
    BLURRY_DOCUMENT = "BLURRY_DOCUMENT",
    FRAUD_SUSPECTED = "FRAUD_SUSPECTED"
}
export enum KycStatus {
    REJECTED = "REJECTED",
    NONE = "NONE",
    VERIFIED = "VERIFIED",
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW"
}
export enum ListingStatus {
    REJECTED = "REJECTED",
    PENDING_REVIEW = "PENDING_REVIEW",
    SOLD_OUT = "SOLD_OUT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
    DRAFT = "DRAFT",
    PAUSED = "PAUSED"
}
export enum NotificationType {
    PAYOUT_UPDATE = "PAYOUT_UPDATE",
    KYC_UPDATE = "KYC_UPDATE",
    ORDER_UPDATE = "ORDER_UPDATE",
    SYSTEM = "SYSTEM",
    LISTING_UPDATE = "LISTING_UPDATE"
}
export enum OrderStatus {
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    RESOLVED = "RESOLVED",
    IN_PROGRESS = "IN_PROGRESS",
    DISPUTED = "DISPUTED",
    CONFIRMED = "CONFIRMED",
    PLACED = "PLACED"
}
export enum PaymentMethod {
    UPI = "UPI",
    NETBANKING = "NETBANKING",
    CARD = "CARD"
}
export enum PaymentStatus {
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PENDING = "PENDING"
}
export enum PayoutStatus {
    SCHEDULED = "SCHEDULED",
    PAID = "PAID",
    FAILED = "FAILED",
    PROCESSING = "PROCESSING"
}
export enum Priority {
    LOW = "LOW",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM"
}
export enum TicketCategory {
    KYC = "KYC",
    ACCOUNT = "ACCOUNT",
    TECHNICAL = "TECHNICAL",
    PAYMENTS = "PAYMENTS",
    ORDER_DISPUTE = "ORDER_DISPUTE"
}
export enum TicketStatus {
    OPEN = "OPEN",
    RESOLVED = "RESOLVED",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED"
}
export enum UserRole {
    SELLER = "SELLER",
    BUYER = "BUYER"
}
export interface backendInterface {
    addBankAccount(token: string, input: BankAccountInput): Promise<Result_25>;
    adminGetConfig(token: string): Promise<Result_19>;
    adminGetDisputedOrders(token: string): Promise<Result_8>;
    adminGetKycQueue(token: string): Promise<Result_24>;
    adminGetListingQueue(token: string): Promise<Result_23>;
    adminGetReports(token: string, range: ReportRange): Promise<Result_22>;
    adminLogin(email: string, password: string): Promise<Result_21>;
    adminModerateListing(token: string, listingId: bigint, action: ModerationAction): Promise<Result_1>;
    adminResolveDispute(token: string, orderId: bigint, outcome: DisputeOutcome, note: string): Promise<Result_2>;
    adminReviewKyc(token: string, documentId: bigint, decision: KycReviewDecision): Promise<Result_20>;
    adminRunPayoutCycle(token: string): Promise<Result_5>;
    adminStartKycReview(token: string, documentId: bigint): Promise<Result_20>;
    adminUpdateConfig(token: string, newConfig: AppConfig): Promise<Result_19>;
    browseListings(filter: BrowseFilter): Promise<Array<PublicListing>>;
    completeOnboarding(token: string, profile: OnboardingProfile): Promise<Result_18>;
    confirmCheckout(token: string, idempotencyKey: string, succeed: boolean): Promise<Result_17>;
    createListing(token: string, input: ListingInput): Promise<Result_1>;
    createSupportTicket(token: string, input: TicketInput): Promise<Result_16>;
    getCategories(): Promise<Array<Category>>;
    getKycState(token: string): Promise<Result_3>;
    getListingDetail(listingId: bigint): Promise<Result_15>;
    getMe(token: string): Promise<Result_14>;
    getMyBankAccounts(token: string): Promise<Result_13>;
    getMyListing(token: string, listingId: bigint): Promise<Result_1>;
    getMyListings(token: string): Promise<Result_12>;
    getMyNotifications(token: string): Promise<Result_11>;
    getMyOrders(token: string): Promise<Result_8>;
    getMyPayouts(token: string): Promise<Result_10>;
    getMySupportTickets(token: string): Promise<Result_9>;
    getOrder(token: string, orderId: bigint): Promise<Result_2>;
    getPublicConfig(): Promise<PublicConfig>;
    getSellerOrders(token: string): Promise<Result_8>;
    initiateCheckout(token: string, input: CheckoutInput): Promise<Result_7>;
    logout(token: string): Promise<void>;
    lookupIfsc(ifscRaw: string): Promise<Result_6>;
    manageListing(token: string, listingId: bigint, action: SellerListingAction): Promise<Result_1>;
    markAllNotificationsRead(token: string): Promise<Result_5>;
    markNotificationRead(token: string, notificationId: bigint): Promise<Result_5>;
    sendOtp(phoneRaw: string): Promise<Result_4>;
    submitKycDocument(token: string, submission: KycSubmission): Promise<Result_3>;
    submitListingForPublish(token: string, listingId: bigint): Promise<Result_1>;
    transitionOrderStatus(token: string, orderId: bigint, newStatus: OrderStatus): Promise<Result_2>;
    updateListing(token: string, listingId: bigint, input: ListingInput): Promise<Result_1>;
    verifyOtp(phoneRaw: string, otp: string, requestId: string): Promise<Result>;
}
