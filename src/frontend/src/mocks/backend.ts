import type {
  backendInterface,
  Farmer,
  Listing,
  Reel,
  Question,
  Answer,
  Group,
  GroupMessage,
  MachineryListing,
  LogisticsListing,
  ExpertProfile,
  Alert,
  Order,
  AddGroupMessageInput,
  CreateListingInput,
  CreateQuestionInput,
  CreateReelInput,
  SubmitOrderInput,
  Course,
  Educator,
  LiveStream,
  Notification,
  Conversation,
  DirectMessage,
  Enrollment,
  CreateCourseInput,
  CreateEnrollmentInput,
} from "../backend";
import { AlertType, KycStatus, NotifPriority, NotifType, OrderStatus, ProduceCategory, StreamStatus } from "../backend";
import {
  AlertSeverity,
  type SeasonalAlert,
  type MarketPriceTick,
  type SellerListing,
  type SalesAnalytics,
  type InventoryItem,
  type TeamMember,
  type KycRecord,
  type DisputeCase,
  type PlantingEntry,
  type MarketPrice,
  type EquipmentGuide,
  type ForumPost,
} from "../types";

const farmers: Farmer[] = [
  { id: BigInt(1), name: "Rajan Kumar", avatarUrl: "https://picsum.photos/seed/f1/80/80", location: "Amritsar, Punjab", kycStatus: KycStatus.Verified, rating: 4.8, numListings: BigInt(12), bio: "Wheat and rice farmer with 20 years of experience in the Punjab heartland." },
  { id: BigInt(2), name: "Priya Devi", avatarUrl: "https://picsum.photos/seed/f2/80/80", location: "Nashik, Maharashtra", kycStatus: KycStatus.Verified, rating: 4.7, numListings: BigInt(8), bio: "Certified organic grape and onion grower supplying to export markets." },
  { id: BigInt(3), name: "Suresh Patel", avatarUrl: "https://picsum.photos/seed/f3/80/80", location: "Anand, Gujarat", kycStatus: KycStatus.Verified, rating: 4.9, numListings: BigInt(15), bio: "Third-generation dairy farmer running an award-winning cooperative." },
  { id: BigInt(4), name: "Lakshmi Rao", avatarUrl: "https://picsum.photos/seed/f4/80/80", location: "Guntur, Andhra Pradesh", kycStatus: KycStatus.Pending, rating: 4.2, numListings: BigInt(6), bio: "Chili and tobacco specialist; pioneering eco-friendly pest management." },
  { id: BigInt(5), name: "Harpreet Singh", avatarUrl: "https://picsum.photos/seed/f5/80/80", location: "Ludhiana, Punjab", kycStatus: KycStatus.Verified, rating: 4.6, numListings: BigInt(10), bio: "Paddy and maize cultivator using smart irrigation across 40 acres." },
  { id: BigInt(6), name: "Kavitha Nair", avatarUrl: "https://picsum.photos/seed/f6/80/80", location: "Thrissur, Kerala", kycStatus: KycStatus.Verified, rating: 4.5, numListings: BigInt(9), bio: "Specialty spice farmer growing cardamom, pepper, and vanilla." },
  { id: BigInt(7), name: "Ramesh Yadav", avatarUrl: "https://picsum.photos/seed/f7/80/80", location: "Varanasi, Uttar Pradesh", kycStatus: KycStatus.Unverified, rating: 3.9, numListings: BigInt(4), bio: "Vegetable grower serving local mandis with fresh seasonal produce." },
  { id: BigInt(8), name: "Anita Sharma", avatarUrl: "https://picsum.photos/seed/f8/80/80", location: "Jaipur, Rajasthan", kycStatus: KycStatus.Verified, rating: 4.7, numListings: BigInt(11), bio: "Poultry and dairy producer; runs a certified free-range egg unit." },
  { id: BigInt(15), name: "Naresh Reddy", avatarUrl: "https://picsum.photos/seed/f15/80/80", location: "Hyderabad, Telangana", kycStatus: KycStatus.Verified, rating: 4.8, numListings: BigInt(13), bio: "Tech-savvy farmer using IoT sensors for precision cotton cultivation." },
  { id: BigInt(16), name: "Meena Bisht", avatarUrl: "https://picsum.photos/seed/f16/80/80", location: "Dehradun, Uttarakhand", kycStatus: KycStatus.Verified, rating: 4.6, numListings: BigInt(6), bio: "Organic apple and pear grower in the Himalayan foothills." },
];

const listings: Listing[] = [
  { id: BigInt(1), farmerId: BigInt(1), name: "Fresh Tomatoes", category: ProduceCategory.Vegetables, price: 35.0, imageUrl: "https://picsum.photos/seed/p10/400/300", description: "Plump, sun-ripened tomatoes, ideal for cooking and salads.", rating: 4.5, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(2), farmerId: BigInt(7), name: "Green Peas", category: ProduceCategory.Vegetables, price: 60.0, imageUrl: "https://picsum.photos/seed/p11/400/300", description: "Freshly shelled green peas, sweet and tender.", rating: 4.3, escrowEnabled: false, createdAt: BigInt(0) },
  { id: BigInt(3), farmerId: BigInt(4), name: "Red Chili (Dry)", category: ProduceCategory.Vegetables, price: 180.0, imageUrl: "https://picsum.photos/seed/p12/400/300", description: "Sun-dried Guntur red chili, medium-hot variety.", rating: 4.7, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(11), farmerId: BigInt(13), name: "Alphonso Mangoes", category: ProduceCategory.Fruits, price: 250.0, imageUrl: "https://picsum.photos/seed/p20/400/300", description: "Certified GI-tagged Alphonso mangoes from Ratnagiri.", rating: 4.9, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(12), farmerId: BigInt(2), name: "Nashik Grapes (Green)", category: ProduceCategory.Fruits, price: 90.0, imageUrl: "https://picsum.photos/seed/p21/400/300", description: "Seedless green grapes, export-quality, sweet and crisp.", rating: 4.8, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(14), farmerId: BigInt(16), name: "Himalayan Apples", category: ProduceCategory.Fruits, price: 120.0, imageUrl: "https://picsum.photos/seed/p23/400/300", description: "Organic red and golden apples from Dehradun farms.", rating: 4.7, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(18), farmerId: BigInt(1), name: "Basmati Rice (Premium)", category: ProduceCategory.Grains, price: 85.0, imageUrl: "https://picsum.photos/seed/p30/400/300", description: "Long-grain aromatic basmati from the Punjab plains.", rating: 4.9, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(26), farmerId: BigInt(3), name: "Full-Cream Milk (5L)", category: ProduceCategory.Dairy, price: 280.0, imageUrl: "https://picsum.photos/seed/p40/400/300", description: "Pure A2 milk from Gir cow herd, chilled and packed.", rating: 4.9, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(31), farmerId: BigInt(8), name: "Free-Range Eggs (30)", category: ProduceCategory.Eggs, price: 180.0, imageUrl: "https://picsum.photos/seed/p50/400/300", description: "Farm-fresh free-range eggs with deep-orange yolks.", rating: 4.8, escrowEnabled: true, createdAt: BigInt(0) },
  { id: BigInt(34), farmerId: BigInt(6), name: "Green Cardamom (100g)", category: ProduceCategory.Other, price: 320.0, imageUrl: "https://picsum.photos/seed/p60/400/300", description: "Premium Kerala green cardamom, intensely aromatic.", rating: 4.9, escrowEnabled: true, createdAt: BigInt(0) },
];

