import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EQUIPMENT_GUIDES,
  FORUM_POSTS,
  MARKET_PRICES,
  PLANTING_ENTRIES,
} from "@/mocks/backend";
import type { EquipmentGuide, ForumPost, PlantingEntry } from "@/types";
import { createRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  Download,
  FileText,
  GraduationCap,
  MessageCircle,
  MessageSquare,
  Mic,
  Play,
  Plus,
  Search,
  Sprout,
  Star,
  ThumbsUp,
  Tractor,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as rootRoute } from "./__root";

const TABS = [
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "prices", label: "Prices", icon: TrendingUp },
  { key: "equipment", label: "Equipment", icon: Wrench },
  { key: "community", label: "Community", icon: MessageCircle },
  { key: "learning", label: "Learning", icon: GraduationCap },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getPhase(entry: PlantingEntry) {
  const now = Date.now();
  if (now < entry.plantDate)
    return { label: "Upcoming", color: "bg-muted text-muted-foreground" };
  if (now < entry.harvestDate)
    return { label: "Growing", color: "bg-primary/20 text-primary" };
  return { label: "Harvesting", color: "bg-accent/20 text-accent" };
}

function CalendarSection() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [entries, setEntries] = useState<PlantingEntry[]>(PLANTING_ENTRIES);
  const [newCrop, setNewCrop] = useState({
    cropName: "",
    plantDate: "",
    harvestDate: "",
    notes: "",
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthEntries = entries.filter((e) => {
    const p = new Date(e.plantDate);
    const h = new Date(e.harvestDate);
    return p.getMonth() === month || h.getMonth() === month;
  });

  const dayEntries = (day: number) =>
    monthEntries.filter((e) => {
      const p = new Date(e.plantDate);
      const h = new Date(e.harvestDate);
      return p.getDate() === day || h.getDate() === day;
    });

  const handleAddCrop = () => {
    if (!newCrop.cropName || !newCrop.plantDate || !newCrop.harvestDate) {
      toast.error("Please fill all required fields");
      return;
    }
    const entry: PlantingEntry = {
      id: entries.length + 1,
      cropName: newCrop.cropName,
      plantDate: new Date(newCrop.plantDate).getTime(),
      harvestDate: new Date(newCrop.harvestDate).getTime(),
      notes: newCrop.notes,
    };
    setEntries([...entries, entry]);
    setNewCrop({ cropName: "", plantDate: "", harvestDate: "", notes: "" });
    toast.success("Crop entry added successfully");
  };

  return (
    <div className="space-y-6" data-ocid="resources.calendar.section">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Planting Calendar 2025-26
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" data-ocid="resources.calendar.add_crop_button">
              <Plus className="w-4 h-4 mr-1" /> Add Crop Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Crop Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label htmlFor="crop-name">Crop Name</Label>
                <Input
                  id="crop-name"
                  value={newCrop.cropName}
                  onChange={(e) =>
                    setNewCrop({ ...newCrop, cropName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="plant-date">Plant Date</Label>
                <Input
                  id="plant-date"
                  type="date"
                  value={newCrop.plantDate}
                  onChange={(e) =>
                    setNewCrop({ ...newCrop, plantDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="harvest-date">Harvest Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={newCrop.harvestDate}
                  onChange={(e) =>
                    setNewCrop({ ...newCrop, harvestDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="crop-notes">Notes</Label>
                <Textarea
                  id="crop-notes"
                  value={newCrop.notes}
                  onChange={(e) =>
                    setNewCrop({ ...newCrop, notes: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleAddCrop}
                className="w-full"
                data-ocid="resources.calendar.submit_button"
              >
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, idx) => `empty-${idx}`).map(
              (k) => (
                <div key={k} />
              ),
            )}
            {days.map((day) => {
              const de = dayEntries(day);
              const isToday = day === today.getDate();
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    setSelectedDay(selectedDay === day ? null : day)
                  }
                  className={`relative rounded-lg p-2 text-sm transition-colors hover:bg-muted ${isToday ? "bg-primary/10 font-bold text-primary" : "text-foreground"}`}
                  data-ocid={`resources.calendar.day.${day}`}
                >
                  {day}
                  {de.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {de.map((e, _i) => {
                        const isPlant = new Date(e.plantDate).getDate() === day;
                        return (
                          <span
                            key={e.cropName + e.plantDate}
                            className={`w-1.5 h-1.5 rounded-full ${isPlant ? "bg-primary" : "bg-accent"}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedDay && dayEntries(selectedDay).length > 0 && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
              {dayEntries(selectedDay).map((e) => (
                <div key={e.id} className="text-sm">
                  <span className="font-semibold">{e.cropName}</span>
                  <span className="text-muted-foreground ml-2">{e.notes}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {[...entries]
            .sort((a, b) => a.plantDate - b.plantDate)
            .map((e) => {
              const phase = getPhase(e);
              return (
                <Card key={e.id} data-ocid={`resources.calendar.event.${e.id}`}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {e.cropName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.plantDate)} — {formatDate(e.harvestDate)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {e.notes}
                      </p>
                    </div>
                    <Badge className={phase.color}>{phase.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sprout className="w-4 h-4 text-primary" /> Crop Rotation Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">After Wheat</span>
            <span className="font-medium text-foreground">
              Rice, Mustard, Pulse
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">After Cotton</span>
            <span className="font-medium text-foreground">Wheat, Soybean</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">After Tomato</span>
            <span className="font-medium text-foreground">Pulse, Maize</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PricesSection() {
  const [region, setRegion] = useState("All");
  const regions = ["All", "Delhi", "Mumbai", "Chennai", "Hyderabad"];
  const filtered =
    region === "All"
      ? MARKET_PRICES
      : MARKET_PRICES.filter((p) => p.region === region);
  const top5 = [...filtered]
    .sort((a, b) => b.bidPrice - a.bidPrice)
    .slice(0, 5);
  const maxPrice = Math.max(...top5.map((p) => p.askPrice));

  return (
    <div className="space-y-6" data-ocid="resources.prices.section">
      <h2 className="font-display text-xl font-bold text-foreground">
        Live Market Prices
      </h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {regions.map((r) => (
          <Button
            key={r}
            variant={region === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRegion(r)}
            data-ocid={`resources.prices.region.${r.toLowerCase()}`}
          >
            {r}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Crop</th>
                <th className="p-3 font-medium">Bid (₹/qt)</th>
                <th className="p-3 font-medium">Ask (₹/qt)</th>
                <th className="p-3 font-medium">Spread</th>
                <th className="p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const spread = p.askPrice - p.bidPrice;
                const spreadColor =
                  spread > 100
                    ? "text-success"
                    : spread > 50
                      ? "text-warning"
                      : "text-foreground";
                return (
                  <tr
                    key={p.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`resources.prices.row.${p.id}`}
                  >
                    <td className="p-3 font-medium text-foreground">
                      {p.crop}
                    </td>
                    <td className="p-3 text-foreground">
                      {p.bidPrice.toLocaleString()}
                    </td>
                    <td className="p-3 text-foreground">
                      {p.askPrice.toLocaleString()}
                    </td>
                    <td className={`p-3 font-semibold ${spreadColor}`}>
                      {spread}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(p.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top 5 Crops — Bid vs Ask</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {top5.map((p) => (
              <div
                key={p.id}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full flex gap-0.5 justify-center items-end h-32">
                  <div
                    className="w-3 bg-primary rounded-t"
                    style={{ height: `${(p.bidPrice / maxPrice) * 100}%` }}
                  />
                  <div
                    className="w-3 bg-accent rounded-t"
                    style={{ height: `${(p.askPrice / maxPrice) * 100}%` }}
                  />
                </div>
                <span className="text-[0.65rem] text-muted-foreground text-center leading-tight">
                  {p.crop}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> Bid
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" /> Ask
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">
              Market Insight
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Historical data shows Tomato peaks Jan-Feb. Current forecast:
              ₹3,200/qt by March 2025.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EquipmentSection() {
  const [guides, setGuides] = useState<EquipmentGuide[]>(EQUIPMENT_GUIDES);
  const [search, setSearch] = useState("");
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [newMaint, setNewMaint] = useState({ description: "", technician: "" });

  const parts = [
    { name: "Rotavator 6ft", detail: "Fits 45HP+ tractors" },
    { name: "Seed drill 9-row", detail: "Requires PTO shaft type 1" },
    { name: "MB Plough", detail: "Fits 35HP+ tractors" },
  ];
  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.detail.toLowerCase().includes(search.toLowerCase()),
  );

  const addMaintenance = (guideId: number) => {
    if (!newMaint.description) {
      toast.error("Enter a description");
      return;
    }
    setGuides(
      guides.map((g) =>
        g.id === guideId
          ? {
              ...g,
              maintenanceLog: [
                ...g.maintenanceLog,
                {
                  date: Date.now(),
                  description: newMaint.description,
                  technician: newMaint.technician || "Self",
                },
              ],
            }
          : g,
      ),
    );
    setNewMaint({ description: "", technician: "" });
    setActiveGuide(null);
    toast.success("Maintenance entry added");
  };

  return (
    <div className="space-y-6" data-ocid="resources.equipment.section">
      <h2 className="font-display text-xl font-bold text-foreground">
        Equipment Knowledge Base
      </h2>
      <div className="space-y-4">
        {guides.map((g) => (
          <Card key={g.id} data-ocid={`resources.equipment.card.${g.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {g.equipmentName}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {g.compatibility.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Tractor className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Maintenance Log
                </p>
                <div className="relative pl-4 border-l-2 border-border space-y-3">
                  {g.maintenanceLog.map((m, _i) => (
                    <div key={m.date + m.description} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                      <p className="text-sm text-foreground">{m.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(m.date)} · {m.technician}
                      </p>
                    </div>
                  ))}
                </div>
                {activeGuide === g.id ? (
                  <div className="space-y-2 pt-2">
                    <Input
                      placeholder="Description"
                      value={newMaint.description}
                      onChange={(e) =>
                        setNewMaint({
                          ...newMaint,
                          description: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Technician"
                      value={newMaint.technician}
                      onChange={(e) =>
                        setNewMaint({ ...newMaint, technician: e.target.value })
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addMaintenance(g.id)}
                        data-ocid={`resources.equipment.add_maint_save.${g.id}`}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveGuide(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveGuide(g.id)}
                    data-ocid={`resources.equipment.add_maint_button.${g.id}`}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Maintenance Entry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Parts Compatibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search parts..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="resources.equipment.parts_search"
            />
          </div>
          <div className="space-y-2">
            {filteredParts.map((p, _i) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
              >
                <span className="text-sm font-medium text-foreground">
                  {p.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.detail}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Rental Terms Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["Weekly Rental Agreement", "Seasonal Rental Agreement"].map(
            (name, i) => (
              <Card
                key={name}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toast.success(`${name} downloaded`)}
                data-ocid={`resources.equipment.rental_template.${i}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF · 2 pages
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function CommunitySection() {
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase()),
  );

  const handleReply = (postId: number) => {
    if (!replyText.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                { author: "You", body: replyText, timestamp: Date.now() },
              ],
            }
          : p,
      ),
    );
    setReplyText("");
    setReplyingTo(null);
    toast.success("Reply posted");
  };

  const amas = [
    { name: "Dr. Ravi Kumar", topic: "Soil Science", date: "June 15" },
    { name: "Priya Mehta", topic: "Organic Farming", date: "June 22" },
  ];

  return (
    <div className="space-y-6" data-ocid="resources.community.section">
      <h2 className="font-display text-xl font-bold text-foreground">
        Farmer Community
      </h2>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="resources.community.search"
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => toast.info("Ask a Question — coming soon")}
          data-ocid="resources.community.ask_button"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((post) => (
          <Card key={post.id} data-ocid={`resources.community.post.${post.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {post.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{post.author}</p>
                  <h3 className="font-semibold text-foreground text-sm mt-0.5">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {post.body}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => toast.success("Upvoted")}
                      data-ocid={`resources.community.upvote.${post.id}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes}
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      onClick={() =>
                        setExpanded(expanded === post.id ? null : post.id)
                      }
                      data-ocid={`resources.community.replies_toggle.${post.id}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />{" "}
                      {post.replies.length}
                    </button>
                  </div>
                </div>
              </div>
              {expanded === post.id && (
                <div className="mt-3 pl-12 space-y-3">
                  {post.replies.map((r, _i) => (
                    <div
                      key={r.author + r.timestamp}
                      className="bg-muted/40 rounded-lg p-3"
                    >
                      <p className="text-xs font-medium text-foreground">
                        {r.author}
                      </p>
                      <p className="text-sm text-foreground mt-0.5">{r.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(r.timestamp)}
                      </p>
                    </div>
                  ))}
                  {replyingTo === post.id ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReply(post.id)}
                        data-ocid={`resources.community.reply_submit.${post.id}`}
                      >
                        Reply
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setReplyingTo(post.id)}
                      data-ocid={`resources.community.reply_button.${post.id}`}
                    >
                      Reply
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className="cursor-pointer"
        onClick={() => {
          setVoiceActive(!voiceActive);
          if (!voiceActive) toast.info("Voice recording started (demo)");
        }}
        data-ocid="resources.community.voice_qa"
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${voiceActive ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              Ask with your voice
            </p>
            <p className="text-xs text-muted-foreground">
              Tap to record a question
            </p>
          </div>
          {voiceActive && (
            <div className="ml-auto flex gap-0.5 items-end h-5">
              {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
                <div
                  key={h}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${h * 4}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Expert AMAs</h3>
        <div className="space-y-2">
          {amas.map((ama, i) => (
            <Card key={ama.name} data-ocid={`resources.community.ama.${i}`}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {ama.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ama.topic} · {ama.date}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Reminder set for ${ama.name}`)}
                  data-ocid={`resources.community.ama_reminder.${i}`}
                >
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearningSection() {
  const courses = [
    {
      title: "Organic Farming Basics",
      instructor: "Prof. Aruna Menon",
      duration: "6h 30m",
      rating: 4.9,
      students: 19200,
      color: "from-primary/30 to-primary/10",
    },
    {
      title: "Advanced IPM",
      instructor: "Dr. Priya Sekharan",
      duration: "8h 15m",
      rating: 4.8,
      students: 8600,
      color: "from-secondary/30 to-secondary/10",
    },
    {
      title: "Agri Finance for Small Farmers",
      instructor: "CA Suresh Jha",
      duration: "5h 45m",
      rating: 4.7,
      students: 7800,
      color: "from-accent/30 to-accent/10",
    },
    {
      title: "Equipment Maintenance",
      instructor: "Vikram Bhat",
      duration: "4h 20m",
      rating: 4.7,
      students: 5100,
      color: "from-muted to-muted/50",
    },
  ];

  const paths = [
    { name: "Beginner Farmer", progress: 0 },
    { name: "Expert Seller", progress: 0 },
    { name: "Agri Entrepreneur", progress: 0 },
  ];

  return (
    <div className="space-y-6" data-ocid="resources.learning.section">
      <h2 className="font-display text-xl font-bold text-foreground">
        AgriLearn
      </h2>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Featured Courses</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {courses.map((c, i) => (
            <Card
              key={c.title}
              className="min-w-[260px] flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
              data-ocid={`resources.learning.course.${i}`}
            >
              <div
                className={`h-28 rounded-t-lg bg-gradient-to-br ${c.color}`}
              />
              <CardContent className="p-3">
                <h4 className="font-semibold text-foreground text-sm">
                  {c.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.instructor}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />{" "}
                    {c.rating}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => toast.success(`Enrolled in ${c.title}`)}
                  data-ocid={`resources.learning.enroll.${i}`}
                >
                  Enroll
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Learning Paths</h3>
        <div className="space-y-3">
          {paths.map((p, i) => (
            <Card key={p.name} data-ocid={`resources.learning.path.${i}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.progress}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm">
                How to Read Your Soil Health Card
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                12 min · 4 chapters
              </p>
              <div className="flex gap-2 mt-2">
                {[
                  "Introduction",
                  "NPK Values",
                  "Micronutrients",
                  "Recommendations",
                ].map((ch, _i) => (
                  <Badge key={ch} variant="outline" className="text-[0.65rem]">
                    {ch}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourcesContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("calendar");

  const sections: Record<TabKey, React.ReactNode> = {
    calendar: <CalendarSection />,
    prices: <PricesSection />,
    equipment: <EquipmentSection />,
    community: <CommunitySection />,
    learning: <LearningSection />,
  };

  return (
    <div
      className="min-h-screen bg-background pb-24 md:pb-0 md:flex"
      data-ocid="resources.page"
    >
      {/* Web Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border sticky top-0">
        <div className="p-4 border-b border-border">
          <h1 className="font-display font-bold text-lg text-foreground">
            Resources
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calendar, prices, guides & community
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-ocid={`resources.sidebar.tab.${t.key}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-card border-b px-4 py-4">
          <h1 className="font-display font-bold text-xl text-foreground">
            Resources
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calendar, prices, guides & community
          </p>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex overflow-x-auto scrollbar-hide gap-1 p-2 bg-card border-b">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                data-ocid={`resources.mobile.tab.${t.key}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 max-w-5xl mx-auto">{sections[activeTab]}</div>
      </main>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: ResourcesContent,
});
