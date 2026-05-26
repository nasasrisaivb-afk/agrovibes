import { Button } from "@/components/ui/button";
import {
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Headphones,
  Mic,
  Search,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TUTORIALS = [
  {
    id: 1,
    type: "video" as const,
    title: "Soil Preparation for Rabi Crops",
    views: 12400,
    duration: "14m",
    category: "Soil",
  },
  {
    id: 2,
    type: "document" as const,
    title: "Complete Guide to Drip Irrigation Setup",
    views: 8900,
    duration: "25 min read",
    category: "Irrigation",
  },
  {
    id: 3,
    type: "video" as const,
    title: "Identifying & Treating Common Wheat Diseases",
    views: 21000,
    duration: "18m",
    category: "Plant Health",
  },
  {
    id: 4,
    type: "audio" as const,
    title: "Market Pricing Strategies Explained (Hindi)",
    views: 5600,
    duration: "32m",
    category: "Business",
  },
  {
    id: 5,
    type: "video" as const,
    title: "Using a Soil Testing Kit — Step by Step",
    views: 9100,
    duration: "8m",
    category: "Soil",
  },
  {
    id: 6,
    type: "document" as const,
    title: "FPO Formation: Legal Requirements & Process",
    views: 3400,
    duration: "15 min read",
    category: "Finance",
  },
];

const BEST_PRACTICES = [
  {
    id: 1,
    title: "Crop Rotation Benefits & Planning",
    preview:
      "Rotating crops across growing seasons can increase soil health by 40% and reduce pest pressure significantly.",
  },
  {
    id: 2,
    title: "Water Conservation Techniques",
    preview:
      "Smart mulching combined with timed irrigation can reduce water use by up to 35% without affecting yield.",
  },
  {
    id: 3,
    title: "Integrated Pest Management (IPM)",
    preview:
      "IPM combines biological, cultural and chemical methods to minimize pesticide use while maintaining productivity.",
  },
  {
    id: 4,
    title: "Post-Harvest Loss Prevention",
    preview:
      "Proper storage, cooling chain and packaging can reduce post-harvest losses from 30% to under 5%.",
  },
  {
    id: 5,
    title: "Organic Input Preparation at Farm",
    preview:
      "Jeevamrit, Panchagavya, and vermicompost can be prepared at less than ₹500/acre reducing input costs.",
  },
];

const GOV_SCHEMES = [
  {
    id: 1,
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    benefit: "₹6,000/year direct income support",
    color:
      "from-[oklch(var(--primary)/0.2)] to-[oklch(var(--role-farmer)/0.15)]",
  },
  {
    id: 2,
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    benefit: "Crop insurance at ≤2% premium",
    color: "from-[oklch(var(--accent)/0.2)] to-[oklch(var(--role-buyer)/0.1)]",
  },
  {
    id: 3,
    name: "FPO Scheme",
    fullName: "Formation & Promotion of 10,000 FPOs",
    benefit: "Up to ₹18 lakh equity grant per FPO",
    color:
      "from-[oklch(var(--role-educator)/0.2)] to-[oklch(var(--primary)/0.1)]",
  },
  {
    id: 4,
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    benefit: "Free soil testing + fertiliser advisory",
    color: "from-[oklch(var(--role-machinery)/0.2)] to-[oklch(var(--muted))]",
  },
];

const CASE_STUDIES = [
  {
    id: 1,
    farmerName: "Ravi Shankar",
    district: "Nashik, Maharashtra",
    crop: "Grapes",
    metric: "60% yield increase",
    detail:
      "Adopted drip irrigation + organic inputs. Reduced water usage by 45% while doubling export-quality produce.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi",
  },
  {
    id: 2,
    farmerName: "Meenakshi Devi",
    district: "Madurai, Tamil Nadu",
    crop: "Jasmine",
    metric: "₹3.2L additional income",
    detail:
      "Connected with premium fragrance buyers through AgriMarket. Eliminated 3 middlemen, direct pricing.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=meenakshi",
  },
  {
    id: 3,
    farmerName: "Gurpreet Singh",
    district: "Amritsar, Punjab",
    crop: "Wheat & Paddy",
    metric: "40% input cost savings",
    detail:
      "Formed a 12-member FPO, bulk-purchased inputs, rented machinery through platform — major cost reduction.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=gurpreet",
  },
];

const TYPE_ICONS = {
  video: Video,
  document: FileText,
  audio: Headphones,
} as const;

const TYPE_COLORS = {
  video: "text-[oklch(var(--live-indicator))]",
  document: "text-[oklch(var(--trust))]",
  audio: "text-[oklch(var(--accent))]",
} as const;

export function KnowledgeRepository() {
  const [search, setSearch] = useState("");
  const [openPractice, setOpenPractice] = useState<number | null>(null);

  function handleLearnMore(name: string) {
    toast.info(`Opening details for ${name}`, {
      description:
        "Government scheme details would load from the official portal.",
      duration: 3000,
    });
  }

  const filteredTutorials = search
    ? TUTORIALS.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      )
    : TUTORIALS;

  return (
    <div
      className="flex flex-col gap-6 px-4 pt-2 pb-6"
      data-ocid="learn.repository.section"
    >
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tutorials, articles, schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-10 rounded-xl border border-input bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="learn.repository.search_input"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label="Voice search"
          data-ocid="learn.repository.voice_button"
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>

      {/* Tutorial Library */}
      <section>
        <h2 className="font-semibold text-base text-foreground mb-3">
          Tutorial Library
        </h2>
        <div className="flex flex-col gap-2">
          {filteredTutorials.map((tut, i) => {
            const Icon = TYPE_ICONS[tut.type];
            return (
              <div
                key={tut.id}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                data-ocid={`learn.tutorial.item.${i + 1}`}
              >
                <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                  <Icon className={`h-4 w-4 ${TYPE_COLORS[tut.type]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                    {tut.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <span>{tut.views.toLocaleString()} views</span>
                    <span>·</span>
                    <span>{tut.duration}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="font-semibold text-base text-foreground mb-3">
          Best Practices
        </h2>
        <div className="flex flex-col gap-2">
          {BEST_PRACTICES.map((bp, i) => (
            <div
              key={bp.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
              data-ocid={`learn.best_practice.item.${i + 1}`}
            >
              <button
                type="button"
                className="w-full px-3 py-3 flex items-center gap-2 text-left"
                onClick={() =>
                  setOpenPractice(openPractice === bp.id ? null : bp.id)
                }
                data-ocid={`learn.best_practice.toggle.${i + 1}`}
              >
                <span className="flex-1 text-xs font-semibold text-foreground">
                  {bp.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${openPractice === bp.id ? "rotate-180" : ""}`}
                />
              </button>
              {openPractice === bp.id && (
                <div className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">
                  {bp.preview}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Government Schemes */}
      <section>
        <h2 className="font-semibold text-base text-foreground mb-3">
          Government Schemes
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {GOV_SCHEMES.map((scheme, i) => (
            <div
              key={scheme.id}
              className={`rounded-xl p-3 bg-gradient-to-br ${scheme.color} border border-border`}
              data-ocid={`learn.gov_scheme.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <span className="text-sm font-bold text-foreground">
                  {scheme.name}
                </span>
                <Award className="h-4 w-4 text-[oklch(var(--accent))] flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight mb-2">
                {scheme.fullName}
              </p>
              <p className="text-[11px] font-semibold text-foreground mb-3">
                {scheme.benefit}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full h-7 text-[10px] gap-1"
                onClick={() => handleLearnMore(scheme.name)}
                data-ocid={`learn.gov_scheme.learn_more.${i + 1}`}
              >
                Learn More <ExternalLink className="h-2.5 w-2.5" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section>
        <h2 className="font-semibold text-base text-foreground mb-3">
          Success Case Studies
        </h2>
        <div className="flex flex-col gap-3">
          {CASE_STUDIES.map((cs, i) => (
            <div
              key={cs.id}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`learn.case_study.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={cs.avatarUrl}
                  alt={cs.farmerName}
                  className="h-12 w-12 rounded-full bg-muted object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {cs.farmerName}
                    </p>
                    <span className="text-xs font-bold text-[oklch(var(--role-farmer))] flex-shrink-0">
                      {cs.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {cs.district} · {cs.crop}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {cs.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