const reels: Reel[] = [
  { id: BigInt(1), farmerId: BigInt(1), title: "Wheat harvest timelapse", thumbnailUrl: "https://picsum.photos/seed/r1/400/600", viewCount: BigInt(12450), linkedListingId: BigInt(18) },
  { id: BigInt(2), farmerId: BigInt(2), title: "Nashik grape picking season", thumbnailUrl: "https://picsum.photos/seed/r2/400/600", viewCount: BigInt(8900), linkedListingId: BigInt(12) },
  { id: BigInt(3), farmerId: BigInt(3), title: "A day at our dairy cooperative", thumbnailUrl: "https://picsum.photos/seed/r3/400/600", viewCount: BigInt(15600), linkedListingId: BigInt(26) },
  { id: BigInt(4), farmerId: BigInt(6), title: "Cardamom plantation tour", thumbnailUrl: "https://picsum.photos/seed/r4/400/600", viewCount: BigInt(9800), linkedListingId: BigInt(34) },
  { id: BigInt(5), farmerId: BigInt(13), title: "Mango orchard — first fruits!", thumbnailUrl: "https://picsum.photos/seed/r5/400/600", viewCount: BigInt(21000), linkedListingId: BigInt(11) },
  { id: BigInt(6), farmerId: BigInt(8), title: "Free-range hens — morning rounds", thumbnailUrl: "https://picsum.photos/seed/r6/400/600", viewCount: BigInt(7300), linkedListingId: BigInt(31) },
  { id: BigInt(9), farmerId: BigInt(11), title: "Jaggery making — traditional method", thumbnailUrl: "https://picsum.photos/seed/r9/400/600", viewCount: BigInt(18700), linkedListingId: BigInt(29) },
  { id: BigInt(10), farmerId: BigInt(16), title: "Apple harvest in the Himalayas", thumbnailUrl: "https://picsum.photos/seed/r10/400/600", viewCount: BigInt(24500), linkedListingId: BigInt(14) },
];

const questions: Question[] = [
  { id: BigInt(1), authorId: BigInt(7), title: "How to control aphids on mustard?", description: "My mustard crop has severe aphid infestation. What is the best organic remedy?", category: "Pest Control", answerCount: BigInt(4), upvoteCount: BigInt(18), createdAt: BigInt(0) },
  { id: BigInt(2), authorId: BigInt(9), title: "Best price for paddy in Odisha this season?", description: "MSP is set but local traders offering less. Where can I get better rates?", category: "Pricing", answerCount: BigInt(6), upvoteCount: BigInt(25), createdAt: BigInt(0) },
  { id: BigInt(5), authorId: BigInt(1), title: "Wheat blast disease — how to identify?", description: "Seeing unusual leaf spots on my wheat. Could this be wheat blast? Photos attached.", category: "Pest Control", answerCount: BigInt(7), upvoteCount: BigInt(31), createdAt: BigInt(0) },
  { id: BigInt(10), authorId: BigInt(3), title: "Hailstorm damage — how to claim insurance?", description: "My dairy shed was damaged in a hailstorm. Steps to claim crop and asset insurance?", category: "Weather", answerCount: BigInt(6), upvoteCount: BigInt(28), createdAt: BigInt(0) },
  { id: BigInt(12), authorId: BigInt(5), title: "Maize stem borer management?", description: "Stem borers are destroying my second crop. Need advice on integrated pest management.", category: "Pest Control", answerCount: BigInt(9), upvoteCount: BigInt(36), createdAt: BigInt(0) },
];

const answers: Answer[] = [
  { id: BigInt(1), questionId: BigInt(1), authorId: BigInt(6), content: "Use neem oil spray (5ml/L) every 5 days. Also release ladybird beetles as natural predators.", upvoteCount: BigInt(12) },
  { id: BigInt(2), questionId: BigInt(1), authorId: BigInt(10), content: "IARI recommends imidacloprid seed treatment. Works well even under heavy aphid pressure.", upvoteCount: BigInt(8) },
  { id: BigInt(5), questionId: BigInt(5), authorId: BigInt(15), content: "Wheat blast shows angular grayish lesions on leaves and ears. Upload clear photos to CABI Plantwise for diagnosis.", upvoteCount: BigInt(18) },
];

const groups: Group[] = [
  { id: BigInt(1), name: "General", description: "Open forum for all AgriMarket members — questions, tips, and updates.", memberCount: BigInt(4820), iconUrl: "https://picsum.photos/seed/g1/80/80" },
  { id: BigInt(2), name: "FPOs Hub", description: "Dedicated space for Farmer Producer Organisations to share resources and best practices.", memberCount: BigInt(1250), iconUrl: "https://picsum.photos/seed/g2/80/80" },
  { id: BigInt(3), name: "Regional Support", description: "State and district-level farming discussions, local mandi rates, and government schemes.", memberCount: BigInt(3100), iconUrl: "https://picsum.photos/seed/g3/80/80" },
  { id: BigInt(4), name: "Market Tips", description: "Price forecasts, commodity news, export opportunities, and trading strategies.", memberCount: BigInt(2600), iconUrl: "https://picsum.photos/seed/g4/80/80" },
  { id: BigInt(5), name: "Equipment Exchange", description: "Buy, sell, or rent farm machinery. Tractor, harvester, and irrigation equipment listings.", memberCount: BigInt(870), iconUrl: "https://picsum.photos/seed/g5/80/80" },
];

const groupMessages: GroupMessage[] = [
  { id: BigInt(1), groupId: BigInt(1), authorId: BigInt(1), content: "Welcome everyone! Share your harvest updates here.", isVoiceMessage: false, timestamp: BigInt(0) },
  { id: BigInt(2), groupId: BigInt(1), authorId: BigInt(3), content: "Just listed our new ghee batch — check it out on marketplace!", isVoiceMessage: false, timestamp: BigInt(0) },
  { id: BigInt(3), groupId: BigInt(1), authorId: BigInt(10), content: "Soybean prices looking better in Indore today ₹4,200/qt.", isVoiceMessage: false, timestamp: BigInt(0) },
  { id: BigInt(5), groupId: BigInt(1), authorId: BigInt(15), content: "[Voice message — 0:23]", isVoiceMessage: true, timestamp: BigInt(0) },
  { id: BigInt(6), groupId: BigInt(2), authorId: BigInt(10), content: "FPO annual AGM scheduled for next Saturday at Indore NABARD office.", isVoiceMessage: false, timestamp: BigInt(0) },
];

const machinery: MachineryListing[] = [
  { id: BigInt(1), name: "Mahindra 575 DI Tractor", category: "Tractor", dailyRate: 1200.0, ownerId: BigInt(5), imageUrl: "https://picsum.photos/seed/m1/400/300", available: true },
  { id: BigInt(2), name: "Kubota Paddy Combine", category: "Harvester", dailyRate: 3500.0, ownerId: BigInt(9), imageUrl: "https://picsum.photos/seed/m2/400/300", available: true },
  { id: BigInt(3), name: "Sona Thresher (7.5 HP)", category: "Thresher", dailyRate: 800.0, ownerId: BigInt(1), imageUrl: "https://picsum.photos/seed/m3/400/300", available: false },
  { id: BigInt(4), name: "Boom Sprayer (600L)", category: "Sprayer", dailyRate: 600.0, ownerId: BigInt(15), imageUrl: "https://picsum.photos/seed/m4/400/300", available: true },
  { id: BigInt(5), name: "John Deere Rotavator", category: "Rotavator", dailyRate: 900.0, ownerId: BigInt(5), imageUrl: "https://picsum.photos/seed/m5/400/300", available: true },
];

