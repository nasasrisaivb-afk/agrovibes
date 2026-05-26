import { useCallback, useEffect, useRef, useState } from "react";
import type { AgriReel } from "./ReelCard";
import { ReelCard } from "./ReelCard";

// 10 rich agricultural reels with gradient placeholder colors
const AGRI_REELS: AgriReel[] = [
  {
    id: "1",
    gradient: "from-[#1a4a2e] via-[#2d7a4f] to-[#1a3a25]",
    duration: 15,
    creator: {
      name: "Priya Sharma",
      avatar: "/assets/images/avatar1.jpg",
      role: "Farmer",
      roleColor: "#4ade80",
      location: "Nashik, Maharashtra",
      verified: true,
    },
    caption:
      "How to identify early blight in tomatoes before it spreads across your field 🍅🌿",
    hashtags: [
      "#tomatofarming",
      "#cropprotection",
      "#organicfarming",
      "#agritips",
    ],
    likes: 14200,
    comments: 856,
    shares: 432,
    category: "Crop Tips",
    linkedProduct: {
      name: "Organic Tomatoes (Grade A)",
      price: 28,
      unit: "kg",
    },
  },
  {
    id: "2",
    gradient: "from-[#7c3a00] via-[#c85a00] to-[#5c2c00]",
    duration: 12,
    creator: {
      name: "Rajesh Patil",
      avatar: "/assets/images/avatar2.jpg",
      role: "Buyer",
      roleColor: "#fb923c",
      location: "Nashik, Maharashtra",
      verified: false,
    },
    caption:
      "Onion prices surge 40% this week in Nashik — what farmers should know before selling 💹",
    hashtags: ["#marketupdate", "#onionprice", "#APMCrates", "#farmeradvice"],
    likes: 9800,
    comments: 1240,
    shares: 890,
    category: "Market Update",
  },
  {
    id: "3",
    gradient: "from-[#0c3d5c] via-[#1a6a8a] to-[#0a2a40]",
    duration: 15,
    creator: {
      name: "Dr. Suresh Kumar",
      avatar: "/assets/images/avatar3.jpg",
      role: "Educator",
      roleColor: "#60a5fa",
      location: "Amritsar, Punjab",
      verified: true,
    },
    caption:
      "Zero-tillage paddy transplanting technique that saves 30% water and increases yield by 20% 🌾",
    hashtags: [
      "#zerotillage",
      "#paddyfarming",
      "#sustainableag",
      "#modernfarming",
    ],
    likes: 22500,
    comments: 1876,
    shares: 2100,
    category: "Farming Demo",
    linkedProduct: { name: "SRI Paddy Seeds (Premium)", price: 65, unit: "kg" },
  },
  {
    id: "4",
    gradient: "from-[#2d4a1e] via-[#4a7c2f] to-[#1e3416]",
    duration: 13,
    creator: {
      name: "Meena Devi",
      avatar: "/assets/images/avatar4.jpg",
      role: "Farmer",
      roleColor: "#4ade80",
      location: "Guntur, Andhra Pradesh",
      verified: true,
    },
    caption:
      "Natural neem spray recipe for aphid control — completely chemical-free and costs just ₹12 per litre 🌿",
    hashtags: [
      "#neemspray",
      "#pestmanagement",
      "#organicfarming",
      "#naturalremedy",
    ],
    likes: 31000,
    comments: 2340,
    shares: 4500,
    category: "Pest Management",
    linkedProduct: {
      name: "Cold-pressed Neem Oil (1L)",
      price: 180,
      unit: "bottle",
    },
  },
  {
    id: "5",
    gradient: "from-[#3a1a00] via-[#6b3200] to-[#2a1200]",
    duration: 14,
    creator: {
      name: "Vikram Singh",
      avatar: "/assets/images/avatar5.jpg",
      role: "Machinery Owner",
      roleColor: "#fbbf24",
      location: "Ludhiana, Punjab",
      verified: true,
    },
    caption:
      "New Mahindra 265 DI tractor in action — watch it handle 12 acres of wheat in a single day 🚜",
    hashtags: [
      "#Mahindratractor",
      "#farmequipment",
      "#tractorlife",
      "#modernfarming",
    ],
    likes: 18700,
    comments: 945,
    shares: 1200,
    category: "Equipment",
    linkedProduct: {
      name: "Mahindra 265 DI (Rental)",
      price: 850,
      unit: "hour",
    },
  },
  {
    id: "6",
    gradient: "from-[#1a3a5c] via-[#2a5c8a] to-[#112840]",
    duration: 15,
    creator: {
      name: "Ramesh Jadhav",
      avatar: "/assets/images/avatar6.jpg",
      role: "Farmer",
      roleColor: "#4ade80",
      location: "Pune, Maharashtra",
      verified: true,
    },
    caption:
      "How Ramesh doubled his tomato yield from 8T to 16T per acre using drip irrigation — full story 💧",
    hashtags: [
      "#successstory",
      "#dripirrigation",
      "#yieldimprovement",
      "#farmerwin",
    ],
    likes: 45200,
    comments: 3120,
    shares: 6800,
    category: "Success Story",
  },
  {
    id: "7",
    gradient: "from-[#4a0a0a] via-[#7c1a1a] to-[#300808]",
    duration: 10,
    creator: {
      name: "IMD AgriAlert",
      avatar: "/assets/images/avatar7.jpg",
      role: "Service Provider",
      roleColor: "#f87171",
      location: "Pan India",
      verified: true,
    },
    caption:
      "⚠️ URGENT: Cyclone Michaung alert — protect your standing crops tonight! Harvest what you can 🌀",
    hashtags: [
      "#cyclonealert",
      "#cropprotection",
      "#weatherwarning",
      "#farmeralert",
    ],
    likes: 62000,
    comments: 8900,
    shares: 22000,
    category: "Weather Advisory",
  },
  {
    id: "8",
    gradient: "from-[#1e1a4a] via-[#2e2a7c] to-[#14124a]",
    duration: 15,
    creator: {
      name: "Prof. Anita Rao",
      avatar: "/assets/images/avatar8.jpg",
      role: "Educator",
      roleColor: "#60a5fa",
      location: "Hyderabad, Telangana",
      verified: true,
    },
    caption:
      "MSP explained simply: Minimum Support Price, how it's calculated and why it matters for every farmer 📚",
    hashtags: ["#MSP", "#farmerpolicy", "#agrieducation", "#governmentschemes"],
    likes: 28400,
    comments: 1560,
    shares: 3400,
    category: "Education",
  },
  {
    id: "9",
    gradient: "from-[#1a3a1a] via-[#2d5c2d] to-[#122812]",
    duration: 14,
    creator: {
      name: "Kavita Kumari",
      avatar: "/assets/images/avatar9.jpg",
      role: "Farmer",
      roleColor: "#4ade80",
      location: "Muzaffarpur, Bihar",
      verified: false,
    },
    caption:
      "How to make rich compost in 30 days at home using kitchen waste + dry leaves — zero cost 🌱",
    hashtags: ["#composting", "#organicfarming", "#soilhealth", "#zerowaste"],
    likes: 19800,
    comments: 2100,
    shares: 5600,
    category: "Organic Farming",
    linkedProduct: {
      name: "Compost Starter Culture",
      price: 120,
      unit: "pack",
    },
  },
  {
    id: "10",
    gradient: "from-[#3a2a00] via-[#5c4400] to-[#281e00]",
    duration: 12,
    creator: {
      name: "APMC Live",
      avatar: "/assets/images/avatar10.jpg",
      role: "Service Provider",
      roleColor: "#f87171",
      location: "Vashi, Navi Mumbai",
      verified: true,
    },
    caption:
      "Today's APMC rates LIVE — Tomato ₹18/kg 📉, Onion ₹24/kg 📈, Potato ₹15/kg 🥔",
    hashtags: ["#APMCrates", "#todaysprice", "#vegetablemarket", "#liveprices"],
    likes: 11200,
    comments: 670,
    shares: 890,
    category: "Live Market",
  },
];

