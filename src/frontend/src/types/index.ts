// Re-export backend types for convenience
export type {
  Farmer,
  Listing,
  Reel,
  Question,
  Answer,
  Group,
  GroupMessage,
  Order,
  Alert,
  ExpertProfile,
  MachineryListing,
  LogisticsListing,
  CreateListingInput,
  CreateReelInput,
  CreateQuestionInput,
  AddGroupMessageInput,
  SubmitOrderInput,
  Course,
  Educator,
  LiveStream,
  DirectMessage,
  Conversation,
  Notification,
  Enrollment,
  Lesson,
  Certification,
  CreateCourseInput,
  CreateEnrollmentInput,
} from "../backend";

export {
  KycStatus,
  OrderStatus,
  ProduceCategory,
  AlertType,
  NotifType,
  NotifPriority,
  StreamStatus,
} from "../backend";

// AlertSeverity is not exported by generated backend.ts — define locally
export const AlertSeverity = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical",
} as const;
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];

// UI-specific types
export interface CartItem {
  listingId: bigint;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  farmerName: string;
}

export interface AccessibilityState {
  fontSizeClass: "text-sm" | "text-base" | "text-lg" | "text-xl";
  isHighContrast: boolean;
  setFontSize: (size: AccessibilityState["fontSizeClass"]) => void;
  setHighContrast: (val: boolean) => void;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (listingId: bigint) => void;
  updateQuantity: (listingId: bigint, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
}

export interface TrustContextState {
  isOpen: boolean;
  triggerTrust: () => void;
  closeTrust: () => void;
}

// Role context UI types (re-exported from context for convenience)
export type {
  UserRole,
  LanguageOption,
  WalletState,
  RoleState,
  LocationState,
} from "../context/RoleContext";

export type SeasonalAlertType = "Price" | "Weather" | "Pest";
export type AlertSeverityLevel = "High" | "Medium" | "Low";

export interface SeasonalAlert {
  id: number;
  alertType: SeasonalAlertType;
  cropName: string;
  title: string;
  description: string;
  region: string;
  severity: AlertSeverityLevel;
  timestamp: number;
}

export interface MarketPriceTick {
  id: number;
  cropName: string;
  price: number;
  changePercent: number;
  date: number;
}

export type ContractType = "Phytosanitary" | "Rental" | "None";
export type VerificationStatus = "Pending" | "Approved" | "Expired";
export type PayoutSchedule = "Daily" | "Weekly" | "Net30";

export interface SellerListing {
  id: number;
  farmerId: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  escrowEnabled: boolean;
  createdAt: number;
  bulkUploadBatch: string;
  contractType: ContractType;
  verificationStatus: VerificationStatus;
  payoutSchedule: PayoutSchedule;
  certifications: string[];
}

export type SalesPeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface SalesAnalytics {
  id: number;
  cropName: string;
  totalRevenue: number;
  unitsSold: number;
  period: SalesPeriod;
}

export interface InventoryItem {
  id: number;
  listingId: number;
  currentStock: number;
  threshold: number;
  forecastDays: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  permissions: string[];
  lastActive: number;
}

export type KycVerificationStatus = "Pending" | "Verified" | "Rejected";

export interface AuditEvent {
  action: string;
  performedBy: string;
  timestamp: number;
}

export interface KycRecord {
  id: number;
  userId: number;
  status: KycVerificationStatus;
  selfieVerified: boolean;
  idVerified: boolean;
  auditEvents: AuditEvent[];
}

export type DisputeStatus = "Open" | "UnderReview" | "Resolved" | "Escalated";

export interface DisputeEvent {
  event: string;
  timestamp: number;
  performedBy: string;
}

export interface DisputeCase {
  id: number;
  orderId: number;
  status: DisputeStatus;
  evidence: string[];
  timeline: DisputeEvent[];
  resolution: string | null;
}

export interface PlantingEntry {
  id: number;
  cropName: string;
  plantDate: number;
  harvestDate: number;
  notes: string;
}

export interface MarketPrice {
  id: number;
  crop: string;
  region: string;
  bidPrice: number;
  askPrice: number;
  date: number;
}

export interface MaintenanceEntry {
  date: number;
  description: string;
  technician: string;
}

export interface EquipmentGuide {
  id: number;
  equipmentName: string;
  maintenanceLog: MaintenanceEntry[];
  compatibility: string[];
}

export interface ForumReply {
  author: string;
  body: string;
  timestamp: number;
}

export interface ForumPost {
  id: number;
  author: string;
  title: string;
  body: string;
  replies: ForumReply[];
  upvotes: number;
}