const logistics: LogisticsListing[] = [
  { id: BigInt(1), providerName: "AgroExpress Logistics", ratePerKm: 12.0, serviceArea: "Punjab, Haryana, Delhi NCR", imageUrl: "https://picsum.photos/seed/l1/400/300" },
  { id: BigInt(2), providerName: "FarmFreight India", ratePerKm: 10.5, serviceArea: "Maharashtra, Karnataka, Goa", imageUrl: "https://picsum.photos/seed/l2/400/300" },
  { id: BigInt(3), providerName: "RuralMove Transport", ratePerKm: 9.0, serviceArea: "Uttar Pradesh, Bihar, Jharkhand", imageUrl: "https://picsum.photos/seed/l3/400/300" },
  { id: BigInt(4), providerName: "South Agri Carriers", ratePerKm: 11.0, serviceArea: "Tamil Nadu, Kerala, Andhra Pradesh", imageUrl: "https://picsum.photos/seed/l4/400/300" },
];

const experts: ExpertProfile[] = [
  { id: BigInt(1), name: "Dr. Arun Mehta", specialty: "Agronomy", hourlyRate: 500.0, available: true, imageUrl: "https://picsum.photos/seed/e1/80/80" },
  { id: BigInt(2), name: "Dr. Priya Sekharan", specialty: "Pest Management", hourlyRate: 600.0, available: true, imageUrl: "https://picsum.photos/seed/e2/80/80" },
  { id: BigInt(3), name: "CA Suresh Jha", specialty: "Pricing & Trade", hourlyRate: 750.0, available: false, imageUrl: "https://picsum.photos/seed/e3/80/80" },
  { id: BigInt(4), name: "Dr. Kamala Iyer", specialty: "Soil Science", hourlyRate: 550.0, available: true, imageUrl: "https://picsum.photos/seed/e4/80/80" },
];

const alerts: Alert[] = [
  { id: BigInt(1), alertType: AlertType.Weather, title: "Heavy Rainfall Warning", location: "Coastal Andhra Pradesh", severity: AlertSeverity.High, description: "IMD forecasts 150-200mm rainfall over 48 hours. Protect standing crops and drain low-lying fields.", timestamp: BigInt(0) },
  { id: BigInt(2), alertType: AlertType.Pest, title: "Desert Locust Alert", location: "Rajasthan, Gujarat Border", severity: AlertSeverity.Critical, description: "Locust swarms detected near Barmer. Keep crop protection sprayers ready and report sightings to district agriculture office.", timestamp: BigInt(0) },
  { id: BigInt(3), alertType: AlertType.Weather, title: "Cold Wave Warning", location: "Punjab & Haryana", severity: AlertSeverity.Medium, description: "Night temperatures to drop below 4°C over next 5 days. Cover young wheat seedlings to prevent frost damage.", timestamp: BigInt(0) },
  { id: BigInt(4), alertType: AlertType.Pest, title: "Fall Armyworm Outbreak", location: "Karnataka & Telangana", severity: AlertSeverity.High, description: "FAW larvae at damaging levels in maize fields. Apply chlorantraniliprole at egg hatching stage.", timestamp: BigInt(0) },
  { id: BigInt(5), alertType: AlertType.Weather, title: "Cyclone Preparedness Alert", location: "Odisha Coast", severity: AlertSeverity.Critical, description: "Cyclone forming in Bay of Bengal. Evacuate livestock, secure equipment, and delay harvest operations.", timestamp: BigInt(0) },
  { id: BigInt(7), alertType: AlertType.Weather, title: "Hailstorm Risk Advisory", location: "Madhya Pradesh", severity: AlertSeverity.Medium, description: "Severe thunderstorms with hail possible in Vidisha and Sehore districts. File crop insurance report if damage occurs.", timestamp: BigInt(0) },
  { id: BigInt(11), alertType: AlertType.Weather, title: "Fog Advisory — Rabi Crops", location: "Indo-Gangetic Plains", severity: AlertSeverity.Low, description: "Dense fog expected for 10+ days. Rabi wheat may face reduced photosynthesis. Ensure drainage to prevent foot rot.", timestamp: BigInt(0) },
];

const orders: Order[] = [
  { id: BigInt(1), status: OrderStatus.Delivered, total: 350.0, listingId: BigInt(1), createdAt: BigInt(0), buyerId: BigInt(99), quantity: BigInt(10) },
  { id: BigInt(2), status: OrderStatus.Shipped, total: 250.0, listingId: BigInt(11), createdAt: BigInt(0), buyerId: BigInt(99), quantity: BigInt(1) },
];

// ─── Educators (exact backend type) ─────────────────────────────────────────
const educators: Educator[] = [
  { id: BigInt(1), name: "Dr. Ramesh Singh", avatarUrl: "https://picsum.photos/seed/edu1/80/80", specialty: "Precision Irrigation", bio: "ICAR scientist with 15+ years teaching water management to farmers.", kycStatus: KycStatus.Verified, courseCount: BigInt(8), studentCount: BigInt(12400), rating: 4.9 },
  { id: BigInt(2), name: "Saham Hanani", avatarUrl: "https://picsum.photos/seed/edu2/80/80", specialty: "Soil Health Management", bio: "PhD in Soil Science; runs national soil testing workshops.", kycStatus: KycStatus.Verified, courseCount: BigInt(5), studentCount: BigInt(8600), rating: 4.8 },
  { id: BigInt(3), name: "Prof. Aruna Menon", avatarUrl: "https://picsum.photos/seed/edu3/80/80", specialty: "Organic Farming", bio: "Pioneer of zero-budget natural farming in Kerala.", kycStatus: KycStatus.Verified, courseCount: BigInt(11), studentCount: BigInt(19200), rating: 4.9 },
  { id: BigInt(4), name: "Vikram Bhat", avatarUrl: "https://picsum.photos/seed/edu4/80/80", specialty: "AgriTech & Drones", bio: "Drone applications in precision agriculture and crop monitoring.", kycStatus: KycStatus.Verified, courseCount: BigInt(4), studentCount: BigInt(5100), rating: 4.7 },
  { id: BigInt(5), name: "Dr. Sunita Gupta", avatarUrl: "https://picsum.photos/seed/edu5/80/80", specialty: "Farm Business Management", bio: "CA + agricultural economist; helps farmers maximize profit margins.", kycStatus: KycStatus.Unverified, courseCount: BigInt(6), studentCount: BigInt(7800), rating: 4.6 },
  { id: BigInt(6), name: "Manpreet Kaur", avatarUrl: "https://picsum.photos/seed/edu6/80/80", specialty: "Livestock & Dairy", bio: "Veterinary doctor teaching dairy management and herd health.", kycStatus: KycStatus.Verified, courseCount: BigInt(7), studentCount: BigInt(9300), rating: 4.8 },
];

