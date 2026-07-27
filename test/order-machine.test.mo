// Order state machine — every valid transition passes and EVERY invalid
// pair is rejected (Section 6 / Section 9 of the build spec).
import { test; suite } "mo:test";
import Rules "../src/backend/lib/rules";
import Types "../src/backend/types/core";

suite(
  "order state machine",
  func() {
    let all : [Types.OrderStatus] = [
      #PLACED,
      #CONFIRMED,
      #IN_PROGRESS,
      #COMPLETED,
      #CANCELLED,
      #DISPUTED,
      #RESOLVED,
    ];

    let valid : [(Types.OrderStatus, Types.OrderStatus)] = [
      (#PLACED, #CONFIRMED),
      (#PLACED, #CANCELLED),
      (#CONFIRMED, #IN_PROGRESS),
      (#CONFIRMED, #CANCELLED),
      (#IN_PROGRESS, #COMPLETED),
      (#IN_PROGRESS, #DISPUTED),
      (#COMPLETED, #DISPUTED),
      (#DISPUTED, #RESOLVED),
    ];

    func isValid(from : Types.OrderStatus, to : Types.OrderStatus) : Bool {
      for ((f, t) in valid.vals()) {
        if (f == from and t == to) return true;
      };
      false;
    };

    test(
      "every valid transition is allowed",
      func() {
        for ((f, t) in valid.vals()) {
          assert Rules.orderTransitionAllowed(f, t);
        };
      },
    );

    test(
      "every transition outside the map is rejected",
      func() {
        for (f in all.vals()) {
          for (t in all.vals()) {
            if (not isValid(f, t)) {
              assert not Rules.orderTransitionAllowed(f, t);
            };
          };
        };
      },
    );

    test(
      "terminal states have no outgoing transitions",
      func() {
        for (t in all.vals()) {
          assert not Rules.orderTransitionAllowed(#CANCELLED, t);
          assert not Rules.orderTransitionAllowed(#RESOLVED, t);
        };
      },
    );

    test(
      "actor permissions: seller drives fulfilment, buyer cancels/disputes, admin resolves",
      func() {
        assert Rules.actorMayTransition(#Seller, #PLACED, #CONFIRMED);
        assert Rules.actorMayTransition(#Seller, #CONFIRMED, #IN_PROGRESS);
        assert Rules.actorMayTransition(#Seller, #IN_PROGRESS, #COMPLETED);
        assert Rules.actorMayTransition(#Buyer, #PLACED, #CANCELLED);
        assert Rules.actorMayTransition(#Buyer, #IN_PROGRESS, #DISPUTED);
        assert Rules.actorMayTransition(#Buyer, #COMPLETED, #DISPUTED);
        assert Rules.actorMayTransition(#Admin, #DISPUTED, #RESOLVED);
        // The buyer cannot confirm or complete their own order.
        assert not Rules.actorMayTransition(#Buyer, #PLACED, #CONFIRMED);
        assert not Rules.actorMayTransition(#Buyer, #IN_PROGRESS, #COMPLETED);
        // The seller cannot resolve a dispute.
        assert not Rules.actorMayTransition(#Seller, #DISPUTED, #RESOLVED);
        // Nobody can perform an invalid map transition, even an admin.
        assert not Rules.actorMayTransition(#Admin, #CANCELLED, #COMPLETED);
      },
    );
  },
);
