import Types "types/core";
import CoreApi "mixins/core-api";
import RCSMApi "mixins/roles-courses-streams-messages-api";
import CoreLib "lib/core";
import RCSMLib "lib/roles-courses-streams-messages";
import List "mo:core/List";

actor {
  // ── Farmer & profile state ─────────────────────────────────────────────────
  let farmers = List.empty<Types.Farmer>();

  // ── Produce listings state ─────────────────────────────────────────────────
  let listings = List.empty<Types.Listing>();

  // ── Reels state ────────────────────────────────────────────────────────────
  let reels = List.empty<Types.Reel>();

  // ── Q&A state ──────────────────────────────────────────────────────────────
  let questions = List.empty<Types.Question>();
  let answers = List.empty<Types.Answer>();

  // ── Groups & messages state ────────────────────────────────────────────────
  let groups = List.empty<Types.Group>();
  let groupMessages = List.empty<Types.GroupMessage>();

  // ── Services state ─────────────────────────────────────────────────────────
  let machinery = List.empty<Types.MachineryListing>();
  let logistics = List.empty<Types.LogisticsListing>();
  let experts = List.empty<Types.ExpertProfile>();

  // ── Alerts state ───────────────────────────────────────────────────────────
  let alerts = List.empty<Types.Alert>();

  // ── Orders state ───────────────────────────────────────────────────────────
  let orders = List.empty<Types.Order>();

  // ── Educators & courses state ──────────────────────────────────────────────
  let educators = List.empty<Types.Educator>();
  let courses = List.empty<Types.Course>();
  let lessons = List.empty<Types.Lesson>();
  let enrollments = List.empty<Types.Enrollment>();
  let certifications = List.empty<Types.Certification>();

  // ── Live streams state ─────────────────────────────────────────────────────
  let liveStreams = List.empty<Types.LiveStream>();

  // ── Messaging state ────────────────────────────────────────────────────────
  let directMessages = List.empty<Types.DirectMessage>();
  let conversations = List.empty<Types.Conversation>();

  // ── Notifications state ────────────────────────────────────────────────────
  let notifications = List.empty<Types.Notification>();

  // ── Seasonal alerts & market price ticks state ────────────────────────────
  let seasonalAlerts = List.empty<Types.SeasonalAlert>();
  let marketPriceTicks = List.empty<Types.MarketPriceTick>();

  // ── Seller listings state ─────────────────────────────────────────────────
  let sellerListings = List.empty<Types.SellerListing>();

  // ── Analytics & inventory state ───────────────────────────────────────────
  let salesAnalytics = List.empty<Types.SalesAnalytics>();
  let inventoryItems = List.empty<Types.InventoryItem>();
  let teamMembers = List.empty<Types.TeamMember>();

  // ── Trust & safety state ──────────────────────────────────────────────────
  let kycRecords = List.empty<Types.KycRecord>();
  let disputeCases = List.empty<Types.DisputeCase>();

  // ── Resources state ───────────────────────────────────────────────────────
  let plantingEntries = List.empty<Types.PlantingEntry>();
  let marketPrices = List.empty<Types.MarketPrice>();
  let equipmentGuides = List.empty<Types.EquipmentGuide>();
  let forumPosts = List.empty<Types.ForumPost>();

  // ── Seed on first deploy ───────────────────────────────────────────────────
  do {
    CoreLib.seedFarmers(farmers);
    CoreLib.seedListings(listings);
    CoreLib.seedReels(reels);
    CoreLib.seedQuestions(questions);
    CoreLib.seedAnswers(answers);
    CoreLib.seedGroups(groups);
    CoreLib.seedGroupMessages(groupMessages);
    CoreLib.seedMachinery(machinery);
    CoreLib.seedLogistics(logistics);
    CoreLib.seedExperts(experts);
    CoreLib.seedAlerts(alerts);
    CoreLib.seedSeasonalAlerts(seasonalAlerts);
    CoreLib.seedMarketPriceTicks(marketPriceTicks);
    CoreLib.seedSellerListings(sellerListings);
    CoreLib.seedSalesAnalytics(salesAnalytics);
    CoreLib.seedInventoryItems(inventoryItems);
    CoreLib.seedTeamMembers(teamMembers);
    CoreLib.seedKycRecords(kycRecords);
    CoreLib.seedDisputeCases(disputeCases);
    CoreLib.seedPlantingEntries(plantingEntries);
    CoreLib.seedMarketPrices(marketPrices);
    CoreLib.seedEquipmentGuides(equipmentGuides);
    CoreLib.seedForumPosts(forumPosts);
    RCSMLib.seedEducators(educators);
    RCSMLib.seedCourses(courses);
    RCSMLib.seedLessons(lessons);
    RCSMLib.seedLiveStreams(liveStreams);
  };

  // ── Mixin composition ──────────────────────────────────────────────────────
  include CoreApi(
    farmers,
    listings,
    reels,
    questions,
    answers,
    groups,
    groupMessages,
    machinery,
    logistics,
    experts,
    alerts,
    orders,
    seasonalAlerts,
    marketPriceTicks,
    sellerListings,
    salesAnalytics,
    inventoryItems,
    teamMembers,
    kycRecords,
    disputeCases,
    plantingEntries,
    marketPrices,
    equipmentGuides,
    forumPosts,
  );

  include RCSMApi(
    educators,
    courses,
    lessons,
    enrollments,
    certifications,
    liveStreams,
    directMessages,
    conversations,
    notifications,
  );
};
