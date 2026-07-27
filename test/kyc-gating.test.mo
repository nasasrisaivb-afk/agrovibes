// KYC gating middleware — all five kycStatus branches produce the correct
// structured decision, plus priority banding, auto-decision thresholds and
// the server-side resubmission cap (Sections 4 & 9 of the build spec).
import { test; suite } "mo:test";
import Rules "../src/backend/lib/rules";

suite(
  "kyc gate — all five status branches",
  func() {
    test(
      "VERIFIED proceeds",
      func() {
        switch (Rules.kycGate(#VERIFIED, null)) {
          case (#Proceed) {};
          case (_) assert false;
        };
      },
    );

    test(
      "NONE starts the KYC flow (structured payload, resubmit allowed)",
      func() {
        switch (Rules.kycGate(#NONE, null)) {
          case (#StartKyc(info)) {
            assert info.kycStatus == #NONE;
            assert info.canResubmit;
            assert info.message != "";
          };
          case (_) assert false;
        };
      },
    );

    test(
      "REJECTED (ordinary reason) allows resubmission",
      func() {
        switch (Rules.kycGate(#REJECTED, ?#BLURRY_DOCUMENT)) {
          case (#StartKyc(info)) {
            assert info.kycStatus == #REJECTED;
            assert info.canResubmit;
            assert info.rejectionReason == ?#BLURRY_DOCUMENT;
          };
          case (_) assert false;
        };
      },
    );

    test(
      "REJECTED with FRAUD_SUSPECTED is a hard block — no resubmission",
      func() {
        switch (Rules.kycGate(#REJECTED, ?#FRAUD_SUSPECTED)) {
          case (#StartKyc(info)) {
            assert not info.canResubmit;
          };
          case (_) assert false;
        };
      },
    );

    test(
      "PENDING blocks with an in-progress message",
      func() {
        switch (Rules.kycGate(#PENDING, null)) {
          case (#InProgress(info)) {
            assert info.kycStatus == #PENDING;
            assert not info.canResubmit;
          };
          case (_) assert false;
        };
      },
    );

    test(
      "IN_REVIEW blocks with an in-progress message",
      func() {
        switch (Rules.kycGate(#IN_REVIEW, null)) {
          case (#InProgress(info)) {
            assert info.kycStatus == #IN_REVIEW;
            assert not info.canResubmit;
          };
          case (_) assert false;
        };
      },
    );
  },
);

suite(
  "checkout threshold gating",
  func() {
    test(
      "only totals at/above the config threshold require KYC",
      func() {
        assert not Rules.checkoutRequiresKyc(9_999, 10_000);
        assert Rules.checkoutRequiresKyc(10_000, 10_000);
        assert Rules.checkoutRequiresKyc(25_000, 10_000);
      },
    );
  },
);

suite(
  "kyc priority banding (shared derivation)",
  func() {
    test(
      "bands: <0.5 HIGH, 0.5-0.8 MEDIUM, >0.8 LOW, missing score HIGH",
      func() {
        assert Rules.priorityForConfidence(?0.3, 0.5, 0.8) == #HIGH;
        assert Rules.priorityForConfidence(?0.49, 0.5, 0.8) == #HIGH;
        assert Rules.priorityForConfidence(?0.5, 0.5, 0.8) == #MEDIUM;
        assert Rules.priorityForConfidence(?0.79, 0.5, 0.8) == #MEDIUM;
        assert Rules.priorityForConfidence(?0.8, 0.5, 0.8) == #LOW;
        assert Rules.priorityForConfidence(?0.97, 0.5, 0.8) == #LOW;
        assert Rules.priorityForConfidence(null, 0.5, 0.8) == #HIGH;
      },
    );

    test(
      "identical confidence always yields identical priority",
      func() {
        let a = Rules.priorityForConfidence(?0.65, 0.5, 0.8);
        let b = Rules.priorityForConfidence(?0.65, 0.5, 0.8);
        assert a == b;
      },
    );
  },
);

suite(
  "kyc auto-decision",
  func() {
    test(
      "hard fails auto-reject regardless of confidence",
      func() {
        switch (Rules.kycAutoDecision(0.99, ?#EXPIRED_DOCUMENT, 0.85)) {
          case (#AutoReject(#EXPIRED_DOCUMENT)) {};
          case (_) assert false;
        };
      },
    );

    test(
      "score at/above threshold auto-approves; gray zone goes to manual review",
      func() {
        switch (Rules.kycAutoDecision(0.9, null, 0.85)) {
          case (#AutoApprove) {};
          case (_) assert false;
        };
        switch (Rules.kycAutoDecision(0.7, null, 0.85)) {
          case (#ManualReview) {};
          case (_) assert false;
        };
      },
    );
  },
);

suite(
  "kyc resubmission cap (server-side)",
  func() {
    let hourNs : Int = 3_600_000_000_000;

    test(
      "under the cap within the window is allowed",
      func() {
        let times : [Int] = [0, hourNs, 2 * hourNs, 3 * hourNs];
        assert Rules.kycResubmissionAllowed(times, 4 * hourNs, 5, 72);
      },
    );

    test(
      "at the cap within the window is blocked",
      func() {
        let times : [Int] = [0, hourNs, 2 * hourNs, 3 * hourNs, 4 * hourNs];
        assert not Rules.kycResubmissionAllowed(times, 5 * hourNs, 5, 72);
      },
    );

    test(
      "attempts outside the rolling window no longer count",
      func() {
        let times : [Int] = [0, hourNs, 2 * hourNs, 3 * hourNs, 4 * hourNs];
        // 80 hours later, all five attempts fall outside the 72h window.
        assert Rules.kycResubmissionAllowed(times, 80 * hourNs, 5, 72);
      },
    );
  },
);
