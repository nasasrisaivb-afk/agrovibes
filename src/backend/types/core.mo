module {
  // ── Enums ──────────────────────────────────────────────────────────────────

  public type KycStatus = {
    #Unverified;
    #Pending;
    #Verified;
  };

  public type ProduceCategory = {
    #Vegetables;
    #Fruits;
    #Grains;
    #Dairy;
    #Eggs;
    #Other;
  };

  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Shipped;
    #Delivered;
    #Disputed;
  };

  public type AlertType = {
    #Weather;
    #Pest;
  };

  public type AlertSeverity = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  // ── Farmer / Profile ──────────────────────────────────────────────────────

  public type Farmer = {
    id : Nat;
    name : Text;
    avatarUrl : Text;
    location : Text;
    kycStatus : KycStatus;
    rating : Float;
    numListings : Nat;
    bio : Text;
  };

  // ── Produce Listings ──────────────────────────────────────────────────────

  public type Listing = {
    id : Nat;
    farmerId : Nat;
    name : Text;
    category : ProduceCategory;
    price : Float;
    imageUrl : Text;
    description : Text;
    rating : Float;
    escrowEnabled : Bool;
    createdAt : Int;
  };

  // ── Reels ─────────────────────────────────────────────────────────────────

  public type Reel = {
    id : Nat;
    farmerId : Nat;
    title : Text;
    thumbnailUrl : Text;
    viewCount : Nat;
    linkedListingId : ?Nat;
  };

  // ── Q&A ───────────────────────────────────────────────────────────────────

  public type Question = {
    id : Nat;
    authorId : Nat;
    title : Text;
    description : Text;
    category : Text;
    answerCount : Nat;
    upvoteCount : Nat;
    createdAt : Int;
  };

  public type Answer = {
    id : Nat;
    questionId : Nat;
    authorId : Nat;
    content : Text;
    upvoteCount : Nat;
  };

  // ── Community Groups ──────────────────────────────────────────────────────

  public type Group = {
    id : Nat;
    name : Text;
    description : Text;
    memberCount : Nat;
    iconUrl : Text;
  };

  public type GroupMessage = {
    id : Nat;
    groupId : Nat;
    authorId : Nat;
    content : Text;
    isVoiceMessage : Bool;
    timestamp : Int;
  };

  // ── Services ──────────────────────────────────────────────────────────────

  public type MachineryListing = {
    id : Nat;
    name : Text;
    category : Text;
    dailyRate : Float;
    ownerId : Nat;
    imageUrl : Text;
    available : Bool;
  };

  public type LogisticsListing = {
    id : Nat;
    providerName : Text;
    ratePerKm : Float;
    serviceArea : Text;
    imageUrl : Text;
  };

  public type ExpertProfile = {
    id : Nat;
    name : Text;
    specialty : Text;
    hourlyRate : Float;
    available : Bool;
    imageUrl : Text;
  };

  // ── Alerts ────────────────────────────────────────────────────────────────

  public type Alert = {
    id : Nat;
    alertType : AlertType;
    title : Text;
    location : Text;
    severity : AlertSeverity;
    description : Text;
    timestamp : Int;
  };

  // ── Orders ────────────────────────────────────────────────────────────────

  public type Order = {
    id : Nat;
    buyerId : Nat;
    listingId : Nat;
    quantity : Nat;
    total : Float;
    status : OrderStatus;
    createdAt : Int;
  };

  // ── Input types (for mutations) ───────────────────────────────────────────

  public type CreateListingInput = {
    farmerId : Nat;
    name : Text;
    category : ProduceCategory;
    price : Float;
    imageUrl : Text;
    description : Text;
    escrowEnabled : Bool;
  };

  public type CreateReelInput = {
    farmerId : Nat;
    title : Text;
    thumbnailUrl : Text;
    linkedListingId : ?Nat;
  };

  public type CreateQuestionInput = {
    authorId : Nat;
    title : Text;
    description : Text;
    category : Text;
  };

  public type SubmitOrderInput = {
    buyerId : Nat;
    listingId : Nat;
    quantity : Nat;
    total : Float;
  };

  public type AddGroupMessageInput = {
    groupId : Nat;
    authorId : Nat;
    content : Text;
    isVoiceMessage : Bool;
  };

  // ── Roles ─────────────────────────────────────────────────────────────────

  public type UserRole = {
    #Farmer;
    #Buyer;
    #Educator;
    #MachineryOwner;
    #ServiceProvider;
  };

  // ── Courses & Learning ────────────────────────────────────────────────────

  public type Course = {
    id : Nat;
    educatorId : Nat;
    title : Text;
    description : Text;
    category : Text;
    level : Text;
    durationMinutes : Nat;
    price : Float;
    thumbnailUrl : Text;
    enrollmentCount : Nat;
    rating : Float;
    isCertified : Bool;
    createdAt : Int;
  };

  public type Lesson = {
    id : Nat;
    courseId : Nat;
    title : Text;
    content : Text;
    videoUrl : Text;
    durationMinutes : Nat;
    order : Nat;
  };

  public type Enrollment = {
    id : Nat;
    userId : Nat;
    courseId : Nat;
    progress : Float;
    completedAt : ?Int;
    enrolledAt : Int;
  };

  public type Certification = {
    id : Nat;
    userId : Nat;
    courseId : Nat;
    title : Text;
    issuedAt : Int;
    badgeUrl : Text;
  };

  public type Educator = {
    id : Nat;
    name : Text;
    bio : Text;
    avatarUrl : Text;
    specialty : Text;
    rating : Float;
    studentCount : Nat;
    courseCount : Nat;
    kycStatus : KycStatus;
  };

  // ── Live Streams ──────────────────────────────────────────────────────────

  public type StreamStatus = {
    #Scheduled;
    #Live;
    #Ended;
  };

  public type LiveStream = {
    id : Nat;
    hostId : Nat;
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    status : StreamStatus;
    viewerCount : Nat;
    scheduledAt : Int;
    startedAt : ?Int;
    endedAt : ?Int;
  };

  // ── Direct Messaging ──────────────────────────────────────────────────────

  public type DirectMessage = {
    id : Nat;
    senderId : Nat;
    receiverId : Nat;
    content : Text;
    isVoiceMessage : Bool;
    timestamp : Int;
    isRead : Bool;
  };

  public type Conversation = {
    id : Nat;
    participantIds : [Nat];
    lastMessage : Text;
    lastMessageAt : Int;
    unreadCount : Nat;
  };

  // ── Notifications ─────────────────────────────────────────────────────────

  public type NotifType = {
    #Transaction;
    #Educational;
    #MarketIntelligence;
    #SystemAlert;
    #Emergency;
  };

  public type NotifPriority = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  public type Notification = {
    id : Nat;
    userId : Nat;
    notifType : NotifType;
    title : Text;
    body : Text;
    isRead : Bool;
    createdAt : Int;
    priority : NotifPriority;
  };

  // ── Input Types (mutations) ───────────────────────────────────────────────

  public type CreateCourseInput = {
    educatorId : Nat;
    title : Text;
    description : Text;
    category : Text;
    level : Text;
    durationMinutes : Nat;
    price : Float;
    thumbnailUrl : Text;
    isCertified : Bool;
  };

  public type CreateEnrollmentInput = {
    userId : Nat;
    courseId : Nat;
  };

  public type CreateDirectMessageInput = {
    senderId : Nat;
    receiverId : Nat;
    content : Text;
    isVoiceMessage : Bool;
  };

  public type CreateNotificationInput = {
    userId : Nat;
    notifType : NotifType;
    title : Text;
    body : Text;
    priority : NotifPriority;
  };

  public type CreateLiveStreamInput = {
    hostId : Nat;
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    scheduledAt : Int;
  };

  // ── HOME & DISCOVER: Seasonal Alerts & Market Price Ticks ─────────────────

  public type SeasonalAlertType = {
    #Price;
    #Weather;
    #Pest;
  };

  public type SeasonalAlert = {
    id : Nat;
    alertType : SeasonalAlertType;
    cropName : Text;
    title : Text;
    description : Text;
    region : Text;
    severity : AlertSeverity;
    timestamp : Int;
  };

  public type MarketPriceTick = {
    id : Nat;
    cropName : Text;
    price : Float;
    changePercent : Float;
    date : Int;
  };

  // ── SELL/LIST: Extended SellerListing ─────────────────────────────────────

  public type ContractType = {
    #Phytosanitary;
    #Rental;
    #None;
  };

  public type VerificationStatus = {
    #Pending;
    #Approved;
    #Expired;
  };

  public type PayoutSchedule = {
    #Daily;
    #Weekly;
    #Net30;
  };

  public type SellerListing = {
    id : Nat;
    farmerId : Nat;
    name : Text;
    category : ProduceCategory;
    price : Float;
    imageUrl : Text;
    description : Text;
    rating : Float;
    escrowEnabled : Bool;
    createdAt : Int;
    bulkUploadBatch : Text;
    contractType : ContractType;
    verificationStatus : VerificationStatus;
    payoutSchedule : PayoutSchedule;
    certifications : [Text];
  };

  // ── DASHBOARD/ANALYTICS ───────────────────────────────────────────────────

  public type SalesPeriod = {
    #Daily;
    #Weekly;
    #Monthly;
    #Yearly;
  };

  public type SalesAnalytics = {
    id : Nat;
    cropName : Text;
    totalRevenue : Float;
    unitsSold : Nat;
    period : SalesPeriod;
  };

  public type InventoryItem = {
    id : Nat;
    listingId : Nat;
    currentStock : Nat;
    threshold : Nat;
    forecastDays : Nat;
  };

  public type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    permissions : [Text];
    lastActive : Int;
  };

  // ── TRUST & SAFETY ────────────────────────────────────────────────────────

  public type KycVerificationStatus = {
    #Pending;
    #Verified;
    #Rejected;
  };

  public type AuditEvent = {
    action : Text;
    performedBy : Text;
    timestamp : Int;
  };

  public type KycRecord = {
    id : Nat;
    userId : Nat;
    status : KycVerificationStatus;
    selfieVerified : Bool;
    idVerified : Bool;
    auditEvents : [AuditEvent];
  };

  public type DisputeStatus = {
    #Open;
    #UnderReview;
    #Resolved;
    #Escalated;
  };

  public type DisputeEvent = {
    event : Text;
    timestamp : Int;
    performedBy : Text;
  };

  public type DisputeCase = {
    id : Nat;
    orderId : Nat;
    status : DisputeStatus;
    evidence : [Text];
    timeline : [DisputeEvent];
    resolution : ?Text;
  };

  // ── RESOURCES ─────────────────────────────────────────────────────────────

  public type PlantingEntry = {
    id : Nat;
    cropName : Text;
    plantDate : Int;
    harvestDate : Int;
    notes : Text;
  };

  public type MarketPrice = {
    id : Nat;
    crop : Text;
    region : Text;
    bidPrice : Float;
    askPrice : Float;
    date : Int;
  };

  public type MaintenanceEntry = {
    date : Int;
    description : Text;
    technician : Text;
  };

  public type EquipmentGuide = {
    id : Nat;
    equipmentName : Text;
    maintenanceLog : [MaintenanceEntry];
    compatibility : [Text];
  };

  public type ForumReply = {
    author : Text;
    body : Text;
    timestamp : Int;
  };

  public type ForumPost = {
    id : Nat;
    author : Text;
    title : Text;
    body : Text;
    replies : [ForumReply];
    upvotes : Nat;
  };

  // ── Input Types for new domain endpoints ──────────────────────────────────

  public type CreateSellerListingInput = {
    farmerId : Nat;
    name : Text;
    category : ProduceCategory;
    price : Float;
    imageUrl : Text;
    description : Text;
    escrowEnabled : Bool;
    bulkUploadBatch : Text;
    contractType : ContractType;
    verificationStatus : VerificationStatus;
    payoutSchedule : PayoutSchedule;
    certifications : [Text];
  };
};