// ─── Courses (exact backend type) ────────────────────────────────────────────
// durationMinutes = durationHours * 60; price=0 means free; level is a plain string
const courses: Course[] = [
  { id: BigInt(1), educatorId: BigInt(1), title: "Precision Irrigation Techniques", description: "Learn drip, sprinkler and smart irrigation using sensors.", thumbnailUrl: "https://picsum.photos/seed/c1/400/250", price: 0, category: "Farming", level: "beginner", durationMinutes: BigInt(360), isCertified: true, rating: 4.9, enrollmentCount: BigInt(8200), createdAt: BigInt(0) },
  { id: BigInt(2), educatorId: BigInt(2), title: "Soil Health Management", description: "Comprehensive guide to soil testing, composting and amendments.", thumbnailUrl: "https://picsum.photos/seed/c2/400/250", price: 0, category: "Farming", level: "beginner", durationMinutes: BigInt(480), isCertified: true, rating: 4.8, enrollmentCount: BigInt(6100), createdAt: BigInt(0) },
  { id: BigInt(3), educatorId: BigInt(3), title: "Zero-Budget Natural Farming", description: "Subhash Palekar method for chemical-free cultivation.", thumbnailUrl: "https://picsum.photos/seed/c3/400/250", price: 299, category: "Farming", level: "intermediate", durationMinutes: BigInt(720), isCertified: true, rating: 4.9, enrollmentCount: BigInt(14500), createdAt: BigInt(0) },
  { id: BigInt(4), educatorId: BigInt(4), title: "Drone Applications in Agriculture", description: "Use drones for crop monitoring, spraying, and field mapping.", thumbnailUrl: "https://picsum.photos/seed/c4/400/250", price: 499, category: "Equipment", level: "intermediate", durationMinutes: BigInt(600), isCertified: true, rating: 4.7, enrollmentCount: BigInt(3200), createdAt: BigInt(0) },
  { id: BigInt(5), educatorId: BigInt(5), title: "Farm Financial Planning", description: "Budgeting, loans, subsidy schemes, and profitability analysis.", thumbnailUrl: "https://picsum.photos/seed/c5/400/250", price: 399, category: "Business", level: "beginner", durationMinutes: BigInt(420), isCertified: false, rating: 4.6, enrollmentCount: BigInt(5600), createdAt: BigInt(0) },
  { id: BigInt(6), educatorId: BigInt(6), title: "Dairy Farm Management", description: "Modern dairy practices, milk quality, and herd health.", thumbnailUrl: "https://picsum.photos/seed/c6/400/250", price: 0, category: "Farming", level: "beginner", durationMinutes: BigInt(540), isCertified: true, rating: 4.8, enrollmentCount: BigInt(7100), createdAt: BigInt(0) },
  { id: BigInt(7), educatorId: BigInt(1), title: "Smart Greenhouse Design", description: "Build and manage greenhouse with IoT sensors and automation.", thumbnailUrl: "https://picsum.photos/seed/c7/400/250", price: 599, category: "Equipment", level: "advanced", durationMinutes: BigInt(840), isCertified: false, rating: 4.7, enrollmentCount: BigInt(2100), createdAt: BigInt(0) },
  { id: BigInt(8), educatorId: BigInt(3), title: "Integrated Pest Management", description: "IPM strategies for sustainable crop protection without chemicals.", thumbnailUrl: "https://picsum.photos/seed/c8/400/250", price: 249, category: "Farming", level: "intermediate", durationMinutes: BigInt(600), isCertified: true, rating: 4.9, enrollmentCount: BigInt(9800), createdAt: BigInt(0) },
  { id: BigInt(9), educatorId: BigInt(2), title: "Composting & Vermicomposting", description: "Turn farm waste into high-value organic fertilizer.", thumbnailUrl: "https://picsum.photos/seed/c9/400/250", price: 0, category: "Farming", level: "beginner", durationMinutes: BigInt(240), isCertified: false, rating: 4.8, enrollmentCount: BigInt(11200), createdAt: BigInt(0) },
  { id: BigInt(10), educatorId: BigInt(4), title: "FPO Formation & Management", description: "How to form, register and run a successful Farmer Producer Organisation.", thumbnailUrl: "https://picsum.photos/seed/c10/400/250", price: 349, category: "Business", level: "advanced", durationMinutes: BigInt(960), isCertified: true, rating: 4.7, enrollmentCount: BigInt(1800), createdAt: BigInt(0) },
  { id: BigInt(11), educatorId: BigInt(5), title: "Govt Schemes for Farmers", description: "PM-Kisan, PMFBY, KCC, and all subsidies explained simply.", thumbnailUrl: "https://picsum.photos/seed/c11/400/250", price: 0, category: "Business", level: "beginner", durationMinutes: BigInt(180), isCertified: false, rating: 4.9, enrollmentCount: BigInt(22000), createdAt: BigInt(0) },
  { id: BigInt(12), educatorId: BigInt(6), title: "Poultry Farming Essentials", description: "Layer and broiler setup, feed management, disease prevention.", thumbnailUrl: "https://picsum.photos/seed/c12/400/250", price: 299, category: "Farming", level: "beginner", durationMinutes: BigInt(480), isCertified: false, rating: 4.6, enrollmentCount: BigInt(4400), createdAt: BigInt(0) },
];

// ─── Live Streams (exact backend type) ───────────────────────────────────────
const liveStreams: LiveStream[] = [
  { id: BigInt(1), hostId: BigInt(1), title: "Precision Irrigation Techniques on Waterlogged Soil", thumbnailUrl: "https://picsum.photos/seed/ls1/400/250", description: "Live Q&A on handling excess moisture in farm fields.", status: StreamStatus.Live, viewerCount: BigInt(193000), scheduledAt: BigInt(Date.now()), startedAt: BigInt(Date.now() - 3600000) },
  { id: BigInt(2), hostId: BigInt(2), title: "Upcoming Webinars on Agricultural Soil Techniques", thumbnailUrl: "https://picsum.photos/seed/ls2/400/250", description: "Interactive session on soil health and amendments.", status: StreamStatus.Live, viewerCount: BigInt(133000), scheduledAt: BigInt(Date.now()), startedAt: BigInt(Date.now() - 1800000) },
  { id: BigInt(3), hostId: BigInt(6), title: "Soil Health Manager — Live Q&A", thumbnailUrl: "https://picsum.photos/seed/ls3/400/250", description: "Open Q&A on soil testing and remediation strategies.", status: StreamStatus.Live, viewerCount: BigInt(87000), scheduledAt: BigInt(Date.now()), startedAt: BigInt(Date.now() - 900000) },
  { id: BigInt(4), hostId: BigInt(4), title: "Drone Spraying Demo — Rabi Season", thumbnailUrl: "https://picsum.photos/seed/ls4/400/250", description: "Live drone spraying demonstration for wheat crops.", status: StreamStatus.Scheduled, viewerCount: BigInt(0), scheduledAt: BigInt(Date.now() + 86400000) },
];

// ─── Notifications (exact backend type) ──────────────────────────────────────
const notifications: Notification[] = [
  { id: BigInt(1), userId: BigInt(1), notifType: NotifType.Transaction, title: "Order #2048 Delivered", body: "Your Alphonso Mangoes order has been delivered.", priority: NotifPriority.High, isRead: false, createdAt: BigInt(Date.now() - 120000) },
  { id: BigInt(2), userId: BigInt(1), notifType: NotifType.Educational, title: "New Lesson Available", body: "Precision Irrigation Techniques — Module 3 is live.", priority: NotifPriority.Medium, isRead: false, createdAt: BigInt(Date.now() - 3600000) },
  { id: BigInt(3), userId: BigInt(1), notifType: NotifType.MarketIntelligence, title: "Tomato Price Spike", body: "Tomato prices up 18% in Maharashtra markets.", priority: NotifPriority.Medium, isRead: true, createdAt: BigInt(Date.now() - 10800000) },
  { id: BigInt(4), userId: BigInt(1), notifType: NotifType.Emergency, title: "Pest Alert: Fall Armyworm", body: "FAW detected in Karnataka maize belt. Take action now.", priority: NotifPriority.Critical, isRead: false, createdAt: BigInt(Date.now() - 18000000) },
  { id: BigInt(5), userId: BigInt(1), notifType: NotifType.SystemAlert, title: "KYC Reminder", body: "Complete your KYC to unlock all features.", priority: NotifPriority.Low, isRead: true, createdAt: BigInt(Date.now() - 86400000) },
  { id: BigInt(6), userId: BigInt(1), notifType: NotifType.Transaction, title: "Payment Received", body: "₹4,200 has been released from escrow for Order #2041.", priority: NotifPriority.High, isRead: false, createdAt: BigInt(Date.now() - 172800000) },
  { id: BigInt(7), userId: BigInt(1), notifType: NotifType.Educational, title: "Certificate Earned", body: "You earned the ICAR Precision Irrigation certificate!", priority: NotifPriority.Medium, isRead: true, createdAt: BigInt(Date.now() - 259200000) },
  { id: BigInt(8), userId: BigInt(1), notifType: NotifType.MarketIntelligence, title: "Wheat MSP Announced", body: "Govt announces ₹2,275/qtl MSP for Rabi wheat 2026-27.", priority: NotifPriority.High, isRead: false, createdAt: BigInt(Date.now() - 345600000) },
];

