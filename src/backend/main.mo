// CropVibe MVP — marketplace canister.
//
// Scope: Buyer + Seller roles only (produce/inputs marketplace core loop).
// Rental Provider, Logistics/Driver, Labor, Warehouse and Educator verticals
// are explicitly out of scope for this build.
//
// Layering:
//   types/core.mo   — data model + documented status transition maps
//   lib/rules.mo    — pure domain rules (state machines, gating, banding)
//   lib/payments.mo — idempotent checkout confirmation service
//   lib/seed.mo     — development seed data + default config
//   main.mo         — stateful API surface, sessions, authorization
import Types "types/core";
import Rules "lib/rules";
import Payments "lib/payments";
import Seed "lib/seed";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import CoreTypes "mo:core/Types";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Random "mo:core/Random";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ── Persistent state ───────────────────────────────────────────────────

  let users = Map.empty<Nat, Types.User>();
  let usersByPhone = Map.empty<Text, Nat>();
  let admins = Map.empty<Nat, Types.AdminUser>();
  let adminsByEmail = Map.empty<Text, Nat>();
  let sessions = Map.empty<Text, Types.Session>();
  let otpRequests = Map.empty<Text, Types.OtpRequest>();
  let otpSendLog = Map.empty<Text, [Types.Timestamp]>();
  let categories = Map.empty<Nat, Types.Category>();
  let listings = Map.empty<Nat, Types.Listing>();
  let kycDocuments = Map.empty<Nat, Types.KycDocument>();
  let bankAccounts = Map.empty<Nat, Types.BankAccount>();
  let orders = Map.empty<Nat, Types.Order>();
  let payments = Map.empty<Text, Types.Payment>(); // keyed by idempotencyKey
  let payouts = Map.empty<Nat, Types.Payout>();
  let supportTickets = Map.empty<Nat, Types.SupportTicket>();
  let notifications = Map.empty<Nat, Types.Notification>();
  let ifscDirectory = Map.empty<Text, { bankName : Text; branch : Text }>();
  // Sellers with at least one moderation rejection — drives the
  // "clean history auto-publish" decision.
  let sellerRejectionCounts = Map.empty<Nat, Nat>();

  var config : Types.AppConfig = Seed.defaultConfig();

  var nextUserId : Nat = 4;
  var nextListingId : Nat = 4;
  var nextKycDocumentId : Nat = 2;
  var nextBankAccountId : Nat = 2;
  var nextOrderId : Nat = 1;
  var nextPayoutId : Nat = 1;
  var nextTicketId : Nat = 1;
  var nextNotificationId : Nat = 1;
  var simCounter : Nat = 1;

  do {
    let now = Time.now();
    Seed.seedCategories(categories);
    Seed.seedIfscDirectory(ifscDirectory);
    Seed.seedUsers(users, usersByPhone, now);
    Seed.seedAdmins(admins, adminsByEmail, now);
    Seed.seedKycDocuments(kycDocuments, now);
    Seed.seedBankAccounts(bankAccounts, now);
    Seed.seedListings(listings, now);
  };

  // ── API view types ─────────────────────────────────────────────────────

  public type SendOtpResult = {
    requestId : Text;
    expiresInSecs : Nat;
  };

  public type VerifyOtpResult = {
    sessionToken : Text;
    isNewUser : Bool;
    user : Types.User;
  };

  public type OnboardingProfile = {
    #Buyer : { name : Text; deliveryLocation : Text };
    #Seller : {
      name : Text;
      businessType : Types.BusinessType;
      primaryCategoryId : Nat;
    };
  };

  public type MeView = {
    user : Types.User;
    unreadNotifications : Nat;
    hasVerifiedBankAccount : Bool;
  };

  public type PublicConfig = {
    environment : Types.Environment;
    kycCheckoutThresholdInr : Nat;
    payoutHoldHours : Nat;
    otpRateLimitMax : Nat;
    otpRateLimitWindowSecs : Nat;
    otpExpirySecs : Nat;
    kycMaxAttempts : Nat;
    kycAttemptWindowHours : Nat;
    commissionBps : Nat;
  };

  public type ListingInput = {
    categoryId : Nat;
    title : Text;
    description : Text;
    priceInr : Nat;
    quantity : Nat;
    unit : Text;
    attributes : [(Text, Text)];
    location : Text;
    images : [Types.ListingImage];
  };

  public type PublicListing = {
    id : Nat;
    title : Text;
    description : Text;
    priceInr : Nat;
    quantity : Nat;
    unit : Text;
    categoryId : Nat;
    categoryName : Text;
    location : Text;
    images : [Types.ListingImage];
    attributes : [(Text, Text)];
    sellerId : Nat;
    sellerName : Text;
    sellerKycVerified : Bool;
    status : Types.ListingStatus;
    createdAt : Types.Timestamp;
  };

  public type BrowseFilter = {
    categoryId : ?Nat;
    search : ?Text;
  };

  public type KycSubmission = {
    docType : Types.KycDocType;
    fileUrl : Text;
    selfieUrl : ?Text;
  };

  public type KycState = {
    status : Types.KycStatus;
    rejectionReason : ?Types.KycRejectionReason;
    canResubmit : Bool;
    attemptsUsedInWindow : Nat;
    maxAttempts : Nat;
    documents : [Types.KycDocument];
  };

  public type BankAccountInput = {
    ifsc : Text;
    accountNumber : Text;
    confirmAccountNumber : Text;
    accountHolderName : Text;
  };

  public type CheckoutInput = {
    listingId : Nat;
    quantity : Nat;
    method : Types.PaymentMethod;
    idempotencyKey : Text;
  };

  public type CheckoutIntent = {
    payment : Types.Payment;
    listingTitle : Text;
  };

  public type OrderView = {
    order : Types.Order;
    listingTitle : Text;
    listingImageUrl : ?Text;
    listingUnit : Text;
    buyerName : Text;
    sellerName : Text;
  };

  public type ConfirmCheckoutResult = {
    payment : Types.Payment;
    order : ?OrderView;
  };

  public type TicketInput = {
    category : Types.TicketCategory;
    subject : Text;
    body : Text;
  };

  public type AdminLoginResult = {
    token : Text;
    adminId : Nat;
    name : Text;
    email : Text;
  };

  public type KycQueueRow = {
    document : Types.KycDocument;
    applicantName : Text;
    applicantPhone : Text;
    applicantRoles : [Types.UserRole];
    priority : Types.Priority;
  };

  public type ModerationRow = {
    listing : Types.Listing;
    sellerName : Text;
    sellerKycStatus : Types.KycStatus;
    categoryName : Text;
  };

  public type ModerationAction = {
    #Approve;
    #Reject : Text;
    #RequestChanges : Text;
  };

  public type DisputeOutcome = {
    #RefundBuyer;
    #ReleaseToSeller;
  };

  public type ReportRange = {
    fromNs : Types.Timestamp;
    toNs : Types.Timestamp;
  };

  public type Reports = {
    fromNs : Types.Timestamp;
    toNs : Types.Timestamp;
    gmvInr : Nat;
    orderCount : Nat;
    refundedOrderCount : Nat;
    activeUserCount : Nat;
    newUserCount : Nat;
    totalUserCount : Nat;
    newListingCount : Nat;
    publishedListingCount : Nat;
    payoutPaidInr : Nat;
  };

  // ── Small helpers ──────────────────────────────────────────────────────

  func blobToHex(b : Blob) : Text {
    let digits = "0123456789abcdef";
    let digitChars = digits.toArray();
    var out = "";
    for (byte in b.toArray().vals()) {
      let n = byte.toNat();
      out #= Text.fromChar(digitChars[n / 16]) # Text.fromChar(digitChars[n % 16]);
    };
    out;
  };

  // Session/request tokens use IC raw randomness (management canister).
  func newToken(prefix : Text) : async Text {
    let entropy = await Random.blob();
    prefix # "_" # blobToHex(entropy);
  };

  func normalizePhone(raw : Text) : ?Text {
    var digits = "";
    for (c in raw.chars()) {
      if (c >= '0' and c <= '9') digits #= Text.fromChar(c);
    };
    var p = digits;
    if (p.size() == 12 and p.startsWith(#text "91")) {
      p := p.trimStart(#text "91");
    } else if (p.size() == 11 and p.startsWith(#text "0")) {
      p := p.trimStart(#text "0");
    };
    if (p.size() != 10) return null;
    switch (p.chars().next()) {
      case (?c) if (c >= '6' and c <= '9') ?p else null;
      case (null) null;
    };
  };

  func isNumericText(t : Text) : Bool {
    var digitSeen = false;
    var dotSeen = false;
    var i = 0;
    for (c in t.chars()) {
      if (c >= '0' and c <= '9') {
        digitSeen := true;
      } else if (c == '.') {
        if (dotSeen) return false;
        dotSeen := true;
      } else if (c == '-') {
        if (i != 0) return false;
      } else {
        return false;
      };
      i += 1;
    };
    digitSeen;
  };

  func isDateText(t : Text) : Bool {
    // Light YYYY-MM-DD shape check.
    if (t.size() != 10) return false;
    let chars = t.toArray();
    var i = 0;
    while (i < 10) {
      if (i == 4 or i == 7) {
        if (chars[i] != '-') return false;
      } else if (chars[i] < '0' or chars[i] > '9') {
        return false;
      };
      i += 1;
    };
    true;
  };

  func hasRole(user : Types.User, role : Types.UserRole) : Bool {
    for (r in user.roles.vals()) {
      if (r == role) return true;
    };
    false;
  };

  func categoryName(id : Nat) : Text {
    switch (categories.get(id)) {
      case (?c) c.name;
      case (null) "Unknown";
    };
  };

  func userName(id : Nat) : Text {
    switch (users.get(id)) {
      case (?u) if (u.name == "") "CropVibe user" else u.name;
      case (null) "Unknown user";
    };
  };

  func notify(
    userId : Nat,
    notificationType : Types.NotificationType,
    title : Text,
    body : Text,
    payload : Types.NotificationPayload,
  ) {
    let id = nextNotificationId;
    nextNotificationId += 1;
    notifications.add(id,
      {
        id;
        userId;
        notificationType;
        title;
        body;
        payload;
        read = false;
        createdAt = Time.now();
      },
    );
  };

  func emptyPayload() : Types.NotificationPayload {
    { orderId = null; listingId = null; kycDocumentId = null; payoutId = null };
  };

  // ── Authorization helpers (assertOwnsResource pattern) ────────────────
  //
  // Every mutation goes through authConsumer/authAdmin plus an ownership
  // check against the specific resource — a valid session alone is never
  // sufficient.

  func getSession(token : Text) : ?Types.Session {
    switch (sessions.get(token)) {
      case (null) null;
      case (?s) {
        if (Time.now() > s.expiresAt) {
          sessions.remove(token);
          null;
        } else ?s;
      };
    };
  };

  func authConsumer(token : Text) : CoreTypes.Result<Types.User, Types.ApiError> {
    switch (getSession(token)) {
      case (null) #err(#Unauthorized("Your session has expired. Please sign in again."));
      case (?s) {
        switch (s.kind) {
          case (#Admin) #err(#Forbidden("Admin sessions cannot access consumer endpoints."));
          case (#Consumer) {
            switch (users.get(s.principalId)) {
              case (null) #err(#Unauthorized("Account not found. Please sign in again."));
              case (?u) #ok(u);
            };
          };
        };
      };
    };
  };

  func authAdmin(token : Text) : CoreTypes.Result<Types.AdminUser, Types.ApiError> {
    switch (getSession(token)) {
      case (null) #err(#Unauthorized("Your admin session has expired. Please sign in again."));
      case (?s) {
        switch (s.kind) {
          case (#Consumer) #err(#Forbidden("This action requires an employee admin account."));
          case (#Admin) {
            switch (admins.get(s.principalId)) {
              case (null) #err(#Unauthorized("Admin account not found."));
              case (?a) #ok(a);
            };
          };
        };
      };
    };
  };

  func assertOwnsListing(user : Types.User, listing : Types.Listing) : CoreTypes.Result<(), Types.ApiError> {
    if (listing.sellerId == user.id) #ok(()) else #err(#Forbidden("You can only manage your own listings."));
  };

  func assertPartyToOrder(user : Types.User, order : Types.Order) : CoreTypes.Result<(), Types.ApiError> {
    if (order.buyerId == user.id or order.sellerId == user.id) #ok(()) else #err(#Forbidden("You are not a party to this order."));
  };

  // ── Public config & catalog ────────────────────────────────────────────

  public query func getPublicConfig() : async PublicConfig {
    {
      environment = config.environment;
      kycCheckoutThresholdInr = config.kycCheckoutThresholdInr;
      payoutHoldHours = config.payoutHoldHours;
      otpRateLimitMax = config.otpRateLimitMax;
      otpRateLimitWindowSecs = config.otpRateLimitWindowSecs;
      otpExpirySecs = config.otpExpirySecs;
      kycMaxAttempts = config.kycMaxAttempts;
      kycAttemptWindowHours = config.kycAttemptWindowHours;
      commissionBps = config.commissionBps;
    };
  };

  public query func getCategories() : async [Types.Category] {
    let out = List.empty<Types.Category>();
    for (c in categories.values()) out.add(c);
    out.sort(func(a : Types.Category, b : Types.Category) : Order.Order = Nat.compare(a.id, b.id)).toArray();
  };

  func toPublicListing(l : Types.Listing) : PublicListing {
    let sellerVerified = switch (users.get(l.sellerId)) {
      case (?u) u.kycStatus == #VERIFIED;
      case (null) false;
    };
    {
      id = l.id;
      title = l.title;
      description = l.description;
      priceInr = l.priceInr;
      quantity = l.quantity;
      unit = l.unit;
      categoryId = l.categoryId;
      categoryName = categoryName(l.categoryId);
      location = l.location;
      images = l.images;
      attributes = l.attributes;
      sellerId = l.sellerId;
      sellerName = userName(l.sellerId);
      sellerKycVerified = sellerVerified;
      status = l.status;
      createdAt = l.createdAt;
    };
  };

  public query func browseListings(filter : BrowseFilter) : async [PublicListing] {
    let out = List.empty<PublicListing>();
    let searchLower = switch (filter.search) {
      case (null) null;
      case (?s) if (s.toLower() == "") null else ?s.toLower();
    };
    for (l in listings.values()) {
      if (l.status == #PUBLISHED) {
        let categoryOk = switch (filter.categoryId) {
          case (null) true;
          case (?cid) l.categoryId == cid;
        };
        let searchOk = switch (searchLower) {
          case (null) true;
          case (?s) {
            l.title.toLower().contains(#text s) or l.description.toLower().contains(#text s) or l.location.toLower().contains(#text s);
          };
        };
        if (categoryOk and searchOk) out.add(toPublicListing(l));
      };
    };
    out.sort(func(a : PublicListing, b : PublicListing) : Order.Order = Int.compare(b.createdAt, a.createdAt)).toArray();
  };

  public query func getListingDetail(listingId : Nat) : async CoreTypes.Result<PublicListing, Types.ApiError> {
    switch (listings.get(listingId)) {
      case (null) #err(#NotFound("This listing does not exist or was removed."));
      case (?l) {
        switch (l.status) {
          case (#PUBLISHED) #ok(toPublicListing(l));
          case (#SOLD_OUT) #ok(toPublicListing(l));
          case (_) #err(#NotFound("This listing is not available right now."));
        };
      };
    };
  };

  // ── Auth: phone OTP ────────────────────────────────────────────────────

  public shared func sendOtp(phoneRaw : Text) : async CoreTypes.Result<SendOtpResult, Types.ApiError> {
    let phone = switch (normalizePhone(phoneRaw)) {
      case (null) return #err(#InvalidInput("Enter a valid 10-digit Indian mobile number starting with 6-9."));
      case (?p) p;
    };
    let now = Time.now();
    let previous = switch (otpSendLog.get(phone)) {
      case (null) [];
      case (?l) l;
    };
    switch (Rules.otpSendAllowed(previous, now, config.otpRateLimitMax, config.otpRateLimitWindowSecs)) {
      case (#Limited({ retryAfterSecs })) {
        return #err(#RateLimited({ retryAfterSecs; message = "Too many OTP requests for this number. Try again in " # retryAfterSecs.toText() # " seconds." }));
      };
      case (#Allowed) {};
    };
    // Record the send BEFORE the async token generation so parallel calls
    // cannot slip past the rate limit while this one awaits.
    otpSendLog.add(phone, previous.concat([now]));

    switch (config.environment) {
      case (#Production) {
        // Live SMS delivery goes through MSG91 (see .env.example). Until the
        // provider credentials are configured, production sends must fail
        // loudly rather than silently accepting a dev code.
        return #err(#ProviderUnavailable("SMS provider is not configured for production. Set MSG91 credentials."));
      };
      case (#Development) {};
    };

    let requestId = await newToken("otp");
    let request : Types.OtpRequest = {
      requestId;
      phone;
      createdAt = now;
      expiresAt = now + Int.fromNat(config.otpExpirySecs) * 1_000_000_000;
      verifyAttempts = 0;
      consumed = false;
    };
    otpRequests.add(requestId, request);
    // The OTP itself is NEVER returned by the API. In Development, the fixed
    // test code 000000 is accepted (documented in lib/seed.mo).
    #ok({ requestId; expiresInSecs = config.otpExpirySecs });
  };

  public shared func verifyOtp(phoneRaw : Text, otp : Text, requestId : Text) : async CoreTypes.Result<VerifyOtpResult, Types.ApiError> {
    let phone = switch (normalizePhone(phoneRaw)) {
      case (null) return #err(#InvalidInput("Enter a valid 10-digit Indian mobile number."));
      case (?p) p;
    };
    let request = switch (otpRequests.get(requestId)) {
      case (null) return #err(#NotFound("This verification request has expired. Request a new OTP."));
      case (?r) r;
    };
    if (request.consumed) {
      return #err(#Conflict("This OTP was already used. Request a new one."));
    };
    if (request.phone != phone) {
      return #err(#InvalidInput("This OTP was issued for a different number."));
    };
    let now = Time.now();
    if (now > request.expiresAt) {
      return #err(#Conflict("This OTP has expired. Request a new one."));
    };
    if (request.verifyAttempts >= 5) {
      return #err(#RateLimited({ retryAfterSecs = 60; message = "Too many incorrect attempts. Request a new OTP." }));
    };
    otpRequests.add(requestId, { request with verifyAttempts = request.verifyAttempts + 1 });

    let codeOk = switch (config.environment) {
      case (#Development) otp == "000000";
      case (#Production) false; // requires live MSG91 verify integration
    };
    if (config.environment == #Production) {
      return #err(#ProviderUnavailable("OTP verification provider is not configured for production."));
    };
    if (not codeOk) {
      return #err(#InvalidInput("Incorrect OTP. Check the code and try again."));
    };

    let token = await newToken("sess");
    // Re-check consumption after the await (double-submit race).
    switch (otpRequests.get(requestId)) {
      case (?r) {
        if (r.consumed) return #err(#Conflict("This OTP was already used. Request a new one."));
        otpRequests.add(requestId, { r with consumed = true });
      };
      case (null) return #err(#NotFound("This verification request has expired."));
    };

    // Duplicate-number handling: an existing account is never duplicated —
    // we log the user in and report isNewUser=false so a "new signup"
    // attempt can surface "This number is already registered".
    let (user, isNewUser) = switch (usersByPhone.get(phone)) {
      case (?userId) {
        switch (users.get(userId)) {
          case (?u) (u, u.roles.size() == 0);
          case (null) return #err(#Conflict("Account record is inconsistent. Contact support."));
        };
      };
      case (null) {
        let id = nextUserId;
        nextUserId += 1;
        let newUser : Types.User = {
          id;
          phone;
          name = "";
          roles = [];
          kycStatus = #NONE;
          kycRejectionReason = null;
          deliveryLocation = null;
          businessType = null;
          primaryCategoryId = null;
          createdAt = now;
        };
        users.add(id, newUser);
        usersByPhone.add(phone, id);
        (newUser, true);
      };
    };

    let session : Types.Session = {
      token;
      principalId = user.id;
      kind = #Consumer;
      createdAt = now;
      expiresAt = now + Int.fromNat(config.sessionTtlHours) * 3_600_000_000_000;
    };
    sessions.add(token, session);
    #ok({ sessionToken = token; isNewUser; user });
  };

  public shared func completeOnboarding(token : Text, profile : OnboardingProfile) : async CoreTypes.Result<Types.User, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let updated : Types.User = switch (profile) {
      case (#Buyer({ name; deliveryLocation })) {
        if (name.trim(#char ' ') == "") return #err(#InvalidInput("Please enter your name."));
        if (deliveryLocation.trim(#char ' ') == "") return #err(#InvalidInput("Please enter your delivery location."));
        if (hasRole(user, #BUYER)) return #err(#Conflict("This account is already set up as a buyer."));
        {
          user with
          name = if (user.name == "") name else user.name;
          roles = user.roles.concat([#BUYER]);
          deliveryLocation = ?deliveryLocation;
        };
      };
      case (#Seller({ name; businessType; primaryCategoryId })) {
        if (name.trim(#char ' ') == "") return #err(#InvalidInput("Please enter your name."));
        if (hasRole(user, #SELLER)) return #err(#Conflict("This account is already set up as a seller."));
        switch (categories.get(primaryCategoryId)) {
          case (null) return #err(#InvalidInput("Pick one category you mainly sell in."));
          case (?_) {};
        };
        {
          user with
          name = if (user.name == "") name else user.name;
          roles = user.roles.concat([#SELLER]);
          businessType = ?businessType;
          primaryCategoryId = ?primaryCategoryId;
        };
      };
    };
    users.add(user.id, updated);
    #ok(updated);
  };

  public query func getMe(token : Text) : async CoreTypes.Result<MeView, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    var unread : Nat = 0;
    for (n in notifications.values()) {
      if (n.userId == user.id and not n.read) unread += 1;
    };
    var hasBank = false;
    for (b in bankAccounts.values()) {
      if (b.userId == user.id and b.verificationStatus == #VERIFIED) hasBank := true;
    };
    #ok({ user; unreadNotifications = unread; hasVerifiedBankAccount = hasBank });
  };

  public shared func logout(token : Text) : async () {
    sessions.remove(token);
  };

  // ── KYC ────────────────────────────────────────────────────────────────

  func kycRejectionCopy(reason : Types.KycRejectionReason) : Text {
    switch (reason) {
      case (#BLURRY_DOCUMENT) "Your document photo was too blurry to read. Retake it in good light with the full document in frame.";
      case (#NAME_MISMATCH) "The name on your document does not match your profile name. Update your profile or submit a matching document.";
      case (#SELFIE_MISMATCH) "Your selfie did not match the photo on the document. Retake your selfie in good light without glasses or a hat.";
      case (#EXPIRED_DOCUMENT) "The document you submitted has expired. Please submit a currently valid document.";
      case (#FRAUD_SUSPECTED) "We could not verify your identity. Please contact support to continue.";
    };
  };

  func userKycSubmissionTimes(userId : Nat, docType : Types.KycDocType) : [Types.Timestamp] {
    let out = List.empty<Types.Timestamp>();
    for (d in kycDocuments.values()) {
      if (d.userId == userId and d.docType == docType) out.add(d.submittedAt);
    };
    out.toArray();
  };

  func kycStateFor(user : Types.User) : KycState {
    let docs = List.empty<Types.KycDocument>();
    for (d in kycDocuments.values()) {
      if (d.userId == user.id) docs.add(d);
    };
    let sorted = docs.sort(func(a : Types.KycDocument, b : Types.KycDocument) : Order.Order = Int.compare(b.submittedAt, a.submittedAt));
    let now = Time.now();
    let windowNs : Int = Int.fromNat(config.kycAttemptWindowHours) * 3_600_000_000_000;
    var attemptsInWindow : Nat = 0;
    for (d in sorted.values()) {
      if (now - d.submittedAt < windowNs) attemptsInWindow += 1;
    };
    let fraudBlocked = switch (user.kycRejectionReason) {
      case (?#FRAUD_SUSPECTED) true;
      case (_) false;
    };
    let reviewActive = user.kycStatus == #PENDING or user.kycStatus == #IN_REVIEW;
    {
      status = user.kycStatus;
      rejectionReason = user.kycRejectionReason;
      canResubmit = not fraudBlocked and not reviewActive and user.kycStatus != #VERIFIED and attemptsInWindow < config.kycMaxAttempts;
      attemptsUsedInWindow = attemptsInWindow;
      maxAttempts = config.kycMaxAttempts;
      documents = sorted.toArray();
    };
  };

  public query func getKycState(token : Text) : async CoreTypes.Result<KycState, Types.ApiError> {
    switch (authConsumer(token)) {
      case (#err(e)) #err(e);
      case (#ok(user)) #ok(kycStateFor(user));
    };
  };

  public shared func submitKycDocument(token : Text, submission : KycSubmission) : async CoreTypes.Result<KycState, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    if (user.kycStatus == #VERIFIED) {
      return #err(#Conflict("Your identity is already verified."));
    };
    // No resubmission while a review is active.
    switch (Rules.kycGate(user.kycStatus, user.kycRejectionReason)) {
      case (#InProgress(info)) return #err(#KycInProgress(info));
      case (#StartKyc(info)) {
        if (not info.canResubmit) {
          // FRAUD_SUSPECTED hard block — enforced server-side, not just UI.
          return #err(#Forbidden("Verification is blocked for this account. Please contact support."));
        };
      };
      case (#Proceed) {};
    };
    if (submission.fileUrl.trim(#char ' ') == "") {
      return #err(#InvalidInput("Please attach your document photo."));
    };
    switch (submission.docType) {
      case (#GST) {};
      case (_) {
        // Aadhaar/PAN require a selfie for the liveness/face-match check.
        switch (submission.selfieUrl) {
          case (null) return #err(#InvalidInput("A selfie is required for the liveness check."));
          case (?s) if (s.trim(#char ' ') == "") return #err(#InvalidInput("A selfie is required for the liveness check."));
        };
      };
    };
    let now = Time.now();
    // Server-side attempt cap (config-driven), independent of any UI state.
    let priorTimes = userKycSubmissionTimes(user.id, submission.docType);
    if (not Rules.kycResubmissionAllowed(priorTimes, now, config.kycMaxAttempts, config.kycAttemptWindowHours)) {
      return #err(#RateLimited({ retryAfterSecs = config.kycAttemptWindowHours * 3600; message = "You have reached the limit of " # config.kycMaxAttempts.toText() # " verification attempts in " # config.kycAttemptWindowHours.toText() # " hours. Please try later or contact support." }));
    };

    // Simulated Setu/HyperVerge call — returns confidence + hard-fail flags.
    let providerResult = Rules.simulateKycProvider(submission.fileUrl, submission.selfieUrl);
    let decision = Rules.kycAutoDecision(providerResult.confidence, providerResult.hardFail, config.kycAutoApproveThreshold);

    let (docStatus, userStatus, rejection) : (Types.KycDocStatus, Types.KycStatus, ?Types.KycRejectionReason) = switch (decision) {
      case (#AutoApprove) (#VERIFIED, #VERIFIED, null);
      case (#AutoReject(reason)) (#REJECTED, #REJECTED, ?reason);
      case (#ManualReview) (#PENDING, #PENDING, null);
    };

    let docId = nextKycDocumentId;
    nextKycDocumentId += 1;
    var attemptNumber : Nat = 1;

    // Atomic single-message update: insert the new row with isLatest=true AND
    // flip isLatest=false on the prior row for this userId+docType. Never
    // insert without flipping — that is what produces duplicate rows in the
    // admin queue.
    for (d in kycDocuments.values()) {
      if (d.userId == user.id and d.docType == submission.docType) {
        if (d.attemptNumber >= attemptNumber) attemptNumber := d.attemptNumber + 1;
        if (d.isLatest) {
          kycDocuments.add(d.id, { d with isLatest = false });
        };
      };
    };

    let doc : Types.KycDocument = {
      id = docId;
      userId = user.id;
      docType = submission.docType;
      fileUrl = submission.fileUrl;
      selfieUrl = submission.selfieUrl;
      status = docStatus;
      confidenceScore = ?providerResult.confidence;
      rejectionReason = rejection;
      reviewedBy = null;
      reviewedAt = switch (decision) {
        case (#ManualReview) null;
        case (_) ?now;
      };
      attemptNumber;
      isLatest = true;
      submittedAt = now;
    };
    kycDocuments.add(docId, doc);

    let updatedUser : Types.User = {
      user with
      kycStatus = userStatus;
      kycRejectionReason = rejection;
    };
    users.add(user.id, updatedUser);

    switch (decision) {
      case (#AutoApprove) {
        notify(user.id, #KYC_UPDATE, "Identity verified", "Your identity verification is complete. You can now publish listings and make large purchases.", { emptyPayload() with kycDocumentId = ?docId });
      };
      case (#AutoReject(reason)) {
        notify(user.id, #KYC_UPDATE, "Verification rejected", kycRejectionCopy(reason), { emptyPayload() with kycDocumentId = ?docId });
      };
      case (#ManualReview) {
        notify(user.id, #KYC_UPDATE, "Verification in review", "Your documents are being reviewed, typically completed within 24 hours.", { emptyPayload() with kycDocumentId = ?docId });
      };
    };
    #ok(kycStateFor(updatedUser));
  };

  // ── Bank accounts & payouts ────────────────────────────────────────────

  public query func lookupIfsc(ifscRaw : Text) : async CoreTypes.Result<{ bankName : Text; branch : Text }, Types.ApiError> {
    let ifsc = ifscRaw.trim(#char ' ').toUpper();
    switch (ifscDirectory.get(ifsc)) {
      case (?entry) #ok(entry);
      case (null) #err(#NotFound("IFSC code not found. Check the 11-character code on your cheque book or passbook."));
    };
  };

  func sweepPayoutsForSeller(sellerId : Nat, bankAccountId : Nat) {
    // Completed orders that never got a payout (seller had no verified
    // account at completion time) are picked up once an account verifies.
    let now = Time.now();
    for (o in orders.values()) {
      if (o.sellerId == sellerId and o.status == #COMPLETED) {
        var hasPayout = false;
        for (p in payouts.values()) {
          switch (p.orderId) {
            case (?oid) if (oid == o.id) hasPayout := true;
            case (null) {};
          };
        };
        if (not hasPayout) {
          createPayoutForOrder(o, bankAccountId, now);
        };
      };
    };
  };

  func latestVerifiedBankAccount(userId : Nat) : ?Types.BankAccount {
    var best : ?Types.BankAccount = null;
    for (b in bankAccounts.values()) {
      if (b.userId == userId and Rules.payoutAccountEligible(b.verificationStatus)) {
        best := switch (best) {
          case (null) ?b;
          case (?prev) if (b.createdAt > prev.createdAt) ?b else ?prev;
        };
      };
    };
    best;
  };

  func createPayoutForOrder(order : Types.Order, bankAccountId : Nat, now : Types.Timestamp) {
    // Hard service-layer invariant: never create a payout against an
    // unverified account.
    switch (bankAccounts.get(bankAccountId)) {
      case (null) return;
      case (?account) {
        if (not Rules.payoutAccountEligible(account.verificationStatus)) return;
      };
    };
    let id = nextPayoutId;
    nextPayoutId += 1;
    let amount = Rules.sellerPayoutAmount(order.totalAmountInr, config.commissionBps);
    let payout : Types.Payout = {
      id;
      userId = order.sellerId;
      orderId = ?order.id;
      amountInr = amount;
      status = #SCHEDULED;
      bankAccountId;
      scheduledFor = Rules.payoutScheduleTime(now, config.payoutHoldHours);
      createdAt = now;
      paidAt = null;
    };
    payouts.add(id, payout);
    notify(order.sellerId, #PAYOUT_UPDATE, "Payout scheduled", "₹" # amount.toText() # " for order #" # order.id.toText() # " will be paid out after the " # config.payoutHoldHours.toText() # "-hour hold period.", { emptyPayload() with orderId = ?order.id; payoutId = ?id });
  };

  public shared func addBankAccount(token : Text, input : BankAccountInput) : async CoreTypes.Result<Types.BankAccount, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let ifsc = input.ifsc.trim(#char ' ').toUpper();
    let bank = switch (ifscDirectory.get(ifsc)) {
      case (null) return #err(#NotFound("IFSC code not found. Check the 11-character code and try again."));
      case (?b) b;
    };
    let accountNumber = input.accountNumber.trim(#char ' ');
    if (accountNumber != input.confirmAccountNumber.trim(#char ' ')) {
      return #err(#InvalidInput("The two account numbers do not match. Re-enter them carefully."));
    };
    if (accountNumber.size() < 9 or accountNumber.size() > 18 or not isNumericText(accountNumber)) {
      return #err(#InvalidInput("Enter a valid account number (9-18 digits)."));
    };
    if (input.accountHolderName.trim(#char ' ') == "") {
      return #err(#InvalidInput("Enter the account holder name exactly as per bank records."));
    };
    let now = Time.now();
    let id = nextBankAccountId;
    nextBankAccountId += 1;
    simCounter += 1;
    // Simulated Razorpay Fund Account Validation (penny drop). Test hook:
    // account numbers ending in 0000 fail validation.
    let pennyDropPassed = not accountNumber.endsWith(#text "0000");
    var last4 = "";
    let chars = accountNumber.toArray();
    var i = chars.size() - 4 : Nat;
    while (i < chars.size()) {
      last4 #= Text.fromChar(chars[i]);
      i += 1;
    };
    let account : Types.BankAccount = {
      id;
      userId = user.id;
      ifsc;
      bankName = bank.bankName;
      branch = bank.branch;
      accountNumberLast4 = last4;
      accountHolderName = input.accountHolderName;
      providerToken = "fa_sim_" # simCounter.toText();
      verificationStatus = if (pennyDropPassed) #VERIFIED else #FAILED;
      createdAt = now;
    };
    bankAccounts.add(id, account);
    if (pennyDropPassed) {
      notify(user.id, #PAYOUT_UPDATE, "Bank account verified", bank.bankName # " account ending " # last4 # " passed penny-drop verification.", emptyPayload());
      sweepPayoutsForSeller(user.id, id);
    } else {
      notify(user.id, #PAYOUT_UPDATE, "Bank verification failed", "Penny-drop verification failed for the account ending " # last4 # ". Check the details and add the account again.", emptyPayload());
    };
    #ok(account);
  };

  public query func getMyBankAccounts(token : Text) : async CoreTypes.Result<[Types.BankAccount], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<Types.BankAccount>();
    for (b in bankAccounts.values()) {
      if (b.userId == user.id) out.add(b);
    };
    #ok(out.sort(func(a : Types.BankAccount, b : Types.BankAccount) : Order.Order = Int.compare(b.createdAt, a.createdAt)).toArray());
  };

  // Update call: processes due payouts (SCHEDULED → PAID once the hold
  // period has elapsed) before returning them.
  public shared func getMyPayouts(token : Text) : async CoreTypes.Result<[Types.Payout], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    processDuePayouts(?user.id);
    let out = List.empty<Types.Payout>();
    for (p in payouts.values()) {
      if (p.userId == user.id) out.add(p);
    };
    #ok(out.sort(func(a : Types.Payout, b : Types.Payout) : Order.Order = Int.compare(b.createdAt, a.createdAt)).toArray());
  };

  func processDuePayouts(onlyUserId : ?Nat) {
    let now = Time.now();
    for (p in payouts.values()) {
      let userOk = switch (onlyUserId) {
        case (null) true;
        case (?uid) p.userId == uid;
      };
      if (userOk and p.status == #SCHEDULED and p.scheduledFor <= now) {
        // SCHEDULED → PROCESSING → PAID (simulated provider transfer).
        payouts.add(p.id, { p with status = #PAID; paidAt = ?now });
        notify(p.userId, #PAYOUT_UPDATE, "Payout paid", "₹" # p.amountInr.toText() # " has been transferred to your bank account.", { emptyPayload() with payoutId = ?p.id });
      };
    };
  };

  // ── Listings (seller) ──────────────────────────────────────────────────

  func validateAttributes(schema : [Types.AttributeField], attrs : [(Text, Text)]) : ?Text {
    func find(key : Text) : ?Text {
      for ((k, v) in attrs.vals()) {
        if (k == key) return ?v;
      };
      null;
    };
    // Unknown keys are rejected so typos never silently pass validation.
    for ((k, _) in attrs.vals()) {
      var known = false;
      for (f in schema.vals()) {
        if (f.key == k) known := true;
      };
      if (not known) return ?("Unknown attribute \"" # k # "\" for this category.");
    };
    for (f in schema.vals()) {
      switch (find(f.key)) {
        case (null) {
          if (f.required) return ?("\"" # f.fieldLabel # "\" is required for this category.");
        };
        case (?value) {
          let v = value.trim(#char ' ');
          if (v == "") {
            if (f.required) return ?("\"" # f.fieldLabel # "\" is required for this category.");
          } else {
            switch (f.fieldType) {
              case (#NUMBER) {
                if (not isNumericText(v)) return ?("\"" # f.fieldLabel # "\" must be a number.");
              };
              case (#DATE) {
                if (not isDateText(v)) return ?("\"" # f.fieldLabel # "\" must be a date in YYYY-MM-DD format.");
              };
              case (#SELECT) {
                var ok = false;
                for (o in f.options.vals()) {
                  if (o == v) ok := true;
                };
                if (not ok) return ?("\"" # v # "\" is not a valid option for \"" # f.fieldLabel # "\".");
              };
              case (#TEXT) {};
            };
          };
        };
      };
    };
    null;
  };

  func validateListingInput(input : ListingInput, forPublish : Bool) : ?Text {
    if (input.title.trim(#char ' ') == "") return ?"Add a title for your listing.";
    if (input.priceInr == 0) return ?"Set a price greater than zero.";
    if (input.unit.trim(#char ' ') == "") return ?"Choose a unit (kg, quintal, dozen…).";
    let schema = switch (categories.get(input.categoryId)) {
      case (null) return ?"Pick a valid category.";
      case (?c) c.attributeSchema;
    };
    if (forPublish) {
      if (input.images.size() == 0) return ?"Add at least one photo of your produce.";
      if (input.quantity == 0) return ?"Set the available quantity.";
      if (input.location.trim(#char ' ') == "") return ?"Add a pickup/dispatch location.";
      switch (validateAttributes(schema, input.attributes)) {
        case (?e) return ?e;
        case (null) {};
      };
    } else {
      // Drafts stay lenient, but provided attributes must still match the
      // category schema (unknown keys / bad options are rejected early).
      switch (validateAttributes(schema, input.attributes)) {
        case (?e) return ?e;
        case (null) {};
      };
    };
    null;
  };

  public shared func createListing(token : Text, input : ListingInput) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    if (not hasRole(user, #SELLER)) {
      return #err(#Forbidden("Only sellers can create listings. Add the seller role from your profile."));
    };
    switch (validateListingInput(input, false)) {
      case (?e) return #err(#InvalidInput(e));
      case (null) {};
    };
    let now = Time.now();
    let id = nextListingId;
    nextListingId += 1;
    let listing : Types.Listing = {
      id;
      sellerId = user.id;
      categoryId = input.categoryId;
      title = input.title;
      description = input.description;
      priceInr = input.priceInr;
      quantity = input.quantity;
      unit = input.unit;
      status = #DRAFT;
      attributes = input.attributes;
      location = input.location;
      images = input.images;
      moderationNote = null;
      createdAt = now;
      updatedAt = now;
    };
    listings.add(id, listing);
    #ok(listing);
  };

  public shared func updateListing(token : Text, listingId : Nat, input : ListingInput) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let listing = switch (listings.get(listingId)) {
      case (null) return #err(#NotFound("This listing does not exist."));
      case (?l) l;
    };
    switch (assertOwnsListing(user, listing)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let editable = switch (listing.status) {
      case (#DRAFT) true;
      case (#REJECTED) true;
      case (_) false;
    };
    if (not editable) {
      return #err(#Conflict("Only draft or rejected listings can be edited. Pause the listing first if it is live."));
    };
    switch (validateListingInput(input, false)) {
      case (?e) return #err(#InvalidInput(e));
      case (null) {};
    };
    let updated : Types.Listing = {
      listing with
      categoryId = input.categoryId;
      title = input.title;
      description = input.description;
      priceInr = input.priceInr;
      quantity = input.quantity;
      unit = input.unit;
      attributes = input.attributes;
      location = input.location;
      images = input.images;
      status = #DRAFT; // REJECTED → DRAFT on edit (see transition map)
      updatedAt = Time.now();
    };
    listings.add(listingId, updated);
    #ok(updated);
  };

  public shared func submitListingForPublish(token : Text, listingId : Nat) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let listing = switch (listings.get(listingId)) {
      case (null) return #err(#NotFound("This listing does not exist."));
      case (?l) l;
    };
    switch (assertOwnsListing(user, listing)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    if (listing.status != #DRAFT) {
      return #err(#Conflict("Only draft listings can be submitted for publishing."));
    };
    let input : ListingInput = {
      categoryId = listing.categoryId;
      title = listing.title;
      description = listing.description;
      priceInr = listing.priceInr;
      quantity = listing.quantity;
      unit = listing.unit;
      attributes = listing.attributes;
      location = listing.location;
      images = listing.images;
    };
    switch (validateListingInput(input, true)) {
      case (?e) return #err(#InvalidInput(e));
      case (null) {};
    };
    let hasRejections = switch (sellerRejectionCounts.get(user.id)) {
      case (?n) n > 0;
      case (null) false;
    };
    // KYC gate: unverified sellers keep the draft (never blocked from
    // drafting) and receive the structured gate payload to open the KYC flow.
    switch (Rules.listingPublishDecision(user.kycStatus, user.kycRejectionReason, hasRejections)) {
      case (#Gate(#StartKyc(info))) #err(#KycRequired(info));
      case (#Gate(#InProgress(info))) #err(#KycInProgress(info));
      case (#Gate(#Proceed)) #err(#Conflict("Unexpected gate state."));
      case (#Publish) {
        let updated = { listing with status = #PUBLISHED; updatedAt = Time.now() };
        listings.add(listingId, updated);
        notify(user.id, #LISTING_UPDATE, "Listing published", "\"" # listing.title # "\" is now live for buyers.", { emptyPayload() with listingId = ?listingId });
        #ok(updated);
      };
      case (#Review) {
        let updated = { listing with status = #PENDING_REVIEW; updatedAt = Time.now() };
        listings.add(listingId, updated);
        notify(user.id, #LISTING_UPDATE, "Listing submitted for review", "\"" # listing.title # "\" is with our moderation team and will go live after approval.", { emptyPayload() with listingId = ?listingId });
        #ok(updated);
      };
    };
  };

  public type SellerListingAction = {
    #Pause;
    #Resume;
    #Archive;
    #Restock : Nat;
  };

  public shared func manageListing(token : Text, listingId : Nat, action : SellerListingAction) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let listing = switch (listings.get(listingId)) {
      case (null) return #err(#NotFound("This listing does not exist."));
      case (?l) l;
    };
    switch (assertOwnsListing(user, listing)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let target : Types.ListingStatus = switch (action) {
      case (#Pause) #PAUSED;
      case (#Resume) #PUBLISHED;
      case (#Archive) #ARCHIVED;
      case (#Restock(_)) #PUBLISHED;
    };
    if (not Rules.listingTransitionAllowed(listing.status, target)) {
      return #err(#InvalidTransition({ fromStatus = debug_show (listing.status); toStatus = debug_show (target); message = "This change is not allowed from the listing's current state." }));
    };
    let updated : Types.Listing = switch (action) {
      case (#Restock(quantity)) {
        if (quantity == 0) return #err(#InvalidInput("Restock quantity must be greater than zero."));
        { listing with quantity; status = #PUBLISHED; updatedAt = Time.now() };
      };
      case (#Resume) {
        if (listing.quantity == 0) return #err(#Conflict("Set a restock quantity before resuming — the listing has no stock."));
        { listing with status = #PUBLISHED; updatedAt = Time.now() };
      };
      case (_) { { listing with status = target; updatedAt = Time.now() } };
    };
    listings.add(listingId, updated);
    #ok(updated);
  };

  public query func getMyListings(token : Text) : async CoreTypes.Result<[Types.Listing], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<Types.Listing>();
    for (l in listings.values()) {
      if (l.sellerId == user.id) out.add(l);
    };
    #ok(out.sort(func(a : Types.Listing, b : Types.Listing) : Order.Order = Int.compare(b.updatedAt, a.updatedAt)).toArray());
  };

  public query func getMyListing(token : Text, listingId : Nat) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let listing = switch (listings.get(listingId)) {
      case (null) return #err(#NotFound("This listing does not exist."));
      case (?l) l;
    };
    switch (assertOwnsListing(user, listing)) {
      case (#err(e)) #err(e);
      case (#ok(_)) #ok(listing);
    };
  };

  // ── Checkout & payments ────────────────────────────────────────────────

  public shared func initiateCheckout(token : Text, input : CheckoutInput) : async CoreTypes.Result<CheckoutIntent, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    if (not hasRole(user, #BUYER)) {
      return #err(#Forbidden("Only buyers can place orders. Add the buyer role from your profile."));
    };
    if (input.idempotencyKey.trim(#char ' ') == "") {
      return #err(#InvalidInput("Missing idempotency key. Refresh and try checkout again."));
    };
    // Idempotent initiation: replaying the same key returns the existing
    // intent instead of creating a duplicate Payment.
    switch (Payments.existingIntent(payments, input.idempotencyKey)) {
      case (?existing) {
        if (existing.buyerId != user.id) {
          return #err(#Forbidden("This checkout belongs to a different account."));
        };
        let title = switch (listings.get(existing.listingId)) {
          case (?l) l.title;
          case (null) "Listing";
        };
        return #ok({ payment = existing; listingTitle = title });
      };
      case (null) {};
    };
    let listing = switch (listings.get(input.listingId)) {
      case (null) return #err(#NotFound("This listing no longer exists."));
      case (?l) l;
    };
    if (listing.status != #PUBLISHED) {
      return #err(#Conflict("This listing is not available for purchase right now."));
    };
    if (listing.sellerId == user.id) {
      return #err(#Forbidden("You cannot buy your own listing."));
    };
    if (input.quantity == 0) {
      return #err(#InvalidInput("Choose a quantity of at least 1."));
    };
    if (input.quantity > listing.quantity) {
      return #err(#Conflict("Only " # listing.quantity.toText() # " " # listing.unit # " left in stock."));
    };
    let total = listing.priceInr * input.quantity;
    // Config-driven KYC gate for high-value checkouts.
    if (Rules.checkoutRequiresKyc(total, config.kycCheckoutThresholdInr)) {
      switch (Rules.kycGate(user.kycStatus, user.kycRejectionReason)) {
        case (#Proceed) {};
        case (#StartKyc(info)) return #err(#KycRequired(info));
        case (#InProgress(info)) return #err(#KycInProgress(info));
      };
    };
    let now = Time.now();
    simCounter += 1;
    let payment : Types.Payment = {
      idempotencyKey = input.idempotencyKey;
      orderId = null;
      provider = "RAZORPAY_SIMULATED";
      providerPaymentId = "pay_sim_" # simCounter.toText();
      amountInr = total;
      status = #PENDING;
      method = input.method;
      buyerId = user.id;
      listingId = listing.id;
      quantity = input.quantity;
      createdAt = now;
      updatedAt = now;
    };
    payments.add(input.idempotencyKey, payment);
    #ok({ payment; listingTitle = listing.title });
  };

  func toOrderView(order : Types.Order) : OrderView {
    let (title, image, unit) = switch (listings.get(order.listingId)) {
      case (?l) {
        let img = if (l.images.size() > 0) ?l.images[0].url else null;
        (l.title, img, l.unit);
      };
      case (null) ("Listing removed", null, "");
    };
    {
      order;
      listingTitle = title;
      listingImageUrl = image;
      listingUnit = unit;
      buyerName = userName(order.buyerId);
      sellerName = userName(order.sellerId);
    };
  };

  // Simulates the Razorpay webhook confirming (or failing) a capture.
  // Idempotent on idempotencyKey — see lib/payments.mo.
  public shared func confirmCheckout(token : Text, idempotencyKey : Text, succeed : Bool) : async CoreTypes.Result<ConfirmCheckoutResult, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    switch (Payments.existingIntent(payments, idempotencyKey)) {
      case (?p) {
        if (p.buyerId != user.id) {
          return #err(#Forbidden("This checkout belongs to a different account."));
        };
      };
      case (null) return #err(#NotFound("No payment found for this checkout. Please start again."));
    };
    let alreadyExisted = switch (Payments.existingIntent(payments, idempotencyKey)) {
      case (?p) p.status == #PAID;
      case (null) false;
    };
    switch (Payments.confirmPayment(payments, orders, listings, idempotencyKey, succeed, nextOrderId, Time.now())) {
      case (#err(e)) #err(e);
      case (#ok(outcome)) {
        nextOrderId := outcome.nextOrderId;
        switch (outcome.order) {
          case (?order) {
            if (outcome.createdOrder and not alreadyExisted) {
              notify(order.buyerId, #ORDER_UPDATE, "Order placed", "Your order #" # order.id.toText() # " is placed. The seller will confirm it shortly.", { emptyPayload() with orderId = ?order.id });
              notify(order.sellerId, #ORDER_UPDATE, "New order received", userName(order.buyerId) # " ordered " # order.quantity.toText() # " × your listing. Confirm to start fulfilment.", { emptyPayload() with orderId = ?order.id });
            };
            #ok({ payment = outcome.payment; order = ?toOrderView(order) });
          };
          case (null) #ok({ payment = outcome.payment; order = null });
        };
      };
    };
  };

  // ── Orders ─────────────────────────────────────────────────────────────

  public query func getMyOrders(token : Text) : async CoreTypes.Result<[OrderView], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<OrderView>();
    for (o in orders.values()) {
      if (o.buyerId == user.id) out.add(toOrderView(o));
    };
    #ok(out.sort(func(a : OrderView, b : OrderView) : Order.Order = Int.compare(b.order.createdAt, a.order.createdAt)).toArray());
  };

  public query func getSellerOrders(token : Text) : async CoreTypes.Result<[OrderView], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<OrderView>();
    for (o in orders.values()) {
      if (o.sellerId == user.id) out.add(toOrderView(o));
    };
    #ok(out.sort(func(a : OrderView, b : OrderView) : Order.Order = Int.compare(b.order.createdAt, a.order.createdAt)).toArray());
  };

  public query func getOrder(token : Text, orderId : Nat) : async CoreTypes.Result<OrderView, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let order = switch (orders.get(orderId)) {
      case (null) return #err(#NotFound("This order does not exist."));
      case (?o) o;
    };
    switch (assertPartyToOrder(user, order)) {
      case (#err(e)) #err(e);
      case (#ok(_)) #ok(toOrderView(order));
    };
  };

  func findPaymentForOrder(orderId : Nat) : ?Types.Payment {
    for (p in payments.values()) {
      switch (p.orderId) {
        case (?oid) if (oid == orderId) return ?p;
        case (null) {};
      };
    };
    null;
  };

  func refundOrder(order : Types.Order, now : Types.Timestamp) : Types.PaymentStatus {
    switch (findPaymentForOrder(order.id)) {
      case (?p) {
        if (p.status == #PAID) {
          payments.add(p.idempotencyKey, { p with status = #REFUNDED; updatedAt = now });
          return #REFUNDED;
        };
        p.status;
      };
      case (null) order.paymentStatus;
    };
  };

  func restoreStock(order : Types.Order, now : Types.Timestamp) {
    switch (listings.get(order.listingId)) {
      case (?l) {
        let newQuantity = l.quantity + order.quantity;
        let newStatus = if (l.status == #SOLD_OUT) #PUBLISHED else l.status;
        listings.add(l.id, { l with quantity = newQuantity; status = newStatus; updatedAt = now });
      };
      case (null) {};
    };
  };

  func applyOrderTransition(
    order : Types.Order,
    newStatus : Types.OrderStatus,
    note : Text,
    now : Types.Timestamp,
  ) : Types.Order {
    var updated : Types.Order = {
      order with
      status = newStatus;
      timeline = Payments.appendTimeline(order.timeline, { status = newStatus; at = now; note });
      updatedAt = now;
    };
    switch (newStatus) {
      case (#CANCELLED) {
        // Downstream effect: refund job + stock restoration.
        let paymentStatus = refundOrder(order, now);
        restoreStock(order, now);
        updated := { updated with paymentStatus };
        notify(order.buyerId, #ORDER_UPDATE, "Order cancelled", "Order #" # order.id.toText() # " was cancelled. " # (if (paymentStatus == #REFUNDED) "Your refund of ₹" # order.totalAmountInr.toText() # " has been initiated." else ""), { emptyPayload() with orderId = ?order.id });
        notify(order.sellerId, #ORDER_UPDATE, "Order cancelled", "Order #" # order.id.toText() # " was cancelled and stock was restored.", { emptyPayload() with orderId = ?order.id });
      };
      case (#COMPLETED) {
        // Downstream effect: payout scheduled after the configured hold.
        switch (latestVerifiedBankAccount(order.sellerId)) {
          case (?account) createPayoutForOrder(updated, account.id, now);
          case (null) {
            notify(order.sellerId, #PAYOUT_UPDATE, "Add a bank account to get paid", "Order #" # order.id.toText() # " is complete, but you have no verified bank account. Add one to receive your payout.", { emptyPayload() with orderId = ?order.id });
          };
        };
        notify(order.buyerId, #ORDER_UPDATE, "Order completed", "Order #" # order.id.toText() # " is complete. Thanks for buying on CropVibe!", { emptyPayload() with orderId = ?order.id });
        notify(order.sellerId, #ORDER_UPDATE, "Order completed", "Order #" # order.id.toText() # " is complete.", { emptyPayload() with orderId = ?order.id });
      };
      case (#DISPUTED) {
        // Auto-open a support ticket for the dispute desk.
        let ticketId = nextTicketId;
        nextTicketId += 1;
        supportTickets.add(ticketId,
          {
            id = ticketId;
            userId = order.buyerId;
            category = #ORDER_DISPUTE;
            status = #OPEN;
            priority = #HIGH;
            assignedAdminId = null;
            subject = "Dispute on order #" # order.id.toText();
            body = note;
            createdAt = now;
          },
        );
        notify(order.buyerId, #ORDER_UPDATE, "Dispute opened", "We opened a dispute for order #" # order.id.toText() # ". Our team will contact you within 24 hours.", { emptyPayload() with orderId = ?order.id });
        notify(order.sellerId, #ORDER_UPDATE, "Dispute raised", "The buyer raised a dispute on order #" # order.id.toText() # ". Our team is reviewing it.", { emptyPayload() with orderId = ?order.id });
      };
      case (#CONFIRMED) {
        notify(order.buyerId, #ORDER_UPDATE, "Order confirmed", "The seller confirmed order #" # order.id.toText() # " and is preparing it.", { emptyPayload() with orderId = ?order.id });
      };
      case (#IN_PROGRESS) {
        notify(order.buyerId, #ORDER_UPDATE, "Order on the way", "Order #" # order.id.toText() # " is being fulfilled.", { emptyPayload() with orderId = ?order.id });
      };
      case (_) {};
    };
    orders.add(order.id, updated);
    updated;
  };

  // The ONLY write path for order status. Validates against the explicit
  // transition map, then against the caller's relationship to the order.
  public shared func transitionOrderStatus(token : Text, orderId : Nat, newStatus : Types.OrderStatus) : async CoreTypes.Result<OrderView, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let order = switch (orders.get(orderId)) {
      case (null) return #err(#NotFound("This order does not exist."));
      case (?o) o;
    };
    switch (assertPartyToOrder(user, order)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    if (not Rules.orderTransitionAllowed(order.status, newStatus)) {
      return #err(#InvalidTransition({ fromStatus = Rules.orderStatusLabel(order.status); toStatus = Rules.orderStatusLabel(newStatus); message = "An order in status " # Rules.orderStatusLabel(order.status) # " cannot move to " # Rules.orderStatusLabel(newStatus) # "." }));
    };
    let asBuyer = order.buyerId == user.id and Rules.actorMayTransition(#Buyer, order.status, newStatus);
    let asSeller = order.sellerId == user.id and Rules.actorMayTransition(#Seller, order.status, newStatus);
    if (not asBuyer and not asSeller) {
      return #err(#Forbidden("You are not allowed to make this change on this order."));
    };
    let actorName = if (asBuyer) "buyer" else "seller";
    let updated = applyOrderTransition(order, newStatus, "Status changed by " # actorName, Time.now());
    #ok(toOrderView(updated));
  };

  // ── Notifications ──────────────────────────────────────────────────────

  public query func getMyNotifications(token : Text) : async CoreTypes.Result<[Types.Notification], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<Types.Notification>();
    for (n in notifications.values()) {
      if (n.userId == user.id) out.add(n);
    };
    let sorted = out.sort(func(a : Types.Notification, b : Types.Notification) : Order.Order = Int.compare(b.createdAt, a.createdAt));
    let arr = sorted.toArray();
    #ok(if (arr.size() > 100) arr.sliceToArray(0, 100) else arr);
  };

  public shared func markNotificationRead(token : Text, notificationId : Nat) : async CoreTypes.Result<(), Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    switch (notifications.get(notificationId)) {
      case (null) #err(#NotFound("Notification not found."));
      case (?n) {
        if (n.userId != user.id) return #err(#Forbidden("You can only manage your own notifications."));
        notifications.add(notificationId, { n with read = true });
        #ok(());
      };
    };
  };

  public shared func markAllNotificationsRead(token : Text) : async CoreTypes.Result<(), Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    for (n in notifications.values()) {
      if (n.userId == user.id and not n.read) {
        notifications.add(n.id, { n with read = true });
      };
    };
    #ok(());
  };

  // ── Support tickets ────────────────────────────────────────────────────

  public shared func createSupportTicket(token : Text, input : TicketInput) : async CoreTypes.Result<Types.SupportTicket, Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    if (input.subject.trim(#char ' ') == "") {
      return #err(#InvalidInput("Add a short subject for your issue."));
    };
    let id = nextTicketId;
    nextTicketId += 1;
    let priority : Types.Priority = switch (input.category) {
      case (#PAYMENTS) #HIGH;
      case (#ORDER_DISPUTE) #HIGH;
      case (#KYC) #MEDIUM;
      case (_) #MEDIUM;
    };
    let ticket : Types.SupportTicket = {
      id;
      userId = user.id;
      category = input.category;
      status = #OPEN;
      priority;
      assignedAdminId = null;
      subject = input.subject;
      body = input.body;
      createdAt = Time.now();
    };
    supportTickets.add(id, ticket);
    #ok(ticket);
  };

  public query func getMySupportTickets(token : Text) : async CoreTypes.Result<[Types.SupportTicket], Types.ApiError> {
    let user = switch (authConsumer(token)) {
      case (#err(e)) return #err(e);
      case (#ok(u)) u;
    };
    let out = List.empty<Types.SupportTicket>();
    for (t in supportTickets.values()) {
      if (t.userId == user.id) out.add(t);
    };
    #ok(out.sort(func(a : Types.SupportTicket, b : Types.SupportTicket) : Order.Order = Int.compare(b.createdAt, a.createdAt)).toArray());
  };

  // ── Admin console (separate employee auth path) ────────────────────────

  public shared func adminLogin(email : Text, password : Text) : async CoreTypes.Result<AdminLoginResult, Types.ApiError> {
    let normalizedEmail = email.trim(#char ' ').toLower();
    let admin = switch (adminsByEmail.get(normalizedEmail)) {
      case (null) return #err(#Unauthorized("Invalid email or password."));
      case (?id) {
        switch (admins.get(id)) {
          case (null) return #err(#Unauthorized("Invalid email or password."));
          case (?a) a;
        };
      };
    };
    if (Seed.hashPassword(password) != admin.passwordHash) {
      return #err(#Unauthorized("Invalid email or password."));
    };
    let token = await newToken("admin");
    let now = Time.now();
    sessions.add(token,
      {
        token;
        principalId = admin.id;
        kind = #Admin;
        createdAt = now;
        expiresAt = now + Int.fromNat(config.sessionTtlHours) * 3_600_000_000_000;
      },
    );
    #ok({ token; adminId = admin.id; name = admin.name; email = admin.email });
  };

  // KYC review queue: HARD requirement — only isLatest rows, PENDING or
  // IN_REVIEW, oldest first, priority derived from confidence via the shared
  // banding function. One row = one reviewable case, always.
  public query func adminGetKycQueue(token : Text) : async CoreTypes.Result<[KycQueueRow], Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let out = List.empty<KycQueueRow>();
    for (d in kycDocuments.values()) {
      let inQueue = d.isLatest and (d.status == #PENDING or d.status == #IN_REVIEW);
      if (inQueue) {
        let (applicantName, applicantPhone, applicantRoles) = switch (users.get(d.userId)) {
          case (?u) (if (u.name == "") "Unnamed user" else u.name, u.phone, u.roles);
          case (null) ("Unknown", "", []);
        };
        out.add(
          {
            document = d;
            applicantName;
            applicantPhone;
            applicantRoles;
            priority = Rules.priorityForConfidence(d.confidenceScore, config.kycPriorityHighBelow, config.kycPriorityMediumBelow);
          },
        );
      };
    };
    #ok(out.sort(func(a : KycQueueRow, b : KycQueueRow) : Order.Order = Int.compare(a.document.submittedAt, b.document.submittedAt)).toArray());
  };

  public shared func adminStartKycReview(token : Text, documentId : Nat) : async CoreTypes.Result<Types.KycDocument, Types.ApiError> {
    let admin = switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(a)) a;
    };
    let doc = switch (kycDocuments.get(documentId)) {
      case (null) return #err(#NotFound("KYC document not found."));
      case (?d) d;
    };
    if (not doc.isLatest or doc.status != #PENDING) {
      return #err(#Conflict("Only the latest pending submission can be moved to review."));
    };
    let updated = { doc with status = #IN_REVIEW; reviewedBy = ?admin.id };
    kycDocuments.add(documentId, updated);
    switch (users.get(doc.userId)) {
      case (?u) users.add(u.id, { u with kycStatus = #IN_REVIEW });
      case (null) {};
    };
    #ok(updated);
  };

  public type KycReviewDecision = {
    #Approve;
    #Reject : Types.KycRejectionReason;
  };

  public shared func adminReviewKyc(token : Text, documentId : Nat, decision : KycReviewDecision) : async CoreTypes.Result<Types.KycDocument, Types.ApiError> {
    let admin = switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(a)) a;
    };
    let doc = switch (kycDocuments.get(documentId)) {
      case (null) return #err(#NotFound("KYC document not found."));
      case (?d) d;
    };
    if (not doc.isLatest) {
      return #err(#Conflict("This is a historical submission — review the latest one instead."));
    };
    if (doc.status != #PENDING and doc.status != #IN_REVIEW) {
      return #err(#Conflict("This submission was already decided."));
    };
    let now = Time.now();
    let (docStatus, userStatus, rejection) : (Types.KycDocStatus, Types.KycStatus, ?Types.KycRejectionReason) = switch (decision) {
      case (#Approve) (#VERIFIED, #VERIFIED, null);
      case (#Reject(reason)) (#REJECTED, #REJECTED, ?reason);
    };
    let updated : Types.KycDocument = {
      doc with
      status = docStatus;
      rejectionReason = rejection;
      reviewedBy = ?admin.id;
      reviewedAt = ?now;
    };
    kycDocuments.add(documentId, updated);
    switch (users.get(doc.userId)) {
      case (?u) {
        users.add(u.id, { u with kycStatus = userStatus; kycRejectionReason = rejection });
        switch (decision) {
          case (#Approve) notify(u.id, #KYC_UPDATE, "Identity verified", "Your identity verification is complete. You can now publish listings and make large purchases.", { emptyPayload() with kycDocumentId = ?documentId });
          case (#Reject(reason)) notify(u.id, #KYC_UPDATE, "Verification rejected", kycRejectionCopy(reason), { emptyPayload() with kycDocumentId = ?documentId });
        };
      };
      case (null) {};
    };
    #ok(updated);
  };

  public query func adminGetListingQueue(token : Text) : async CoreTypes.Result<[ModerationRow], Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let out = List.empty<ModerationRow>();
    for (l in listings.values()) {
      if (l.status == #PENDING_REVIEW) {
        let (sellerName, sellerKycStatus) = switch (users.get(l.sellerId)) {
          case (?u) (u.name, u.kycStatus);
          case (null) ("Unknown", #NONE);
        };
        out.add({ listing = l; sellerName; sellerKycStatus; categoryName = categoryName(l.categoryId) });
      };
    };
    #ok(out.sort(func(a : ModerationRow, b : ModerationRow) : Order.Order = Int.compare(a.listing.updatedAt, b.listing.updatedAt)).toArray());
  };

  public shared func adminModerateListing(token : Text, listingId : Nat, action : ModerationAction) : async CoreTypes.Result<Types.Listing, Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let listing = switch (listings.get(listingId)) {
      case (null) return #err(#NotFound("Listing not found."));
      case (?l) l;
    };
    if (listing.status != #PENDING_REVIEW) {
      return #err(#Conflict("Only listings pending review can be moderated."));
    };
    let now = Time.now();
    let updated : Types.Listing = switch (action) {
      case (#Approve) {
        notify(listing.sellerId, #LISTING_UPDATE, "Listing approved", "\"" # listing.title # "\" is now live for buyers.", { emptyPayload() with listingId = ?listingId });
        { listing with status = #PUBLISHED; moderationNote = null; updatedAt = now };
      };
      case (#Reject(reason)) {
        let count = switch (sellerRejectionCounts.get(listing.sellerId)) {
          case (?n) n + 1;
          case (null) 1;
        };
        sellerRejectionCounts.add(listing.sellerId, count);
        notify(listing.sellerId, #LISTING_UPDATE, "Listing rejected", "\"" # listing.title # "\" was rejected: " # reason, { emptyPayload() with listingId = ?listingId });
        { listing with status = #REJECTED; moderationNote = ?reason; updatedAt = now };
      };
      case (#RequestChanges(note)) {
        notify(listing.sellerId, #LISTING_UPDATE, "Changes requested", "\"" # listing.title # "\" needs changes before it can go live: " # note, { emptyPayload() with listingId = ?listingId });
        { listing with status = #DRAFT; moderationNote = ?note; updatedAt = now };
      };
    };
    listings.add(listingId, updated);
    #ok(updated);
  };

  public shared func adminResolveDispute(token : Text, orderId : Nat, outcome : DisputeOutcome, note : Text) : async CoreTypes.Result<OrderView, Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let order = switch (orders.get(orderId)) {
      case (null) return #err(#NotFound("Order not found."));
      case (?o) o;
    };
    if (order.status != #DISPUTED) {
      return #err(#InvalidTransition({ fromStatus = Rules.orderStatusLabel(order.status); toStatus = "RESOLVED"; message = "Only disputed orders can be resolved." }));
    };
    let now = Time.now();
    var updated : Types.Order = {
      order with
      status = #RESOLVED;
      timeline = Payments.appendTimeline(order.timeline, { status = #RESOLVED; at = now; note });
      updatedAt = now;
    };
    switch (outcome) {
      case (#RefundBuyer) {
        let paymentStatus = refundOrder(order, now);
        updated := { updated with paymentStatus };
        notify(order.buyerId, #ORDER_UPDATE, "Dispute resolved — refund issued", "Your dispute on order #" # order.id.toText() # " was resolved in your favour. ₹" # order.totalAmountInr.toText() # " will be refunded.", { emptyPayload() with orderId = ?order.id });
        notify(order.sellerId, #ORDER_UPDATE, "Dispute resolved", "The dispute on order #" # order.id.toText() # " was resolved with a refund to the buyer.", { emptyPayload() with orderId = ?order.id });
      };
      case (#ReleaseToSeller) {
        switch (latestVerifiedBankAccount(order.sellerId)) {
          case (?account) createPayoutForOrder(updated, account.id, now);
          case (null) notify(order.sellerId, #PAYOUT_UPDATE, "Add a bank account to get paid", "The dispute on order #" # order.id.toText() # " was resolved in your favour, but you have no verified bank account.", { emptyPayload() with orderId = ?order.id });
        };
        notify(order.buyerId, #ORDER_UPDATE, "Dispute resolved", "The dispute on order #" # order.id.toText() # " was reviewed and closed. Payment stays with the seller.", { emptyPayload() with orderId = ?order.id });
        notify(order.sellerId, #ORDER_UPDATE, "Dispute resolved in your favour", "The dispute on order #" # order.id.toText() # " was resolved in your favour.", { emptyPayload() with orderId = ?order.id });
      };
    };
    orders.add(orderId, updated);
    #ok(toOrderView(updated));
  };

  public query func adminGetDisputedOrders(token : Text) : async CoreTypes.Result<[OrderView], Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    let out = List.empty<OrderView>();
    for (o in orders.values()) {
      if (o.status == #DISPUTED) out.add(toOrderView(o));
    };
    #ok(out.sort(func(a : OrderView, b : OrderView) : Order.Order = Int.compare(a.order.updatedAt, b.order.updatedAt)).toArray());
  };

  public shared func adminRunPayoutCycle(token : Text) : async CoreTypes.Result<(), Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    processDuePayouts(null);
    #ok(());
  };

  public query func adminGetReports(token : Text, range : ReportRange) : async CoreTypes.Result<Reports, Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    func inRange(t : Types.Timestamp) : Bool {
      t >= range.fromNs and t < range.toNs;
    };
    var gmv : Nat = 0;
    var orderCount : Nat = 0;
    var refundedCount : Nat = 0;
    let activeUsers = Map.empty<Nat, Bool>();
    for (o in orders.values()) {
      if (inRange(o.createdAt)) {
        if (o.paymentStatus == #PAID or o.paymentStatus == #REFUNDED) {
          gmv += o.totalAmountInr;
          orderCount += 1;
          activeUsers.add(o.buyerId, true);
          activeUsers.add(o.sellerId, true);
        };
        if (o.paymentStatus == #REFUNDED) refundedCount += 1;
      };
    };
    var newUsers : Nat = 0;
    for (u in users.values()) {
      if (inRange(u.createdAt)) newUsers += 1;
    };
    var newListings : Nat = 0;
    var published : Nat = 0;
    for (l in listings.values()) {
      if (inRange(l.createdAt)) newListings += 1;
      if (l.status == #PUBLISHED) published += 1;
    };
    var payoutPaid : Nat = 0;
    for (p in payouts.values()) {
      switch (p.paidAt) {
        case (?t) if (inRange(t)) payoutPaid += p.amountInr;
        case (null) {};
      };
    };
    #ok({
      fromNs = range.fromNs;
      toNs = range.toNs;
      gmvInr = gmv;
      orderCount;
      refundedOrderCount = refundedCount;
      activeUserCount = activeUsers.size();
      newUserCount = newUsers;
      totalUserCount = users.size();
      newListingCount = newListings;
      publishedListingCount = published;
      payoutPaidInr = payoutPaid;
    });
  };

  public query func adminGetConfig(token : Text) : async CoreTypes.Result<Types.AppConfig, Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) #err(e);
      case (#ok(_)) #ok(config);
    };
  };

  public shared func adminUpdateConfig(token : Text, newConfig : Types.AppConfig) : async CoreTypes.Result<Types.AppConfig, Types.ApiError> {
    switch (authAdmin(token)) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };
    if (newConfig.kycMaxAttempts == 0 or newConfig.otpRateLimitMax == 0) {
      return #err(#InvalidInput("Attempt limits must be at least 1."));
    };
    config := newConfig;
    #ok(config);
  };
};
