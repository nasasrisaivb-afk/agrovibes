// CropVibe MVP — core domain types.
//
// Scope: Buyer + Seller marketplace only. Rental Provider, Logistics/Driver,
// Labor, Warehouse and Educator verticals are intentionally NOT modelled here.
//
// Every status enum carries a documented transition map. The service layer
// (lib/rules.mo) validates transitions against these maps — route handlers
// must never write statuses directly.
module {
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())

  // ── Roles ───────────────────────────────────────────────────────────────

  // Exact production role strings: BUYER, SELLER.
  // A user may hold both roles (`User.roles` is an array), but onboarding is
  // single-track: one role per onboarding session.
  public type UserRole = {
    #BUYER;
    #SELLER;
  };

  public type BusinessType = {
    #INDIVIDUAL;
    #REGISTERED;
  };

  // ── KYC ─────────────────────────────────────────────────────────────────

  // KycStatus transition map (user-level aggregate):
  //   NONE      → PENDING            (first document submitted)
  //   PENDING   → VERIFIED           (auto-approve above confidence threshold)
  //   PENDING   → REJECTED           (auto-reject on hard-fail condition)
  //   PENDING   → IN_REVIEW          (gray-zone score routed to manual queue)
  //   IN_REVIEW → VERIFIED           (admin approves)
  //   IN_REVIEW → REJECTED           (admin rejects with a fixed reason)
  //   REJECTED  → PENDING            (resubmission — blocked when reason is
  //                                   FRAUD_SUSPECTED, capped at
  //                                   config.kycMaxAttempts per
  //                                   config.kycAttemptWindowHours)
  // VERIFIED is terminal for MVP (no re-verification flow).
  public type KycStatus = {
    #NONE;
    #PENDING;
    #IN_REVIEW;
    #VERIFIED;
    #REJECTED;
  };

  public type KycDocType = {
    #AADHAAR;
    #PAN;
    #GST;
  };

  // Fixed rejection reason set. Frontend copy differs per reason; never
  // surface a generic "verification failed" string.
  // FRAUD_SUSPECTED is a hard block: no resubmission, route to support.
  public type KycRejectionReason = {
    #BLURRY_DOCUMENT;
    #NAME_MISMATCH;
    #SELFIE_MISMATCH;
    #EXPIRED_DOCUMENT;
    #FRAUD_SUSPECTED;
  };

  // KycDocument.status transition map (per submission):
  //   PENDING   → VERIFIED   (auto-approve)
  //   PENDING   → REJECTED   (auto-reject)
  //   PENDING   → IN_REVIEW  (routed to manual admin queue)
  //   IN_REVIEW → VERIFIED   (admin approves)
  //   IN_REVIEW → REJECTED   (admin rejects)
  // VERIFIED / REJECTED are terminal per document row. A resubmission is a
  // NEW row with isLatest=true; the prior row keeps its terminal status and
  // gets isLatest=false in the same atomic update (history preserved, admin
  // queue never shows duplicates).
  public type KycDocStatus = {
    #PENDING;
    #IN_REVIEW;
    #VERIFIED;
    #REJECTED;
  };

  public type KycDocument = {
    id : Nat;
    userId : Nat;
    docType : KycDocType;
    fileUrl : Text;
    selfieUrl : ?Text;
    status : KycDocStatus;
    // From the auto-check provider; drives priority banding in the admin
    // queue via Rules.priorityForConfidence (never set independently per row).
    confidenceScore : ?Float;
    rejectionReason : ?KycRejectionReason;
    reviewedBy : ?Nat; // admin user id
    reviewedAt : ?Timestamp;
    attemptNumber : Nat; // resubmission logic capped at config.kycMaxAttempts
    // True only for the current active submission per userId+docType.
    isLatest : Bool;
    submittedAt : Timestamp;
  };

  // ── Users ───────────────────────────────────────────────────────────────

  public type User = {
    id : Nat;
    phone : Text; // unique, normalized 10-digit Indian mobile
    name : Text;
    roles : [UserRole];
    kycStatus : KycStatus;
    kycRejectionReason : ?KycRejectionReason;
    // Buyer minimal profile
    deliveryLocation : ?Text;
    // Seller minimal profile
    businessType : ?BusinessType;
    primaryCategoryId : ?Nat; // exactly ONE category at onboarding
    createdAt : Timestamp;
  };

  // Admin employees authenticate with email + password — a fully separate
  // auth path from the consumer phone-OTP flow.
  public type AdminUser = {
    id : Nat;
    email : Text;
    name : Text;
    passwordHash : Blob; // sha256(salt # password)
    createdAt : Timestamp;
  };

  // ── Auth / sessions ─────────────────────────────────────────────────────

  public type OtpRequest = {
    requestId : Text;
    phone : Text;
    createdAt : Timestamp;
    expiresAt : Timestamp;
    verifyAttempts : Nat;
    consumed : Bool;
  };

  public type SessionKind = {
    #Consumer;
    #Admin;
  };

  public type Session = {
    token : Text;
    principalId : Nat; // User.id for #Consumer, AdminUser.id for #Admin
    kind : SessionKind;
    createdAt : Timestamp;
    expiresAt : Timestamp;
  };

  // ── Bank accounts & payouts ─────────────────────────────────────────────

  // BankAccount.verificationStatus transition map:
  //   UNVERIFIED         → PENNY_DROP_PENDING (validation triggered)
  //   PENNY_DROP_PENDING → VERIFIED           (fund-account validation passed)
  //   PENNY_DROP_PENDING → FAILED             (validation failed)
  //   FAILED             → PENNY_DROP_PENDING (retry with corrected details —
  //                                            modelled as a new row)
  public type BankVerificationStatus = {
    #UNVERIFIED;
    #PENNY_DROP_PENDING;
    #VERIFIED;
    #FAILED;
  };

  public type BankAccount = {
    id : Nat;
    userId : Nat;
    ifsc : Text;
    bankName : Text; // resolved from IFSC master, never free-typed
    branch : Text; // resolved from IFSC master, never free-typed
    // Full account number is NEVER stored — only the provider token and the
    // last 4 digits for display.
    accountNumberLast4 : Text;
    accountHolderName : Text;
    providerToken : Text; // payment-provider tokenization reference
    verificationStatus : BankVerificationStatus;
    createdAt : Timestamp;
  };

  // Payout.status transition map:
  //   SCHEDULED  → PROCESSING (hold period elapsed, payout cycle picks it up)
  //   PROCESSING → PAID       (provider confirms transfer)
  //   PROCESSING → FAILED     (provider rejects transfer)
  //   FAILED     → SCHEDULED  (retried in a later cycle)
  // Invariant enforced at the service layer: a Payout row can only ever be
  // created against a BankAccount with verificationStatus == VERIFIED.
  public type PayoutStatus = {
    #SCHEDULED;
    #PROCESSING;
    #PAID;
    #FAILED;
  };

  public type Payout = {
    id : Nat;
    userId : Nat;
    orderId : ?Nat; // nullable: payouts can be batched later
    amountInr : Nat;
    status : PayoutStatus;
    bankAccountId : Nat;
    scheduledFor : Timestamp; // completedAt + config.payoutHoldHours
    createdAt : Timestamp;
    paidAt : ?Timestamp;
  };

  // ── Catalog ─────────────────────────────────────────────────────────────

  public type AttributeFieldType = {
    #TEXT;
    #NUMBER;
    #DATE;
    #SELECT;
  };

  // Dynamic per-category form field definition. The frontend renders these
  // programmatically — adding a category never requires a frontend change.
  public type AttributeField = {
    key : Text;
    fieldLabel : Text;
    fieldType : AttributeFieldType;
    required : Bool;
    options : [Text]; // only for #SELECT
    unit : ?Text; // display hint, e.g. "%" for moistureContent
  };

  public type Category = {
    id : Nat;
    name : Text;
    parentId : ?Nat; // self-relation for subcategories
    attributeSchema : [AttributeField];
  };

  // ── Listings ────────────────────────────────────────────────────────────

  // ListingStatus transition map:
  //   DRAFT          → PENDING_REVIEW (submitted by KYC-verified seller with
  //                                    prior rejections)
  //   DRAFT          → PUBLISHED      (submitted by KYC-verified seller with a
  //                                    clean history — auto-publish)
  //   PENDING_REVIEW → PUBLISHED      (admin approves)
  //   PENDING_REVIEW → REJECTED       (admin rejects with note)
  //   PENDING_REVIEW → DRAFT          (admin requests changes)
  //   PUBLISHED      → PAUSED         (seller pauses)
  //   PAUSED         → PUBLISHED      (seller resumes)
  //   PUBLISHED      → SOLD_OUT       (stock reaches zero)
  //   SOLD_OUT       → PUBLISHED      (seller restocks)
  //   REJECTED       → DRAFT          (seller edits for resubmission)
  //   DRAFT | PAUSED | SOLD_OUT | REJECTED → ARCHIVED (seller archives)
  // ARCHIVED is terminal.
  public type ListingStatus = {
    #DRAFT;
    #PENDING_REVIEW;
    #PUBLISHED;
    #PAUSED;
    #SOLD_OUT;
    #ARCHIVED;
    #REJECTED;
  };

  public type ImageQualityFlag = {
    #BLURRY;
    #LOW_RESOLUTION;
  };

  public type ListingImage = {
    url : Text;
    order : Nat;
    qualityFlag : ?ImageQualityFlag; // set by the async image-quality check
  };

  public type Listing = {
    id : Nat;
    sellerId : Nat;
    categoryId : Nat;
    title : Text;
    description : Text;
    priceInr : Nat; // integer rupees per unit
    quantity : Nat;
    unit : Text; // e.g. "kg", "quintal", "dozen"
    status : ListingStatus;
    attributes : [(Text, Text)]; // validated against Category.attributeSchema
    location : Text;
    images : [ListingImage];
    moderationNote : ?Text; // reason on REJECTED / request-changes note
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // ── Orders & payments ───────────────────────────────────────────────────

  // OrderStatus transition map (enforced in Rules.orderTransitionAllowed —
  // every transition NOT listed here must be rejected):
  //   PLACED      → CONFIRMED
  //   PLACED      → CANCELLED
  //   CONFIRMED   → IN_PROGRESS
  //   CONFIRMED   → CANCELLED
  //   IN_PROGRESS → COMPLETED
  //   IN_PROGRESS → DISPUTED
  //   COMPLETED   → DISPUTED
  //   DISPUTED    → RESOLVED
  // CANCELLED and RESOLVED are terminal.
  // Side effects: CANCELLED → refund queued; COMPLETED → payout scheduled
  // after config.payoutHoldHours.
  public type OrderStatus = {
    #PLACED;
    #CONFIRMED;
    #IN_PROGRESS;
    #COMPLETED;
    #CANCELLED;
    #DISPUTED;
    #RESOLVED;
  };

  // Order.paymentStatus transition map:
  //   PENDING → PAID     (provider webhook confirms capture)
  //   PENDING → FAILED   (provider reports failure)
  //   PAID    → REFUNDED (order cancelled / dispute resolved with refund)
  public type PaymentStatus = {
    #PENDING;
    #PAID;
    #REFUNDED;
    #FAILED;
  };

  public type PaymentMethod = {
    #UPI;
    #CARD;
    #NETBANKING;
  };

  public type OrderEvent = {
    status : OrderStatus;
    at : Timestamp;
    note : Text;
  };

  public type Order = {
    id : Nat;
    buyerId : Nat;
    sellerId : Nat;
    listingId : Nat;
    quantity : Nat;
    totalAmountInr : Nat;
    status : OrderStatus;
    paymentStatus : PaymentStatus;
    timeline : [OrderEvent];
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // Payment.status uses PaymentStatus (map documented above).
  // idempotencyKey is the unique upsert key: replaying a webhook or retrying
  // order creation after a timeout must return the existing Payment/Order,
  // never create duplicates.
  public type Payment = {
    idempotencyKey : Text; // unique — primary key of the payments map
    orderId : ?Nat; // set once the order is created on confirmation
    provider : Text; // "RAZORPAY_SIMULATED" until live keys are wired
    providerPaymentId : Text;
    amountInr : Nat;
    status : PaymentStatus;
    method : PaymentMethod;
    // Checkout parameters captured at initiation so the webhook can create
    // the order even if the client dropped off after paying.
    buyerId : Nat;
    listingId : Nat;
    quantity : Nat;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // ── Support & notifications ─────────────────────────────────────────────

  public type TicketCategory = {
    #PAYMENTS;
    #KYC;
    #ORDER_DISPUTE;
    #ACCOUNT;
    #TECHNICAL;
  };

  // SupportTicket.status transition map:
  //   OPEN        → IN_PROGRESS (admin picks up)
  //   IN_PROGRESS → RESOLVED
  //   RESOLVED    → CLOSED
  //   OPEN        → CLOSED      (duplicate / invalid)
  public type TicketStatus = {
    #OPEN;
    #IN_PROGRESS;
    #RESOLVED;
    #CLOSED;
  };

  public type Priority = {
    #HIGH;
    #MEDIUM;
    #LOW;
  };

  public type SupportTicket = {
    id : Nat;
    userId : Nat;
    category : TicketCategory;
    status : TicketStatus;
    priority : Priority;
    assignedAdminId : ?Nat;
    subject : Text;
    body : Text;
    createdAt : Timestamp;
  };

  public type NotificationType = {
    #ORDER_UPDATE;
    #KYC_UPDATE;
    #PAYOUT_UPDATE;
    #LISTING_UPDATE;
    #SYSTEM;
  };

  public type NotificationPayload = {
    orderId : ?Nat;
    listingId : ?Nat;
    kycDocumentId : ?Nat;
    payoutId : ?Nat;
  };

  public type Notification = {
    id : Nat;
    userId : Nat;
    notificationType : NotificationType;
    title : Text;
    body : Text;
    payload : NotificationPayload;
    read : Bool;
    createdAt : Timestamp;
  };

  // ── Config (single source for business rules — never hardcode) ─────────

  public type Environment = {
    #Development;
    #Production;
  };

  public type AppConfig = {
    environment : Environment;
    // Checkout above this amount requires VERIFIED KYC.
    kycCheckoutThresholdInr : Nat;
    // Payout scheduled at order completion + this hold period.
    payoutHoldHours : Nat;
    // OTP send rate limit: max sends per window per phone number.
    otpRateLimitMax : Nat;
    otpRateLimitWindowSecs : Nat;
    otpExpirySecs : Nat;
    // KYC resubmission cap: attempts per rolling window.
    kycMaxAttempts : Nat;
    kycAttemptWindowHours : Nat;
    // Auto-approve at/above this provider confidence score.
    kycAutoApproveThreshold : Float;
    // Priority banding for the manual review queue (shared function input).
    kycPriorityHighBelow : Float; // score <  this → HIGH priority
    kycPriorityMediumBelow : Float; // score <  this → MEDIUM, else LOW
    // Platform commission deducted from seller payouts, in basis points.
    commissionBps : Nat;
    sessionTtlHours : Nat;
  };

  // ── Structured API errors ───────────────────────────────────────────────

  // Structured KYC-gate payload: the frontend uses this to open the KYC flow
  // modal (or the "verification in progress" notice) instead of a generic
  // error page.
  public type KycGateInfo = {
    kycStatus : KycStatus;
    rejectionReason : ?KycRejectionReason;
    canResubmit : Bool; // false when FRAUD_SUSPECTED → route to support
    message : Text;
  };

  public type ApiError = {
    #Unauthorized : Text; // missing/expired session
    #Forbidden : Text; // authenticated but not the owner/authorized party
    #KycRequired : KycGateInfo; // 403-equivalent, opens KYC modal
    #KycInProgress : KycGateInfo; // review active, resubmission blocked
    #NotFound : Text;
    #InvalidInput : Text;
    #RateLimited : { retryAfterSecs : Nat; message : Text };
    #Conflict : Text;
    #InvalidTransition : { fromStatus : Text; toStatus : Text; message : Text };
    #ProviderUnavailable : Text; // e.g. live SMS/KYC provider not configured
  };
};
