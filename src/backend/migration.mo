// Explicit upgrade migration: CropVibe replaces the previous AgroVibes data
// model wholesale, so every legacy stable variable is consumed here and
// dropped. The new CropVibe state initializes fresh from the declarations in
// main.mo (including the development seed data).
import Legacy "types/legacy";

module {
  // Stable representation of the previous build's `List.List<T>` values.
  type OldList<T> = {
    var blockIndex : Nat;
    var blocks : [var [var ?T]];
    var elementIndex : Nat;
  };

  public func run(
    _old : {
      alerts : OldList<Legacy.Alert>;
      answers : OldList<Legacy.Answer>;
      certifications : OldList<Legacy.Certification>;
      conversations : OldList<Legacy.Conversation>;
      courses : OldList<Legacy.Course>;
      directMessages : OldList<Legacy.DirectMessage>;
      disputeCases : OldList<Legacy.DisputeCase>;
      educators : OldList<Legacy.Educator>;
      enrollments : OldList<Legacy.Enrollment>;
      equipmentGuides : OldList<Legacy.EquipmentGuide>;
      experts : OldList<Legacy.ExpertProfile>;
      farmers : OldList<Legacy.Farmer>;
      forumPosts : OldList<Legacy.ForumPost>;
      groupMessages : OldList<Legacy.GroupMessage>;
      groups : OldList<Legacy.Group>;
      inventoryItems : OldList<Legacy.InventoryItem>;
      kycRecords : OldList<Legacy.KycRecord>;
      lessons : OldList<Legacy.Lesson>;
      listings : OldList<Legacy.Listing>;
      liveStreams : OldList<Legacy.LiveStream>;
      logistics : OldList<Legacy.LogisticsListing>;
      machinery : OldList<Legacy.MachineryListing>;
      marketPriceTicks : OldList<Legacy.MarketPriceTick>;
      marketPrices : OldList<Legacy.MarketPrice>;
      notifications : OldList<Legacy.Notification>;
      orders : OldList<Legacy.Order>;
      plantingEntries : OldList<Legacy.PlantingEntry>;
      questions : OldList<Legacy.Question>;
      reels : OldList<Legacy.Reel>;
      salesAnalytics : OldList<Legacy.SalesAnalytics>;
      seasonalAlerts : OldList<Legacy.SeasonalAlert>;
      sellerListings : OldList<Legacy.SellerListing>;
      teamMembers : OldList<Legacy.TeamMember>;
      var nextCertificationId : Nat;
      var nextConversationId : Nat;
      var nextCourseId : Nat;
      var nextDirectMessageId : Nat;
      var nextDisputeId : Nat;
      var nextEnrollmentId : Nat;
      var nextForumPostId : Nat;
      var nextKycId : Nat;
      var nextListingId : Nat;
      var nextMessageId : Nat;
      var nextNotificationId : Nat;
      var nextOrderId : Nat;
      var nextQuestionId : Nat;
      var nextReelId : Nat;
      var nextSellerListingId : Nat;
      var nextStreamId : Nat;
    }
  ) : {} {
    {};
  };
};
