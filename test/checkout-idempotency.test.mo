// Checkout idempotency — replaying the same idempotencyKey must not create
// a duplicate Order or Payment (Section 5 / Section 9 of the build spec).
import { test; suite } "mo:test";
import Payments "../src/backend/lib/payments";
import Types "../src/backend/types/core";
import Map "mo:core/Map";

suite(
  "checkout idempotency",
  func() {
    func freshListing() : Types.Listing {
      {
        id = 1;
        sellerId = 2;
        categoryId = 1;
        title = "Test Tomatoes";
        description = "Test";
        priceInr = 100;
        quantity = 10;
        unit = "kg";
        status = #PUBLISHED;
        attributes = [];
        location = "Pune";
        images = [];
        moderationNote = null;
        createdAt = 0;
        updatedAt = 0;
      };
    };

    func freshIntent(key : Text) : Types.Payment {
      {
        idempotencyKey = key;
        orderId = null;
        provider = "RAZORPAY_SIMULATED";
        providerPaymentId = "pay_test_1";
        amountInr = 300;
        status = #PENDING;
        method = #UPI;
        buyerId = 1;
        listingId = 1;
        quantity = 3;
        createdAt = 0;
        updatedAt = 0;
      };
    };

    test(
      "replaying the same idempotency key returns the existing order, no duplicates",
      func() {
        let payments = Map.empty<Text, Types.Payment>();
        let orders = Map.empty<Nat, Types.Order>();
        let listings = Map.empty<Nat, Types.Listing>();
        listings.add(1, freshListing());
        payments.add("key-1", freshIntent("key-1"));

        // First confirmation creates the order and captures the payment.
        let first = switch (Payments.confirmPayment(payments, orders, listings, "key-1", true, 1, 100)) {
          case (#ok(o)) o;
          case (#err(_)) { assert false; return };
        };
        assert first.createdOrder;
        assert first.nextOrderId == 2;
        let firstOrder = switch (first.order) {
          case (?o) o;
          case (null) { assert false; return };
        };
        assert firstOrder.paymentStatus == #PAID;
        assert orders.size() == 1;

        // Webhook fires again / client retries after timeout: same key.
        let second = switch (Payments.confirmPayment(payments, orders, listings, "key-1", true, first.nextOrderId, 200)) {
          case (#ok(o)) o;
          case (#err(_)) { assert false; return };
        };
        assert not second.createdOrder;
        assert second.nextOrderId == 2; // id counter untouched
        switch (second.order) {
          case (?o) assert o.id == firstOrder.id;
          case (null) assert false;
        };
        assert orders.size() == 1; // no duplicate Order
        assert payments.size() == 1; // no duplicate Payment

        // Stock was only decremented once.
        switch (listings.get(1)) {
          case (?l) assert l.quantity == 7;
          case (null) assert false;
        };
      },
    );

    test(
      "failed capture marks the payment FAILED and creates no order",
      func() {
        let payments = Map.empty<Text, Types.Payment>();
        let orders = Map.empty<Nat, Types.Order>();
        let listings = Map.empty<Nat, Types.Listing>();
        listings.add(1, freshListing());
        payments.add("key-2", freshIntent("key-2"));

        let outcome = switch (Payments.confirmPayment(payments, orders, listings, "key-2", false, 1, 100)) {
          case (#ok(o)) o;
          case (#err(_)) { assert false; return };
        };
        assert outcome.order == null;
        assert outcome.payment.status == #FAILED;
        assert orders.size() == 0;
        switch (listings.get(1)) {
          case (?l) assert l.quantity == 10; // stock untouched
          case (null) assert false;
        };
      },
    );

    test(
      "unknown idempotency key is rejected",
      func() {
        let payments = Map.empty<Text, Types.Payment>();
        let orders = Map.empty<Nat, Types.Order>();
        let listings = Map.empty<Nat, Types.Listing>();
        switch (Payments.confirmPayment(payments, orders, listings, "missing", true, 1, 100)) {
          case (#ok(_)) assert false;
          case (#err(#NotFound(_))) {};
          case (#err(_)) assert false;
        };
      },
    );

    test(
      "capture fails cleanly when stock ran out before the webhook",
      func() {
        let payments = Map.empty<Text, Types.Payment>();
        let orders = Map.empty<Nat, Types.Order>();
        let listings = Map.empty<Nat, Types.Listing>();
        let low = { freshListing() with quantity = 2 : Nat };
        listings.add(1, low);
        payments.add("key-3", freshIntent("key-3")); // wants 3 units

        switch (Payments.confirmPayment(payments, orders, listings, "key-3", true, 1, 100)) {
          case (#ok(_)) assert false;
          case (#err(#Conflict(_))) {};
          case (#err(_)) assert false;
        };
        assert orders.size() == 0;
        switch (payments.get("key-3")) {
          case (?p) assert p.status == #FAILED;
          case (null) assert false;
        };
      },
    );
  },
);
