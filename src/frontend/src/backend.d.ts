import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DisputeEvent {
    event: string;
    performedBy: string;
    timestamp: bigint;
}
export interface GroupMessage {
    id: bigint;
    content: string;
    authorId: bigint;
    groupId: bigint;
    isVoiceMessage: boolean;
    timestamp: bigint;
}
export interface CreateLiveStreamInput {
    title: string;
    thumbnailUrl: string;
    description: string;
    hostId: bigint;
    scheduledAt: bigint;
}
export interface CreateDirectMessageInput {
    content: string;
    isVoiceMessage: boolean;
    receiverId: bigint;
    senderId: bigint;
}
export interface AddGroupMessageInput {
    content: string;
    authorId: bigint;
    groupId: bigint;
    isVoiceMessage: boolean;
}
export interface DisputeCase {
    id: bigint;
    status: DisputeStatus;
    resolution?: string;
    orderId: bigint;
    evidence: Array<string>;
    timeline: Array<DisputeEvent>;
}
export interface InventoryItem {
    id: bigint;
    threshold: bigint;
    listingId: bigint;
    forecastDays: bigint;
    currentStock: bigint;
}
export interface AuditEvent {
    action: string;
    performedBy: string;
    timestamp: bigint;
}
export interface Lesson {
    id: bigint;
    title: string;
    content: string;
    order: bigint;
    durationMinutes: bigint;
    videoUrl: string;
    courseId: bigint;
}
export interface KycRecord {
    id: bigint;
    status: KycVerificationStatus;
    selfieVerified: boolean;
    idVerified: boolean;
    auditEvents: Array<AuditEvent>;
    userId: bigint;
}
export interface CreateSellerListingInput {
    farmerId: bigint;
    name: string;
    contractType: ContractType;
    description: string;
    imageUrl: string;
    bulkUploadBatch: string;
    payoutSchedule: PayoutSchedule;
    category: ProduceCategory;
    certifications: Array<string>;
    price: number;
    escrowEnabled: boolean;
    verificationStatus: VerificationStatus;
}
export interface MarketPriceTick {
    id: bigint;
    date: bigint;
    cropName: string;
    price: number;
    changePercent: number;
}
export interface SalesAnalytics {
    id: bigint;
    period: SalesPeriod;
    cropName: string;
    totalRevenue: number;
    unitsSold: bigint;
}
export interface SellerListing {
    id: bigint;
    farmerId: bigint;
    name: string;
    createdAt: bigint;
    contractType: ContractType;
    description: string;
    imageUrl: string;
    bulkUploadBatch: string;
    payoutSchedule: PayoutSchedule;
    category: ProduceCategory;
    rating: number;
    certifications: Array<string>;
    price: number;
    escrowEnabled: boolean;
    verificationStatus: VerificationStatus;
}
export interface ForumPost {
    id: bigint;
    upvotes: bigint;
    title: string;
    body: string;
    author: string;
    replies: Array<ForumReply>;
}
export interface Farmer {
    id: bigint;
    bio: string;
    numListings: bigint;
    name: string;
    kycStatus: KycStatus;
    avatarUrl: string;
    rating: number;
    location: string;
}
export interface LogisticsListing {
    id: bigint;
    serviceArea: string;
    ratePerKm: number;
    imageUrl: string;
    providerName: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    total: number;
    listingId: bigint;
    createdAt: bigint;
    buyerId: bigint;
    quantity: bigint;
}
export interface CreateNotificationInput {
    title: string;
    notifType: NotifType;
    body: string;
    userId: bigint;
    priority: NotifPriority;
}
export interface SeasonalAlert {
    id: bigint;
    region: string;
    alertType: SeasonalAlertType;
    title: string;
    description: string;
    timestamp: bigint;
    cropName: string;
    severity: AlertSeverity;
}
export interface Certification {
    id: bigint;
    title: string;
    badgeUrl: string;
    userId: bigint;
    issuedAt: bigint;
    courseId: bigint;
}
export interface MarketPrice {
    id: bigint;
    region: string;
    crop: string;
    date: bigint;
    bidPrice: number;
    askPrice: number;
}
export interface Notification {
    id: bigint;
    title: string;
    notifType: NotifType;
    body: string;
    userId: bigint;
    createdAt: bigint;
    isRead: boolean;
    priority: NotifPriority;
}
export interface Conversation {
    id: bigint;
    lastMessageAt: bigint;
    lastMessage: string;
    unreadCount: bigint;
    participantIds: Array<bigint>;
}
export interface PlantingEntry {
    id: bigint;
    plantDate: bigint;
    notes: string;
    cropName: string;
    harvestDate: bigint;
}
export interface LiveStream {
    id: bigint;
    status: StreamStatus;
    title: string;
    startedAt?: bigint;
    thumbnailUrl: string;
    endedAt?: bigint;
    description: string;
    hostId: bigint;
    viewerCount: bigint;
    scheduledAt: bigint;
}
export interface Reel {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    farmerId: bigint;
    viewCount: bigint;
    linkedListingId?: bigint;
}
export interface MaintenanceEntry {
    technician: string;
    date: bigint;
    description: string;
}
export interface Enrollment {
    id: bigint;
    completedAt?: bigint;
    userId: bigint;
    progress: number;
    enrolledAt: bigint;
    courseId: bigint;
}
export interface Group {
    id: bigint;
    name: string;
    memberCount: bigint;
    description: string;
    iconUrl: string;
}
export interface EquipmentGuide {
    id: bigint;
    compatibility: Array<string>;
    equipmentName: string;
    maintenanceLog: Array<MaintenanceEntry>;
}
export interface CreateReelInput {
    title: string;
    thumbnailUrl: string;
    farmerId: bigint;
    linkedListingId?: bigint;
}
export interface Course {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    createdAt: bigint;
    educatorId: bigint;
    description: string;
    level: string;
    durationMinutes: bigint;
    isCertified: boolean;
    category: string;
    rating: number;
    price: number;
    enrollmentCount: bigint;
}
export interface Educator {
    id: bigint;
    bio: string;
    courseCount: bigint;
    name: string;
    specialty: string;
    kycStatus: KycStatus;
    avatarUrl: string;
    rating: number;
    studentCount: bigint;
}
export interface CreateQuestionInput {
    title: string;
    authorId: bigint;
    description: string;
    category: string;
}
export interface CreateCourseInput {
    title: string;
    thumbnailUrl: string;
    educatorId: bigint;
    description: string;
    level: string;
    durationMinutes: bigint;
    isCertified: boolean;
    category: string;
    price: number;
}
export interface ExpertProfile {
    id: bigint;
    name: string;
    hourlyRate: number;
    available: boolean;
    specialty: string;
    imageUrl: string;
}
export interface Alert {
    id: bigint;
    alertType: AlertType;
    title: string;
    description: string;
    timestamp: bigint;
    severity: AlertSeverity;
    location: string;
}
export interface DirectMessage {
    id: bigint;
    content: string;
    isRead: boolean;
    isVoiceMessage: boolean;
    receiverId: bigint;
    timestamp: bigint;
    senderId: bigint;
}
export interface Listing {
    id: bigint;
    farmerId: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    imageUrl: string;
    category: ProduceCategory;
    rating: number;
    price: number;
    escrowEnabled: boolean;
}
export interface CreateListingInput {
    farmerId: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: ProduceCategory;
    price: number;
    escrowEnabled: boolean;
}
export interface ForumReply {
    body: string;
    author: string;
    timestamp: bigint;
}
export interface MachineryListing {
    id: bigint;
    dailyRate: number;
    ownerId: bigint;
    name: string;
    available: boolean;
    imageUrl: string;
    category: string;
}
export interface SubmitOrderInput {
    total: number;
    listingId: bigint;
    buyerId: bigint;
    quantity: bigint;
}
export interface Answer {
    id: bigint;
    content: string;
    upvoteCount: bigint;
    authorId: bigint;
    questionId: bigint;
}
export interface TeamMember {
    id: bigint;
    permissions: Array<string>;
    name: string;
    role: string;
    lastActive: bigint;
}
export interface Question {
    id: bigint;
    title: string;
    upvoteCount: bigint;
    authorId: bigint;
    createdAt: bigint;
    description: string;
    answerCount: bigint;
    category: string;
}
export interface CreateEnrollmentInput {
    userId: bigint;
    courseId: bigint;
}
export enum AlertType {
    Pest = "Pest",
    Weather = "Weather"
}
export enum ContractType {
    None = "None",
    Phytosanitary = "Phytosanitary",
    Rental = "Rental"
}
export enum DisputeStatus {
    UnderReview = "UnderReview",
    Open = "Open",
    Escalated = "Escalated",
    Resolved = "Resolved"
}
export enum KycStatus {
    Unverified = "Unverified",
    Verified = "Verified",
    Pending = "Pending"
}
export enum KycVerificationStatus {
    Rejected = "Rejected",
    Verified = "Verified",
    Pending = "Pending"
}
export enum NotifPriority {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum NotifType {
    SystemAlert = "SystemAlert",
    Transaction = "Transaction",
    MarketIntelligence = "MarketIntelligence",
    Educational = "Educational",
    Emergency = "Emergency"
}
export enum OrderStatus {
    Disputed = "Disputed",
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum PayoutSchedule {
    Net30 = "Net30",
    Weekly = "Weekly",
    Daily = "Daily"
}
export enum ProduceCategory {
    Eggs = "Eggs",
    Grains = "Grains",
    Dairy = "Dairy",
    Vegetables = "Vegetables",
    Other = "Other",
    Fruits = "Fruits"
}
export enum SalesPeriod {
    Weekly = "Weekly",
    Daily = "Daily",
    Monthly = "Monthly",
    Yearly = "Yearly"
}
export enum SeasonalAlertType {
    Pest = "Pest",
    Price = "Price",
    Weather = "Weather"
}
export enum StreamStatus {
    Ended = "Ended",
    Live = "Live",
    Scheduled = "Scheduled"
}
export enum VerificationStatus {
    Approved = "Approved",
    Expired = "Expired",
    Pending = "Pending"
}
export interface backendInterface {
    addGroupMessage(input: AddGroupMessageInput): Promise<GroupMessage>;
    add_dispute_case(orderId: bigint, evidence: Array<string>): Promise<DisputeCase>;
    add_forum_post(author: string, title: string, body: string): Promise<ForumPost>;
    add_kyc_record(userId: bigint): Promise<KycRecord>;
    add_seller_listing(input: CreateSellerListingInput): Promise<SellerListing>;
    createCourse(input: CreateCourseInput): Promise<Course>;
    createListing(input: CreateListingInput): Promise<Listing>;
    createLiveStream(input: CreateLiveStreamInput): Promise<LiveStream>;
    createNotification(input: CreateNotificationInput): Promise<Notification>;
    createQuestion(input: CreateQuestionInput): Promise<Question>;
    createReel(input: CreateReelInput): Promise<Reel>;
    enrollInCourse(input: CreateEnrollmentInput): Promise<Enrollment>;
    getAlerts(): Promise<Array<Alert>>;
    getAnswers(questionId: bigint): Promise<Array<Answer>>;
    getCertificationsByUser(userId: bigint): Promise<Array<Certification>>;
    getConversations(userId: bigint): Promise<Array<Conversation>>;
    getCourseById(id: bigint): Promise<Course | null>;
    getCourses(): Promise<Array<Course>>;
    getDirectMessages(conversationId: bigint): Promise<Array<DirectMessage>>;
    getEducatorById(id: bigint): Promise<Educator | null>;
    getEducators(): Promise<Array<Educator>>;
    getEnrollmentsByUser(userId: bigint): Promise<Array<Enrollment>>;
    getFarmers(): Promise<Array<Farmer>>;
    getGroupMessages(groupId: bigint): Promise<Array<GroupMessage>>;
    getGroups(): Promise<Array<Group>>;
    getLessonsByCourse(courseId: bigint): Promise<Array<Lesson>>;
    getListings(): Promise<Array<Listing>>;
    getLiveStreams(): Promise<Array<LiveStream>>;
    getNotifications(userId: bigint): Promise<Array<Notification>>;
    getOrders(): Promise<Array<Order>>;
    getQA(): Promise<Array<Question>>;
    getReels(): Promise<Array<Reel>>;
    getServices(): Promise<{
        logistics: Array<LogisticsListing>;
        experts: Array<ExpertProfile>;
        machinery: Array<MachineryListing>;
    }>;
    get_dispute_cases(): Promise<Array<DisputeCase>>;
    get_equipment_guides(): Promise<Array<EquipmentGuide>>;
    get_forum_posts(): Promise<Array<ForumPost>>;
    get_inventory_items(): Promise<Array<InventoryItem>>;
    get_kyc_records(): Promise<Array<KycRecord>>;
    get_market_price_ticks(): Promise<Array<MarketPriceTick>>;
    get_market_prices(): Promise<Array<MarketPrice>>;
    get_planting_entries(): Promise<Array<PlantingEntry>>;
    get_sales_analytics(): Promise<Array<SalesAnalytics>>;
    get_seasonal_alerts(): Promise<Array<SeasonalAlert>>;
    get_seller_listing(id: bigint): Promise<SellerListing | null>;
    get_seller_listings(): Promise<Array<SellerListing>>;
    get_team_members(): Promise<Array<TeamMember>>;
    markNotificationRead(notifId: bigint): Promise<boolean>;
    sendDirectMessage(input: CreateDirectMessageInput): Promise<DirectMessage>;
    submitOrder(input: SubmitOrderInput): Promise<Order>;
    update_kyc_status(id: bigint, status: KycVerificationStatus): Promise<boolean>;
}