// ─── Conversations (exact backend type) ──────────────────────────────────────
const conversations: Conversation[] = [
  { id: BigInt(1), participantIds: [BigInt(1), BigInt(2)], lastMessage: "Can you deliver by Thursday?", lastMessageAt: BigInt(Date.now() - 600000), unreadCount: BigInt(2) },
  { id: BigInt(2), participantIds: [BigInt(1), BigInt(3)], lastMessage: "Yes, the ghee batch is ready.", lastMessageAt: BigInt(Date.now() - 7200000), unreadCount: BigInt(0) },
  { id: BigInt(3), participantIds: [BigInt(1), BigInt(101)], lastMessage: "I recommend soil testing first.", lastMessageAt: BigInt(Date.now() - 86400000), unreadCount: BigInt(1) },
  { id: BigInt(4), participantIds: [BigInt(1), BigInt(5)], lastMessage: "Tractor is available next week.", lastMessageAt: BigInt(Date.now() - 172800000), unreadCount: BigInt(0) },
  { id: BigInt(5), participantIds: [BigInt(1), BigInt(201)], lastMessage: "Your shipment has been picked up.", lastMessageAt: BigInt(Date.now() - 259200000), unreadCount: BigInt(0) },
];

const directMessages: DirectMessage[] = [
  { id: BigInt(1), senderId: BigInt(2), receiverId: BigInt(1), content: "Hello! Are you still selling Basmati?", isVoiceMessage: false, timestamp: BigInt(Date.now() - 1200000), isRead: true },
  { id: BigInt(2), senderId: BigInt(1), receiverId: BigInt(2), content: "Yes, 50kg available. ₹85/kg.", isVoiceMessage: false, timestamp: BigInt(Date.now() - 900000), isRead: true },
  { id: BigInt(3), senderId: BigInt(2), receiverId: BigInt(1), content: "Can you deliver by Thursday?", isVoiceMessage: false, timestamp: BigInt(Date.now() - 600000), isRead: false },
];

let nextId = 200;

export const mockBackend: backendInterface & {
  getEducators(): Promise<Educator[]>;
  getCourses(): Promise<Course[]>;
  getLiveStreams(): Promise<LiveStream[]>;
  getNotifications(userId: bigint): Promise<Notification[]>;
  getConversations(userId: bigint): Promise<Conversation[]>;
  getDirectMessages(conversationId: bigint): Promise<DirectMessage[]>;
  sendDirectMessage(input: { conversationId: bigint; senderId: bigint; receiverId: bigint; content: string; isVoiceMessage: boolean }): Promise<DirectMessage>;
  createCourse(input: CreateCourseInput): Promise<Course>;
  enrollInCourse(input: CreateEnrollmentInput): Promise<Enrollment>;
} = {
  // ─── Existing backend methods ──────────────────────────────────────────────
  addGroupMessage: async (input: AddGroupMessageInput): Promise<GroupMessage> => {
    const msg: GroupMessage = {
      id: BigInt(nextId++),
      groupId: input.groupId,
      authorId: input.authorId,
      content: input.content,
      isVoiceMessage: input.isVoiceMessage,
      timestamp: BigInt(Date.now()),
    };
    groupMessages.push(msg);
    return msg;
  },

  createListing: async (input: CreateListingInput): Promise<Listing> => {
    const listing: Listing = {
      id: BigInt(nextId++),
      farmerId: input.farmerId,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      category: input.category,
      price: input.price,
      escrowEnabled: input.escrowEnabled,
      rating: 0,
      createdAt: BigInt(Date.now()),
    };
    listings.push(listing);
    return listing;
  },

  createQuestion: async (input: CreateQuestionInput): Promise<Question> => {
    const q: Question = {
      id: BigInt(nextId++),
      authorId: input.authorId,
      title: input.title,
      description: input.description,
      category: input.category,
      answerCount: BigInt(0),
      upvoteCount: BigInt(0),
      createdAt: BigInt(Date.now()),
    };
    questions.push(q);
    return q;
  },

  createReel: async (input: CreateReelInput): Promise<Reel> => {
    const reel: Reel = {
      id: BigInt(nextId++),
      farmerId: input.farmerId,
      title: input.title,
      thumbnailUrl: input.thumbnailUrl,
      viewCount: BigInt(0),
      linkedListingId: input.linkedListingId,
    };
    reels.push(reel);
    return reel;
  },

  getAlerts: async (): Promise<Alert[]> => alerts,
  getAnswers: async (questionId: bigint): Promise<Answer[]> => answers.filter(a => a.questionId === questionId),
  getFarmers: async (): Promise<Farmer[]> => farmers,
  getGroupMessages: async (groupId: bigint): Promise<GroupMessage[]> => groupMessages.filter(m => m.groupId === groupId),
  getGroups: async (): Promise<Group[]> => groups,
  getListings: async (): Promise<Listing[]> => listings,
  getOrders: async (): Promise<Order[]> => orders,
  getQA: async (): Promise<Question[]> => questions,
  getReels: async (): Promise<Reel[]> => reels,
  getServices: async () => ({ logistics, experts, machinery }),

  submitOrder: async (input: SubmitOrderInput): Promise<Order> => {
    const order: Order = {
      id: BigInt(nextId++),
      buyerId: input.buyerId,
      listingId: input.listingId,
      quantity: input.quantity,
      total: input.total,
      status: OrderStatus.Pending,
      createdAt: BigInt(Date.now()),
    };
    orders.push(order);
    return order;
  },

  // ─── New methods ──────────────────────────────────────────────────────────
  getEducators: async (): Promise<Educator[]> => educators,
  getCourses: async (): Promise<Course[]> => courses,
  getLiveStreams: async (): Promise<LiveStream[]> => liveStreams,

  getNotifications: async (userId: bigint): Promise<Notification[]> =>
    notifications.filter(n => n.userId === userId),

  getConversations: async (userId: bigint): Promise<Conversation[]> =>
    conversations.filter(c => c.participantIds.some(id => id === userId)),

  getDirectMessages: async (conversationId: bigint): Promise<DirectMessage[]> =>
    directMessages.filter(m => {
      const conv = conversations.find(c => c.id === conversationId);
      if (!conv) return false;
      return conv.participantIds.includes(m.senderId) || conv.participantIds.includes(m.receiverId);
    }),

  sendDirectMessage: async (input): Promise<DirectMessage> => {
    const msg: DirectMessage = {
      id: BigInt(nextId++),
      senderId: input.senderId,
      receiverId: input.receiverId,
      content: input.content,
      isVoiceMessage: input.isVoiceMessage,
      timestamp: BigInt(Date.now()),
      isRead: false,
    };
    directMessages.push(msg);
    return msg;
  },

  markNotificationRead: async (notifId: bigint): Promise<boolean> => {
    const n = notifications.find(x => x.id === notifId);
    if (n) { n.isRead = true; return true; }
    return false;
  },

  createCourse: async (input: CreateCourseInput): Promise<Course> => {
    const course: Course = {
      ...input,
      id: BigInt(nextId++),
      enrollmentCount: BigInt(0),
      rating: 0,
      createdAt: BigInt(Date.now()),
    };
    courses.push(course);
    return course;
  },

  enrollInCourse: async (input: CreateEnrollmentInput): Promise<Enrollment> => ({
    id: BigInt(nextId++),
    courseId: input.courseId,
    userId: input.userId,
    progress: 0,
    enrolledAt: BigInt(Date.now()),
  }),

  // ─── Backend interface stubs for unused methods ───────────────────────────
  createLiveStream: async (input) => ({
    id: BigInt(nextId++),
    ...input,
    status: StreamStatus.Scheduled,
    viewerCount: BigInt(0),
  }),

  createNotification: async (input) => ({
    id: BigInt(nextId++),
    ...input,
    createdAt: BigInt(Date.now()),
    isRead: false,
  }),

  getCertificationsByUser: async (_userId: bigint) => [],
  getCourseById: async (_id: bigint) => null,
  getEducatorById: async (_id: bigint) => null,
  getEnrollmentsByUser: async (_userId: bigint) => [],
  getLessonsByCourse: async (_courseId: bigint) => [],
};

