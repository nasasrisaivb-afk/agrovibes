// CropVibe MVP — pure domain rules.
//
// Everything in this module is a pure function so the costliest logic
// (order state machine, KYC gating, priority banding, rate limiting) is
// unit-testable without canister state. main.mo is the only stateful layer.
import Types "../types/core";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  // ── Order state machine ─────────────────────────────────────────────────

  // The single source of truth for Order status transitions. Route handlers
  // must call transitionOrderStatus (main.mo), which delegates here — any
  // pair not in this map is rejected.
  public func orderTransitionAllowed(from : Types.OrderStatus, to : Types.OrderStatus) : Bool {
    switch (from, to) {
      case (#PLACED, #CONFIRMED) true;
      case (#PLACED, #CANCELLED) true;
      case (#CONFIRMED, #IN_PROGRESS) true;
      case (#CONFIRMED, #CANCELLED) true;
      case (#IN_PROGRESS, #COMPLETED) true;
      case (#IN_PROGRESS, #DISPUTED) true;
      case (#COMPLETED, #DISPUTED) true;
      case (#DISPUTED, #RESOLVED) true;
      case _ false;
    };
  };

  public func orderStatusLabel(status : Types.OrderStatus) : Text {
    switch (status) {
      case (#PLACED) "PLACED";
      case (#CONFIRMED) "CONFIRMED";
      case (#IN_PROGRESS) "IN_PROGRESS";
      case (#COMPLETED) "COMPLETED";
      case (#CANCELLED) "CANCELLED";
      case (#DISPUTED) "DISPUTED";
      case (#RESOLVED) "RESOLVED";
    };
  };

  // Who is allowed to drive a given (valid) transition.
  public type TransitionActor = {
    #Buyer;
    #Seller;
    #Admin;
  };

  public func actorMayTransition(
    who : TransitionActor,
    from : Types.OrderStatus,
    to : Types.OrderStatus,
  ) : Bool {
    switch (who, from, to) {
      // Seller drives fulfilment.
      case (#Seller, #PLACED, #CONFIRMED) true;
      case (#Seller, #CONFIRMED, #IN_PROGRESS) true;
      case (#Seller, #IN_PROGRESS, #COMPLETED) true;
      case (#Seller, #CONFIRMED, #CANCELLED) true;
      // Buyer can cancel early and raise disputes.
      case (#Buyer, #PLACED, #CANCELLED) true;
      case (#Buyer, #CONFIRMED, #CANCELLED) true;
      case (#Buyer, #IN_PROGRESS, #DISPUTED) true;
      case (#Buyer, #COMPLETED, #DISPUTED) true;
      // Only admins resolve disputes.
      case (#Admin, #DISPUTED, #RESOLVED) true;
      // Admins may also perform any otherwise-valid transition (ops tooling).
      case (#Admin, f, t) orderTransitionAllowed(f, t);
      case _ false;
    };
  };

  // ── KYC gating ──────────────────────────────────────────────────────────

  public type GateDecision = {
    #Proceed;
    // kycStatus NONE or REJECTED → open KYC flow (canResubmit=false when the
    // rejection reason is FRAUD_SUSPECTED → route to support instead).
    #StartKyc : Types.KycGateInfo;
    // kycStatus PENDING or IN_REVIEW → block resubmission, show progress.
    #InProgress : Types.KycGateInfo;
  };

  // The reusable KYC gate wrapping every KYC-gated action (publish listing,
  // checkout at/above the configured threshold). Covers all five statuses.
  public func kycGate(
    status : Types.KycStatus,
    rejectionReason : ?Types.KycRejectionReason,
  ) : GateDecision {
    switch (status) {
      case (#VERIFIED) #Proceed;
      case (#NONE) #StartKyc({
        kycStatus = #NONE;
        rejectionReason = null;
        canResubmit = true;
        message = "Identity verification is required for this action. It takes about 2 minutes.";
      });
      case (#REJECTED) {
        let fraud = switch (rejectionReason) {
          case (?#FRAUD_SUSPECTED) true;
          case _ false;
        };
        #StartKyc({
          kycStatus = #REJECTED;
          rejectionReason;
          canResubmit = not fraud;
          message = if (fraud) {
            "Your verification could not be completed. Please contact support to continue.";
          } else {
            "Your last verification attempt was rejected. Please resubmit your documents.";
          };
        });
      };
      case (#PENDING) #InProgress({
        kycStatus = #PENDING;
        rejectionReason = null;
        canResubmit = false;
        message = "Verification in progress, typically completed within 24 hours.";
      });
      case (#IN_REVIEW) #InProgress({
        kycStatus = #IN_REVIEW;
        rejectionReason = null;
        canResubmit = false;
        message = "Verification in progress, typically completed within 24 hours.";
      });
    };
  };

  // Checkout is only gated at/above the configured threshold.
  public func checkoutRequiresKyc(totalAmountInr : Nat, thresholdInr : Nat) : Bool {
    totalAmountInr >= thresholdInr;
  };

  // ── KYC priority banding & auto-decision ────────────────────────────────

  // Shared priority derivation — the ONLY way a queue row gets a priority.
  // Same confidence always yields the same priority, so one applicant can
  // never show inconsistent priorities across rows.
  public func priorityForConfidence(
    score : ?Float,
    highBelow : Float,
    mediumBelow : Float,
  ) : Types.Priority {
    switch (score) {
      case (null) #HIGH; // provider returned nothing → needs manual attention
      case (?s) {
        if (s < highBelow) #HIGH else if (s < mediumBelow) #MEDIUM else #LOW;
      };
    };
  };

  public type KycAutoDecision = {
    #AutoApprove;
    #AutoReject : Types.KycRejectionReason;
    #ManualReview;
  };

  // Provider result → decision: hard-fail conditions auto-reject, scores at
  // or above the threshold auto-approve, gray zone goes to the manual queue.
  public func kycAutoDecision(
    confidence : Float,
    hardFail : ?Types.KycRejectionReason,
    autoApproveThreshold : Float,
  ) : KycAutoDecision {
    switch (hardFail) {
      case (?reason) #AutoReject(reason);
      case (null) {
        if (confidence >= autoApproveThreshold) #AutoApprove else #ManualReview;
      };
    };
  };

  // Server-side resubmission cap: at most maxAttempts submissions within the
  // rolling window (enforced via KycDocument.attemptNumber history, not UI).
  public func kycResubmissionAllowed(
    submissionTimes : [Types.Timestamp],
    now : Types.Timestamp,
    maxAttempts : Nat,
    windowHours : Nat,
  ) : Bool {
    let windowNs : Int = Int.fromNat(windowHours) * 3_600_000_000_000;
    var inWindow : Nat = 0;
    for (t in submissionTimes.vals()) {
      if (now - t < windowNs) inWindow += 1;
    };
    inWindow < maxAttempts;
  };

  // ── OTP rate limiting ───────────────────────────────────────────────────

  public type OtpSendDecision = {
    #Allowed;
    #Limited : { retryAfterSecs : Nat };
  };

  public func otpSendAllowed(
    previousSendTimes : [Types.Timestamp],
    now : Types.Timestamp,
    maxPerWindow : Nat,
    windowSecs : Nat,
  ) : OtpSendDecision {
    let windowNs : Int = Int.fromNat(windowSecs) * 1_000_000_000;
    var oldestInWindow : ?Types.Timestamp = null;
    var inWindow : Nat = 0;
    for (t in previousSendTimes.vals()) {
      if (now - t < windowNs) {
        inWindow += 1;
        oldestInWindow := switch (oldestInWindow) {
          case (null) ?t;
          case (?o) if (t < o) ?t else ?o;
        };
      };
    };
    if (inWindow < maxPerWindow) {
      #Allowed;
    } else {
      let retryNs : Int = switch (oldestInWindow) {
        case (null) windowNs;
        case (?o) windowNs - (now - o);
      };
      let retrySecs = if (retryNs <= 0) 1 else Int.abs(retryNs) / 1_000_000_000 + 1;
      #Limited({ retryAfterSecs = retrySecs });
    };
  };

  // ── Payouts ─────────────────────────────────────────────────────────────

  public func payoutScheduleTime(completedAt : Types.Timestamp, holdHours : Nat) : Types.Timestamp {
    completedAt + Int.fromNat(holdHours) * 3_600_000_000_000;
  };

  // Seller receives total minus platform commission (basis points).
  public func sellerPayoutAmount(totalAmountInr : Nat, commissionBps : Nat) : Nat {
    let commission = totalAmountInr * commissionBps / 10_000;
    if (commission >= totalAmountInr) 0 else totalAmountInr - commission;
  };

  // Hard invariant: payouts may only target VERIFIED bank accounts.
  public func payoutAccountEligible(status : Types.BankVerificationStatus) : Bool {
    switch (status) {
      case (#VERIFIED) true;
      case _ false;
    };
  };

  // ── Listing publish decision ────────────────────────────────────────────

  public type PublishDecision = {
    #Publish; // KYC verified + clean history → straight to PUBLISHED
    #Review; // KYC verified but prior rejections → PENDING_REVIEW
    #Gate : GateDecision; // not verified → stays DRAFT, KYC gate surfaced
  };

  public func listingPublishDecision(
    kycStatus : Types.KycStatus,
    kycRejectionReason : ?Types.KycRejectionReason,
    hasPriorListingRejections : Bool,
  ) : PublishDecision {
    switch (kycGate(kycStatus, kycRejectionReason)) {
      case (#Proceed) {
        if (hasPriorListingRejections) #Review else #Publish;
      };
      case (other) #Gate(other);
    };
  };

  // Seller-driven listing status changes (pause/resume/archive/edit).
  public func listingTransitionAllowed(from : Types.ListingStatus, to : Types.ListingStatus) : Bool {
    switch (from, to) {
      case (#DRAFT, #PENDING_REVIEW) true;
      case (#DRAFT, #PUBLISHED) true;
      case (#PENDING_REVIEW, #PUBLISHED) true;
      case (#PENDING_REVIEW, #REJECTED) true;
      case (#PENDING_REVIEW, #DRAFT) true;
      case (#PUBLISHED, #PAUSED) true;
      case (#PAUSED, #PUBLISHED) true;
      case (#PUBLISHED, #SOLD_OUT) true;
      case (#SOLD_OUT, #PUBLISHED) true;
      case (#REJECTED, #DRAFT) true;
      case (#DRAFT, #ARCHIVED) true;
      case (#PAUSED, #ARCHIVED) true;
      case (#SOLD_OUT, #ARCHIVED) true;
      case (#REJECTED, #ARCHIVED) true;
      case _ false;
    };
  };

  // ── Simulated KYC provider (deterministic, keyed off document URL) ──────
  //
  // Stands in for Setu/HyperVerge until live keys are configured. Test hooks
  // (Development only, documented in the seed script/README):
  //   file name containing "blurry"   → hard fail BLURRY_DOCUMENT
  //   file name containing "expired"  → hard fail EXPIRED_DOCUMENT
  //   file name containing "fraud"    → hard fail FRAUD_SUSPECTED
  //   file name containing "mismatch" → hard fail NAME_MISMATCH
  //   file name containing "selfie-mismatch" → hard fail SELFIE_MISMATCH
  //   file name containing "review"   → gray-zone score (manual queue)
  //   anything else                   → high confidence (auto-approve)
  public type SimulatedKycResult = {
    confidence : Float;
    hardFail : ?Types.KycRejectionReason;
  };

  public func simulateKycProvider(fileUrl : Text, selfieUrl : ?Text) : SimulatedKycResult {
    func has(haystack : Text, needle : Text) : Bool {
      haystack.toLower().contains(#text needle);
    };
    let selfie = switch (selfieUrl) { case (null) ""; case (?s) s };
    if (has(fileUrl, "fraud") or has(selfie, "fraud")) {
      return { confidence = 0.05; hardFail = ?#FRAUD_SUSPECTED };
    };
    if (has(selfie, "selfie-mismatch")) {
      return { confidence = 0.2; hardFail = ?#SELFIE_MISMATCH };
    };
    if (has(fileUrl, "mismatch")) {
      return { confidence = 0.25; hardFail = ?#NAME_MISMATCH };
    };
    if (has(fileUrl, "expired")) {
      return { confidence = 0.3; hardFail = ?#EXPIRED_DOCUMENT };
    };
    if (has(fileUrl, "blurry")) {
      return { confidence = 0.15; hardFail = ?#BLURRY_DOCUMENT };
    };
    if (has(fileUrl, "review")) {
      return { confidence = 0.65; hardFail = null };
    };
    { confidence = 0.96; hardFail = null };
  };

  // ── Misc formatting helpers used by services ───────────────────────────

  public func kycRejectionLabel(reason : Types.KycRejectionReason) : Text {
    switch (reason) {
      case (#BLURRY_DOCUMENT) "BLURRY_DOCUMENT";
      case (#NAME_MISMATCH) "NAME_MISMATCH";
      case (#SELFIE_MISMATCH) "SELFIE_MISMATCH";
      case (#EXPIRED_DOCUMENT) "EXPIRED_DOCUMENT";
      case (#FRAUD_SUSPECTED) "FRAUD_SUSPECTED";
    };
  };

  public func inrText(amount : Nat) : Text {
    "₹" # amount.toText();
  };

  public func clampFloat(v : Float, lo : Float, hi : Float) : Float {
    Float.min(hi, Float.max(lo, v));
  };
};
