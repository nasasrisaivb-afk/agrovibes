// CropVibe MVP — checkout confirmation service.
//
// This is the webhook-side "payment captured" handler. It is written as a
// pure-ish function over the state maps so the idempotency guarantee can be
// unit-tested: replaying the same idempotencyKey (double webhook fire, or a
// create-order retry after a client timeout) must return the existing
// Payment/Order and never create duplicates.
import Types "../types/core";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import CoreTypes "mo:core/Types";
import Array "mo:core/Array";

module {
  public type ConfirmOutcome = {
    payment : Types.Payment;
    order : ?Types.Order; // null when the payment failed
    createdOrder : Bool; // false on idempotent replay
    nextOrderId : Nat;
  };

  public func confirmPayment(
    payments : Map.Map<Text, Types.Payment>,
    orders : Map.Map<Nat, Types.Order>,
    listings : Map.Map<Nat, Types.Listing>,
    idempotencyKey : Text,
    succeed : Bool,
    nextOrderId : Nat,
    now : Types.Timestamp,
  ) : CoreTypes.Result<ConfirmOutcome, Types.ApiError> {
    let payment = switch (payments.get(idempotencyKey)) {
      case (null) {
        return #err(#NotFound("No payment found for this checkout. Please start checkout again."));
      };
      case (?p) p;
    };

    // Idempotent replay: the payment already succeeded and an order exists.
    switch (payment.status, payment.orderId) {
      case (#PAID, ?orderId) {
        switch (orders.get(orderId)) {
          case (?existing) {
            return #ok({
              payment;
              order = ?existing;
              createdOrder = false;
              nextOrderId;
            });
          };
          case (null) {
            // Should be unreachable: PAID payments always carry their order.
            return #err(#Conflict("Payment is marked paid but its order is missing. Contact support."));
          };
        };
      };
      case (#REFUNDED, _) {
        return #err(#Conflict("This payment was already refunded and cannot be replayed."));
      };
      case (_, _) {};
    };

    if (not succeed) {
      let failed : Types.Payment = {
        payment with status = #FAILED;
        updatedAt = now;
      };
      payments.add(idempotencyKey, failed);
      return #ok({
        payment = failed;
        order = null;
        createdOrder = false;
        nextOrderId;
      });
    };

    // Stock check happens at capture time to close the race between two
    // buyers checking out the last units simultaneously.
    let listing = switch (listings.get(payment.listingId)) {
      case (null) return #err(#NotFound("This listing no longer exists."));
      case (?l) l;
    };
    if (listing.quantity < payment.quantity) {
      let failed : Types.Payment = {
        payment with status = #FAILED;
        updatedAt = now;
      };
      payments.add(idempotencyKey, failed);
      return #err(#Conflict("The seller ran out of stock before payment completed. You have not been charged."));
    };

    let orderId = nextOrderId;
    let order : Types.Order = {
      id = orderId;
      buyerId = payment.buyerId;
      sellerId = listing.sellerId;
      listingId = listing.id;
      quantity = payment.quantity;
      totalAmountInr = payment.amountInr;
      status = #PLACED;
      paymentStatus = #PAID;
      timeline = [{ status = #PLACED; at = now; note = "Order placed and payment captured" }];
      createdAt = now;
      updatedAt = now;
    };
    orders.add(orderId, order);

    let remaining : Nat = listing.quantity - payment.quantity;
    let updatedListing : Types.Listing = {
      listing with
      quantity = remaining;
      status = if (remaining == 0) #SOLD_OUT else listing.status;
      updatedAt = now;
    };
    listings.add(listing.id, updatedListing);

    let paid : Types.Payment = {
      payment with
      status = #PAID;
      orderId = ?orderId;
      updatedAt = now;
    };
    payments.add(idempotencyKey, paid);

    #ok({
      payment = paid;
      order = ?order;
      createdOrder = true;
      nextOrderId = nextOrderId + 1;
    });
  };

  // Idempotent initiation: an existing intent for the same key is returned
  // as-is instead of creating a second Payment row.
  public func existingIntent(
    payments : Map.Map<Text, Types.Payment>,
    idempotencyKey : Text,
  ) : ?Types.Payment {
    payments.get(idempotencyKey);
  };

  public func appendTimeline(
    timeline : [Types.OrderEvent],
    event : Types.OrderEvent,
  ) : [Types.OrderEvent] {
    timeline.concat([event]);
  };
};