export const SEASONAL_ALERTS: SeasonalAlert[] = [
  { id: 1, alertType: 'Weather', cropName: 'Wheat', title: 'Heavy Rain Alert', description: 'Heavy rainfall expected in Punjab region — protect harvested crops', region: 'Punjab', severity: 'High', timestamp: Date.now() - 3600000 },
  { id: 2, alertType: 'Pest', cropName: 'Cotton', title: 'Pink Bollworm Warning', description: 'Pink bollworm infestation detected in Gujarat districts — apply neem oil', region: 'Gujarat', severity: 'High', timestamp: Date.now() - 7200000 },
  { id: 3, alertType: 'Price', cropName: 'Tomato', title: 'Price Surge Alert', description: 'Tomato wholesale prices up 40% — good time to sell bulk lots', region: 'Maharashtra', severity: 'Medium', timestamp: Date.now() - 10800000 },
  { id: 4, alertType: 'Weather', cropName: 'Rice', title: 'Drought Advisory', description: 'Below normal rainfall forecast for Andhra Pradesh — consider drip irrigation', region: 'Andhra Pradesh', severity: 'Medium', timestamp: Date.now() - 86400000 },
  { id: 5, alertType: 'Pest', cropName: 'Maize', title: 'Fall Armyworm Sighting', description: 'Fall armyworm reported in Karnataka — early intervention recommended', region: 'Karnataka', severity: 'Medium', timestamp: Date.now() - 172800000 },
];

export const MARKET_PRICE_TICKS: MarketPriceTick[] = [
  { id: 1, cropName: 'Tomato', price: 2850, changePercent: 12.5, date: Date.now() },
  { id: 2, cropName: 'Wheat', price: 2150, changePercent: -1.2, date: Date.now() },
  { id: 3, cropName: 'Rice (Basmati)', price: 7200, changePercent: 3.8, date: Date.now() },
  { id: 4, cropName: 'Potato', price: 1200, changePercent: -4.5, date: Date.now() },
  { id: 5, cropName: 'Onion', price: 1800, changePercent: 8.2, date: Date.now() },
  { id: 6, cropName: 'Maize', price: 1950, changePercent: 0.5, date: Date.now() },
  { id: 7, cropName: 'Cotton', price: 6500, changePercent: 2.1, date: Date.now() },
  { id: 8, cropName: 'Sugarcane', price: 380, changePercent: 1.0, date: Date.now() },
  { id: 9, cropName: 'Soybean', price: 4800, changePercent: -2.3, date: Date.now() },
  { id: 10, cropName: 'Chilli', price: 9500, changePercent: 15.7, date: Date.now() },
];