export function ReelsFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [feed, setFeed] = useState<"forYou" | "following">("forYou");
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(AGRI_REELS.length - 1, idx));
    setActiveIndex(clamped);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(activeIndex + 1);
      if (e.key === "ArrowUp") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    if (Math.abs(e.touches[0].clientY - touchStartY.current) > 8) {
      isDragging.current = true;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (isDragging.current && Math.abs(dy) > 40) {
      if (dy < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
    touchStartY.current = null;
    isDragging.current = false;
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-black overflow-hidden"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      data-ocid="reels-feed-page"
    >
      {/* Feed tabs overlay — sits above the global top bar area */}
      <div className="absolute top-14 left-0 right-0 z-[110] flex justify-center pt-3 pb-2 pointer-events-none">
        <div
          className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 pointer-events-auto"
          data-ocid="reels-feed-toggle"
        >
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${feed === "forYou" ? "bg-white text-black shadow-sm" : "text-white/80 hover:text-white"}`}
            onClick={() => setFeed("forYou")}
            data-ocid="reels-for-you-tab"
          >
            For You
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${feed === "following" ? "bg-white text-black shadow-sm" : "text-white/80 hover:text-white"}`}
            onClick={() => setFeed("following")}
            data-ocid="reels-following-tab"
          >
            Following
          </button>
        </div>
      </div>

      {/* Reel slide stack — only current reel is visible */}
      <div className="absolute inset-0">
        {AGRI_REELS.map((reel, idx) => (
          <div
            key={reel.id}
            className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translateY(${(idx - activeIndex) * 100}%)`,
            }}
            aria-hidden={idx !== activeIndex}
          >
            <ReelCard
              reel={reel}
              isActive={idx === activeIndex}
              index={idx}
              onNext={() => goTo(activeIndex + 1)}
              onPrev={() => goTo(activeIndex - 1)}
            />
          </div>
        ))}
      </div>

      {/* Reel position dots — top center */}
      <div className="absolute top-16 right-3 z-[105] flex flex-col items-center gap-1 pointer-events-none mt-14">
        {AGRI_REELS.map((r, i) => (
          <div
            key={r.id}
            className={`rounded-full transition-all duration-200 ${i === activeIndex ? "w-1.5 h-4 bg-white" : "w-1 h-1 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
