import Types "../types/core";
import CoreLib "../lib/core";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  farmers : List.List<Types.Farmer>,
  listings : List.List<Types.Listing>,
  reels : List.List<Types.Reel>,
  questions : List.List<Types.Question>,
  answers : List.List<Types.Answer>,
  groups : List.List<Types.Group>,
  groupMessages : List.List<Types.GroupMessage>,
  machinery : List.List<Types.MachineryListing>,
  logistics : List.List<Types.LogisticsListing>,
  experts : List.List<Types.ExpertProfile>,
  alerts : List.List<Types.Alert>,
  orders : List.List<Types.Order>,
  seasonalAlerts : List.List<Types.SeasonalAlert>,
  marketPriceTicks : List.List<Types.MarketPriceTick>,
  sellerListings : List.List<Types.SellerListing>,
  salesAnalytics : List.List<Types.SalesAnalytics>,
  inventoryItems : List.List<Types.InventoryItem>,
  teamMembers : List.List<Types.TeamMember>,
  kycRecords : List.List<Types.KycRecord>,
  disputeCases : List.List<Types.DisputeCase>,
  plantingEntries : List.List<Types.PlantingEntry>,
  marketPrices : List.List<Types.MarketPrice>,
  equipmentGuides : List.List<Types.EquipmentGuide>,
  forumPosts : List.List<Types.ForumPost>,
) {
  var nextListingId : Nat = 53;
  var nextReelId : Nat = 13;
  var nextQuestionId : Nat = 23;
  var nextMessageId : Nat = 21;
  var nextOrderId : Nat = 1;

  // ── Read: Farmers ──────────────────────────────────────────────────────────

  public query func getFarmers() : async [Types.Farmer] {
    CoreLib.getFarmers(farmers)
  };

  // ── Read: Listings ────────────────────────────────────────────────────────

  public query func getListings() : async [Types.Listing] {
    CoreLib.getListings(listings)
  };

  // ── Read: Reels ───────────────────────────────────────────────────────────

  public query func getReels() : async [Types.Reel] {
    CoreLib.getReels(reels)
  };

  // ── Read: Q&A ─────────────────────────────────────────────────────────────

  public query func getQA() : async [Types.Question] {
    CoreLib.getQuestions(questions)
  };

  public query func getAnswers(questionId : Nat) : async [Types.Answer] {
    CoreLib.getAnswers(answers, questionId)
  };

  // ── Read: Groups ──────────────────────────────────────────────────────────

  public query func getGroups() : async [Types.Group] {
    CoreLib.getGroups(groups)
  };

  public query func getGroupMessages(groupId : Nat) : async [Types.GroupMessage] {
    CoreLib.getGroupMessages(groupMessages, groupId)
  };

  // ── Read: Services ────────────────────────────────────────────────────────

  public query func getServices() : async {
    machinery : [Types.MachineryListing];
    logistics : [Types.LogisticsListing];
    experts : [Types.ExpertProfile];
  } {
    {
      machinery = CoreLib.getMachinery(machinery);
      logistics = CoreLib.getLogistics(logistics);
      experts = CoreLib.getExperts(experts);
    }
  };

  // ── Read: Alerts ──────────────────────────────────────────────────────────

  public query func getAlerts() : async [Types.Alert] {
    CoreLib.getAlerts(alerts)
  };

  // ── Read: Orders ──────────────────────────────────────────────────────────

  public query func getOrders() : async [Types.Order] {
    CoreLib.getOrders(orders)
  };

  // ── Write: Listings ───────────────────────────────────────────────────────

  public shared func createListing(input : Types.CreateListingInput) : async Types.Listing {
    let id = nextListingId;
    nextListingId += 1;
    CoreLib.createListing(listings, id, input, Time.now())
  };

  // ── Write: Reels ──────────────────────────────────────────────────────────

  public shared func createReel(input : Types.CreateReelInput) : async Types.Reel {
    let id = nextReelId;
    nextReelId += 1;
    CoreLib.createReel(reels, id, input)
  };

  // ── Write: Q&A ────────────────────────────────────────────────────────────

  public shared func createQuestion(input : Types.CreateQuestionInput) : async Types.Question {
    let id = nextQuestionId;
    nextQuestionId += 1;
    CoreLib.createQuestion(questions, id, input, Time.now())
  };

  // ── Write: Orders ─────────────────────────────────────────────────────────

  public shared func submitOrder(input : Types.SubmitOrderInput) : async Types.Order {
    let id = nextOrderId;
    nextOrderId += 1;
    CoreLib.submitOrder(orders, id, input, Time.now())
  };

  // ── Write: Group Messages ─────────────────────────────────────────────────

  public shared func addGroupMessage(input : Types.AddGroupMessageInput) : async Types.GroupMessage {
    let id = nextMessageId;
    nextMessageId += 1;
    CoreLib.addGroupMessage(groupMessages, id, input, Time.now())
  };

  // ── Read: Seasonal Alerts ─────────────────────────────────────────────────

  public query func get_seasonal_alerts() : async [Types.SeasonalAlert] {
    CoreLib.getSeasonalAlerts(seasonalAlerts)
  };

  // ── Read: Market Price Ticks ──────────────────────────────────────────────

  public query func get_market_price_ticks() : async [Types.MarketPriceTick] {
    CoreLib.getMarketPriceTicks(marketPriceTicks)
  };

  // ── Read/Write: Seller Listings ───────────────────────────────────────────

  var nextSellerListingId : Nat = 16;

  public query func get_seller_listings() : async [Types.SellerListing] {
    CoreLib.getSellerListings(sellerListings)
  };

  public query func get_seller_listing(id : Nat) : async ?Types.SellerListing {
    CoreLib.getSellerListing(sellerListings, id)
  };

  public shared func add_seller_listing(input : Types.CreateSellerListingInput) : async Types.SellerListing {
    let id = nextSellerListingId;
    nextSellerListingId += 1;
    CoreLib.addSellerListing(sellerListings, id, input, Time.now())
  };

  // ── Read: Sales Analytics ─────────────────────────────────────────────────

  public query func get_sales_analytics() : async [Types.SalesAnalytics] {
    CoreLib.getSalesAnalytics(salesAnalytics)
  };

  // ── Read: Inventory Items ─────────────────────────────────────────────────

  public query func get_inventory_items() : async [Types.InventoryItem] {
    CoreLib.getInventoryItems(inventoryItems)
  };

  // ── Read: Team Members ────────────────────────────────────────────────────

  public query func get_team_members() : async [Types.TeamMember] {
    CoreLib.getTeamMembers(teamMembers)
  };

  // ── Read/Write: KYC Records ───────────────────────────────────────────────

  var nextKycId : Nat = 4;

  public query func get_kyc_records() : async [Types.KycRecord] {
    CoreLib.getKycRecords(kycRecords)
  };

  public shared func add_kyc_record(userId : Nat) : async Types.KycRecord {
    let id = nextKycId;
    nextKycId += 1;
    CoreLib.addKycRecord(kycRecords, id, userId)
  };

  public shared func update_kyc_status(id : Nat, status : Types.KycVerificationStatus) : async Bool {
    CoreLib.updateKycStatus(kycRecords, id, status)
  };

  // ── Read/Write: Dispute Cases ─────────────────────────────────────────────

  var nextDisputeId : Nat = 3;

  public query func get_dispute_cases() : async [Types.DisputeCase] {
    CoreLib.getDisputeCases(disputeCases)
  };

  public shared func add_dispute_case(orderId : Nat, evidence : [Text]) : async Types.DisputeCase {
    let id = nextDisputeId;
    nextDisputeId += 1;
    CoreLib.addDisputeCase(disputeCases, id, orderId, evidence, Time.now())
  };

  // ── Read: Planting Entries ────────────────────────────────────────────────

  public query func get_planting_entries() : async [Types.PlantingEntry] {
    CoreLib.getPlantingEntries(plantingEntries)
  };

  // ── Read: Market Prices ───────────────────────────────────────────────────

  public query func get_market_prices() : async [Types.MarketPrice] {
    CoreLib.getMarketPrices(marketPrices)
  };

  // ── Read: Equipment Guides ────────────────────────────────────────────────

  public query func get_equipment_guides() : async [Types.EquipmentGuide] {
    CoreLib.getEquipmentGuides(equipmentGuides)
  };

  // ── Read/Write: Forum Posts ───────────────────────────────────────────────

  var nextForumPostId : Nat = 7;

  public query func get_forum_posts() : async [Types.ForumPost] {
    CoreLib.getForumPosts(forumPosts)
  };

  public shared func add_forum_post(author : Text, title : Text, body : Text) : async Types.ForumPost {
    let id = nextForumPostId;
    nextForumPostId += 1;
    CoreLib.addForumPost(forumPosts, id, author, title, body)
  };
};