export const SELLER_LISTINGS: SellerListing[] = [
  { id: 1, farmerId: 1, name: 'Wheat HYV Seeds (HD-2967)', category: 'Seeds', price: 2200, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', description: 'High-yielding wheat variety, 95% germination rate, disease resistant', rating: 4.8, escrowEnabled: true, createdAt: Date.now() - 86400000, bulkUploadBatch: 'BATCH-2024-01', contractType: 'Phytosanitary', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['USDA Organic', 'ISI Certified'] },
  { id: 2, farmerId: 2, name: 'Basmati Rice Seeds (Pusa 1121)', category: 'Seeds', price: 3500, imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400', description: 'Premium basmati seeds, certified for export quality, 92% germination', rating: 4.9, escrowEnabled: true, createdAt: Date.now() - 172800000, bulkUploadBatch: 'BATCH-2024-02', contractType: 'Phytosanitary', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['APEDA Certified', 'Export Quality'] },
  { id: 3, farmerId: 3, name: 'Tomato Hybrid Seeds (Syngenta)', category: 'Seeds', price: 1800, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', description: 'F1 hybrid tomato seeds, high yield, tolerant to TYLCV', rating: 4.7, escrowEnabled: false, createdAt: Date.now() - 259200000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Net30', certifications: ['ISI Certified'] },
  { id: 4, farmerId: 1, name: 'Organic Tomatoes (Grade A)', category: 'Produce', price: 45, imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', description: 'Fresh organic tomatoes, no pesticides, same-day harvest delivery available', rating: 4.6, escrowEnabled: true, createdAt: Date.now() - 3600000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Daily', certifications: ['Organic India'] },
  { id: 5, farmerId: 4, name: 'Green Chilli (Guntur Sannam)', category: 'Produce', price: 120, imageUrl: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400', description: 'Premium Guntur chilli, ideal for export, SHU 50,000', rating: 4.5, escrowEnabled: true, createdAt: Date.now() - 7200000, bulkUploadBatch: 'BATCH-2024-03', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['APEDA', 'Spices Board India'] },
  { id: 6, farmerId: 5, name: 'Potato (Kufri Jyoti)', category: 'Produce', price: 18, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', description: 'Table variety potato, 50-100g size, excellent shelf life', rating: 4.3, escrowEnabled: false, createdAt: Date.now() - 14400000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Pending', payoutSchedule: 'Weekly', certifications: [] },
  { id: 7, farmerId: 2, name: 'Tractor John Deere 5050D (45 HP)', category: 'Equipment', price: 650000, imageUrl: 'https://images.unsplash.com/photo-1571689936114-b0a9cd81ea25?w=400', description: 'Well maintained 2020 model, 450 hours use, full service history', rating: 4.8, escrowEnabled: true, createdAt: Date.now() - 2592000000, bulkUploadBatch: '', contractType: 'Rental', verificationStatus: 'Approved', payoutSchedule: 'Net30', certifications: ['RC Book', 'Insurance Valid'] },
  { id: 8, farmerId: 3, name: 'Power Sprayer (16L Knapsack)', category: 'Equipment', price: 4500, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', description: 'Battery-powered knapsack sprayer, 16L capacity, 6-hour battery life', rating: 4.4, escrowEnabled: false, createdAt: Date.now() - 604800000, bulkUploadBatch: 'BATCH-2024-04', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: [] },
  { id: 9, farmerId: 6, name: 'Cotton Seeds (Bt Cotton Hybrid)', category: 'Seeds', price: 800, imageUrl: 'https://images.unsplash.com/photo-1612198273689-4f22af7e6b73?w=400', description: 'Bt cotton hybrid seeds, bollworm tolerant, high lint percentage', rating: 4.6, escrowEnabled: true, createdAt: Date.now() - 345600000, bulkUploadBatch: 'BATCH-2024-05', contractType: 'Phytosanitary', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['Bt Technology License', 'Seed Act Compliant'] },
  { id: 10, farmerId: 7, name: 'Fresh Onion (Nashik Red)', category: 'Produce', price: 22, imageUrl: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400', description: 'Nashik red onion, medium size, ideal for domestic and export', rating: 4.2, escrowEnabled: true, createdAt: Date.now() - 18000000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Daily', certifications: [] },
  { id: 11, farmerId: 8, name: 'Rotavator 6 Feet (Mahindra)', category: 'Equipment', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400', description: '6-ft rotavator, suitable for 50HP+ tractors, 3-point linkage', rating: 4.7, escrowEnabled: true, createdAt: Date.now() - 1209600000, bulkUploadBatch: '', contractType: 'Rental', verificationStatus: 'Approved', payoutSchedule: 'Net30', certifications: ['BIS Certification'] },
  { id: 12, farmerId: 9, name: 'Maize (Desi Yellow)', category: 'Produce', price: 25, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', description: 'Open-pollinated yellow maize, ideal for animal feed and flour', rating: 4.1, escrowEnabled: false, createdAt: Date.now() - 21600000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Expired', payoutSchedule: 'Weekly', certifications: [] },
  { id: 13, farmerId: 10, name: 'Sunflower Seeds (NS-6642)', category: 'Seeds', price: 1400, imageUrl: 'https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=400', description: 'High oleic sunflower hybrid, drought tolerant, 120-day maturity', rating: 4.5, escrowEnabled: true, createdAt: Date.now() - 432000000, bulkUploadBatch: 'BATCH-2024-06', contractType: 'Phytosanitary', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['FSII Member'] },
  { id: 14, farmerId: 4, name: 'Mini Tiller / Power Weeder (2HP)', category: 'Equipment', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', description: 'Petrol-powered mini tiller, ideal for small farms and nurseries', rating: 4.3, escrowEnabled: false, createdAt: Date.now() - 1728000000, bulkUploadBatch: '', contractType: 'None', verificationStatus: 'Pending', payoutSchedule: 'Weekly', certifications: [] },
  { id: 15, farmerId: 11, name: 'Organic Compost (50kg Bag)', category: 'Produce', price: 450, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', description: 'PGPR-enriched organic compost, certified organic, improves soil health', rating: 4.6, escrowEnabled: true, createdAt: Date.now() - 86400000, bulkUploadBatch: 'BATCH-2024-07', contractType: 'None', verificationStatus: 'Approved', payoutSchedule: 'Weekly', certifications: ['Organic India', 'NPOP Certified'] },
];

export const SALES_ANALYTICS: SalesAnalytics[] = [
  { id: 1, cropName: 'Wheat', totalRevenue: 45000, unitsSold: 2100, period: 'Monthly' },
  { id: 2, cropName: 'Rice', totalRevenue: 78000, unitsSold: 1100, period: 'Monthly' },
  { id: 3, cropName: 'Tomato', totalRevenue: 32000, unitsSold: 720, period: 'Monthly' },
  { id: 4, cropName: 'Cotton', totalRevenue: 125000, unitsSold: 195, period: 'Monthly' },
  { id: 5, cropName: 'Tomato', totalRevenue: 9500, unitsSold: 210, period: 'Weekly' },
  { id: 6, cropName: 'Wheat', totalRevenue: 11000, unitsSold: 525, period: 'Weekly' },
  { id: 7, cropName: 'Maize', totalRevenue: 21000, unitsSold: 840, period: 'Monthly' },
  { id: 8, cropName: 'Chilli', totalRevenue: 56000, unitsSold: 590, period: 'Monthly' },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 1, listingId: 1, currentStock: 5200, threshold: 500, forecastDays: 45 },
  { id: 2, listingId: 2, currentStock: 180, threshold: 200, forecastDays: 8 },
  { id: 3, listingId: 4, currentStock: 320, threshold: 100, forecastDays: 12 },
  { id: 4, listingId: 5, currentStock: 95, threshold: 150, forecastDays: 5 },
  { id: 5, listingId: 9, currentStock: 1200, threshold: 300, forecastDays: 30 },
  { id: 6, listingId: 10, currentStock: 2500, threshold: 500, forecastDays: 20 },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: 'Rajesh Kumar', role: 'Owner', permissions: ['list', 'sell', 'manage_team', 'view_analytics', 'process_payouts'], lastActive: Date.now() - 3600000 },
  { id: 2, name: 'Priya Sharma', role: 'Manager', permissions: ['list', 'sell', 'view_analytics'], lastActive: Date.now() - 7200000 },
  { id: 3, name: 'Suresh Patel', role: 'Field Staff', permissions: ['list'], lastActive: Date.now() - 86400000 },
];

export const KYC_RECORDS: KycRecord[] = [
  { id: 1, userId: 1, status: 'Verified', selfieVerified: true, idVerified: true, auditEvents: [{ action: 'Selfie uploaded', performedBy: 'User', timestamp: Date.now() - 864000000 }, { action: 'ID verified by system', performedBy: 'System', timestamp: Date.now() - 777600000 }, { action: 'KYC approved', performedBy: 'Admin', timestamp: Date.now() - 691200000 }] },
  { id: 2, userId: 2, status: 'Pending', selfieVerified: true, idVerified: false, auditEvents: [{ action: 'Selfie uploaded', performedBy: 'User', timestamp: Date.now() - 86400000 }, { action: 'ID verification pending', performedBy: 'System', timestamp: Date.now() - 43200000 }] },
  { id: 3, userId: 3, status: 'Rejected', selfieVerified: false, idVerified: false, auditEvents: [{ action: 'Selfie rejected: blurry', performedBy: 'System', timestamp: Date.now() - 172800000 }] },
];

export const DISPUTE_CASES: DisputeCase[] = [
  { id: 1, orderId: 101, status: 'Open', evidence: ['delivery_photo.jpg', 'original_invoice.pdf'], timeline: [{ event: 'Dispute opened: wrong variety delivered', timestamp: Date.now() - 172800000, performedBy: 'Buyer' }, { event: 'Evidence submitted by buyer', timestamp: Date.now() - 86400000, performedBy: 'Buyer' }, { event: 'Seller notified, response pending', timestamp: Date.now() - 43200000, performedBy: 'System' }], resolution: null },
  { id: 2, orderId: 87, status: 'Resolved', evidence: ['weighbridge_slip.pdf'], timeline: [{ event: 'Dispute opened: short weight', timestamp: Date.now() - 604800000, performedBy: 'Buyer' }, { event: 'Mediator assigned', timestamp: Date.now() - 518400000, performedBy: 'Admin' }, { event: 'Seller agreed to partial refund', timestamp: Date.now() - 432000000, performedBy: 'Seller' }, { event: 'Resolved: ₹2400 refunded', timestamp: Date.now() - 345600000, performedBy: 'Admin' }], resolution: 'Partial refund of ₹2400 issued to buyer' },
];

export const PLANTING_ENTRIES: PlantingEntry[] = [
  { id: 1, cropName: 'Wheat (Rabi)', plantDate: new Date('2024-11-15').getTime(), harvestDate: new Date('2025-04-10').getTime(), notes: 'Plot A, 2 acres, irrigation scheduled twice weekly' },
  { id: 2, cropName: 'Tomato', plantDate: new Date('2025-01-20').getTime(), harvestDate: new Date('2025-05-15').getTime(), notes: 'Greenhouse plot, drip irrigation, staking done' },
  { id: 3, cropName: 'Sunflower', plantDate: new Date('2025-02-01').getTime(), harvestDate: new Date('2025-06-15').getTime(), notes: '3 acres, Plot C, no irrigation needed (rainfed)' },
  { id: 4, cropName: 'Cotton (Kharif)', plantDate: new Date('2025-06-01').getTime(), harvestDate: new Date('2025-11-30').getTime(), notes: 'Bt Cotton, 5 acres, spray schedule loaded' },
  { id: 5, cropName: 'Maize', plantDate: new Date('2025-06-15').getTime(), harvestDate: new Date('2025-10-20').getTime(), notes: '1.5 acres, inter-cropped with toor dal' },
  { id: 6, cropName: 'Onion (Rabi)', plantDate: new Date('2025-10-01').getTime(), harvestDate: new Date('2026-02-28').getTime(), notes: 'Transplanted seedlings, 1 acre, drip system' },
];

export const MARKET_PRICES: MarketPrice[] = [
  { id: 1, crop: 'Tomato', region: 'Delhi', bidPrice: 2700, askPrice: 2850, date: Date.now() },
  { id: 2, crop: 'Tomato', region: 'Mumbai', bidPrice: 2900, askPrice: 3100, date: Date.now() },
  { id: 3, crop: 'Wheat', region: 'Delhi', bidPrice: 2050, askPrice: 2150, date: Date.now() },
  { id: 4, crop: 'Wheat', region: 'Hyderabad', bidPrice: 2100, askPrice: 2200, date: Date.now() },
  { id: 5, crop: 'Rice', region: 'Chennai', bidPrice: 7000, askPrice: 7200, date: Date.now() },
  { id: 6, crop: 'Rice', region: 'Hyderabad', bidPrice: 6800, askPrice: 7000, date: Date.now() },
  { id: 7, crop: 'Onion', region: 'Mumbai', bidPrice: 1700, askPrice: 1800, date: Date.now() },
  { id: 8, crop: 'Onion', region: 'Delhi', bidPrice: 1650, askPrice: 1750, date: Date.now() },
  { id: 9, crop: 'Potato', region: 'Delhi', bidPrice: 1100, askPrice: 1200, date: Date.now() },
  { id: 10, crop: 'Potato', region: 'Chennai', bidPrice: 1300, askPrice: 1400, date: Date.now() },
  { id: 11, crop: 'Chilli', region: 'Hyderabad', bidPrice: 9000, askPrice: 9500, date: Date.now() },
  { id: 12, crop: 'Cotton', region: 'Mumbai', bidPrice: 6300, askPrice: 6500, date: Date.now() },
];

export const EQUIPMENT_GUIDES: EquipmentGuide[] = [
  { id: 1, equipmentName: 'Tractor (45 HP)', maintenanceLog: [{ date: Date.now() - 2592000000, description: 'Engine oil change, air filter replaced', technician: 'Ram Mechanics' }, { date: Date.now() - 5184000000, description: 'Annual service, brake adjustment, battery check', technician: 'Authorized Dealer' }], compatibility: ['Rotavator 4-6ft', 'Cultivator 7-tine', 'Seed drill 9-row', 'MB Plough'] },
  { id: 2, equipmentName: 'Power Sprayer (Battery)', maintenanceLog: [{ date: Date.now() - 1296000000, description: 'Nozzle replaced, battery capacity check (85% health)', technician: 'Self' }], compatibility: ['Flat fan nozzle', 'Cone nozzle', 'Flood jet nozzle'] },
  { id: 3, equipmentName: 'Combine Harvester', maintenanceLog: [{ date: Date.now() - 7776000000, description: 'Threshing drum bearings replaced, concave clearance adjusted', technician: 'Authorized Service Center' }, { date: Date.now() - 15552000000, description: 'Cutter bar blade replacement, belt tensioner check', technician: 'Authorized Service Center' }], compatibility: ['Wheat header 14ft', 'Rice header 12ft', 'Soybean divider'] },
];

export const FORUM_POSTS: ForumPost[] = [
  { id: 1, author: 'Mohan Yadav', title: 'Best practices for organic certification in India', body: 'I am looking to get NPOP certification for my 5-acre farm. Has anyone done this recently? What are the documentation requirements?', replies: [{ author: 'Priya Devi', body: 'I got certified last year. You need 3 years of organic records, soil test reports, and a conversion period plan. Happy to share my checklist.', timestamp: Date.now() - 3600000 }, { author: 'AgriExpert Ravi', body: 'NPOP requires NABCB accredited inspection agency. Budget ₹15,000-25,000 for first year including inspection and documentation.', timestamp: Date.now() - 1800000 }], upvotes: 24 },
  { id: 2, author: 'Santosh Patel', title: 'Drip irrigation ROI — is it worth the investment?', body: 'Considering drip irrigation for 3 acres of tomato. Investment is around ₹45,000. Want to understand the water and yield benefits before deciding.', replies: [{ author: 'Irrigation Expert', body: 'Typically 40-50% water savings and 20-30% yield increase. ROI in 2-3 seasons for tomato. Subsidy available under PMKSY — check your district office.', timestamp: Date.now() - 7200000 }, { author: 'Ramesh Farmer', body: 'I installed drip 2 years ago for 2 acres chilli. Payback was 18 months. Water bill dropped from ₹8000 to ₹3000 per season.', timestamp: Date.now() - 3600000 }], upvotes: 31 },
  { id: 3, author: 'Kavitha Reddy', title: 'Soil health card — how to read the recommendations?', body: 'Got my soil health card and it shows nitrogen deficiency. How do I calculate how much urea to apply per acre?', replies: [{ author: 'KVK Extension Officer', body: 'If card shows <280 kg/ha nitrogen, apply 50kg urea per acre as basal dose. Top dress 25kg at 30 and 60 days. Always split nitrogen application.', timestamp: Date.now() - 10800000 }], upvotes: 18 },
  { id: 4, author: 'Dilip Singh', title: 'Pink bollworm in cotton — organic management options?', body: 'Seeing about 10% infestation in my Bt cotton. Want to avoid chemical pesticides. Any effective organic/bio options?', replies: [{ author: 'IPM Specialist', body: 'Install pheromone traps (8-10/acre), spray Beauveria bassiana @ 5g/litre, release Chrysoperla eggs in early infestation. These are effective for 10-15% infestation.', timestamp: Date.now() - 5400000 }, { author: 'Organic Farmer Suresh', body: 'Neem oil 3% spray every 7-10 days works well. I also intercrop with coriander to attract natural predators.', timestamp: Date.now() - 1200000 }, { author: 'Dilip Singh', body: 'Thank you both! Will try the pheromone traps first.', timestamp: Date.now() - 600000 }], upvotes: 42 },
  { id: 5, author: 'Anitha Kumar', title: 'Best season to plant sunflower in Karnataka?', body: 'Planning to grow sunflower for the first time. What is the ideal sowing window in North Karnataka?', replies: [{ author: 'KVK Dharwad', body: 'Kharif: June-July (rainfed), Rabi: October-November (irrigated). Rabi crop gives better returns as prices are higher in Feb-March.', timestamp: Date.now() - 14400000 }, { author: 'Sunflower Grower Mahesh', body: 'I grow in Dharwad district, Rabi crop. KBSH-41 variety gives best yield. Avoid heavy clay soils — sunflower needs well-drained loam.', timestamp: Date.now() - 7200000 }], upvotes: 15 },
  { id: 6, author: 'Vijay Naik', title: 'Price forecasting for wheat 2025 — what are farmers expecting?', body: 'Current MSP is ₹2275/quintal. Market is trading around ₹2150. Is it better to hold stocks or sell now?', replies: [{ author: 'Commodity Analyst', body: 'Export demand is weak this season due to global surplus. Domestic price unlikely to rise above MSP before May. Recommend selling 50-60% now and holding rest.', timestamp: Date.now() - 21600000 }, { author: 'Rajesh Trader', body: 'I am seeing some inquiry from flour mills. If you can wait till Feb-March there might be a 5-8% uptick.', timestamp: Date.now() - 10800000 }, { author: 'Vijay Naik', body: 'Thanks. Will sell 60% now and store rest in warehouse.', timestamp: Date.now() - 5400000 }], upvotes: 38 },
];
