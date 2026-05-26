import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DISPUTE_CASES, KYC_RECORDS } from "@/mocks/backend";
import type {
  AuditEvent,
  DisputeCase,
  DisputeEvent,
  DisputeStatus,
  KycRecord,
  KycVerificationStatus,
} from "@/types";
import { createRoute } from "@tanstack/react-router";
import {
  AlertOctagon,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  FileText,
  Gavel,
  Globe,
  ListChecks,
  MessageSquare,
  Plus,
  Send,
  Shield,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Route as rootRoute } from "./__root";

const TABS = [
  { id: "verification" as const, label: "Verification", icon: Shield },
  { id: "disputes" as const, label: "Disputes", icon: AlertTriangle },
  { id: "safety" as const, label: "Safety Tips", icon: BookOpen },
  { id: "compliance" as const, label: "Compliance", icon: Globe },
];

type TabId = (typeof TABS)[number]["id"];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function statusColor(status: KycVerificationStatus | DisputeStatus) {
  switch (status) {
    case "Verified":
      return "bg-success text-primary-foreground";
    case "Pending":
      return "bg-warning text-primary-foreground";
    case "Rejected":
      return "bg-destructive text-primary-foreground";
    case "Open":
      return "bg-[oklch(var(--accent))] text-primary-foreground";
    case "UnderReview":
      return "bg-[oklch(var(--trust))] text-primary-foreground";
    case "Resolved":
      return "bg-success text-primary-foreground";
    case "Escalated":
      return "bg-destructive text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function statusLabel(status: KycVerificationStatus | DisputeStatus) {
  switch (status) {
    case "UnderReview":
      return "Under Review";
    default:
      return status;
  }
}

const BADGE_NAMES: Record<number, string> = {
  1: "KYC Identity",
  2: "Organic Certification",
  3: "Export License",
};

const CERTIFICATIONS = [
  { name: "USDA Organic", org: "USDA" },
  { name: "APEDA Certified", org: "APEDA" },
  { name: "Organic India", org: "OFDC" },
  { name: "NPOP Certified", org: "NPOP" },
  { name: "Spices Board India", org: "Spices Board" },
  { name: "FSSAI License", org: "FSSAI" },
];

function VerificationHub() {
  const [kycStep, setKycStep] = useState(1);
  const [showKyc, setShowKyc] = useState(false);
  const hasPending = KYC_RECORDS.some((r) => r.status === "Pending");

  return (
    <div className="space-y-6" data-ocid="trust.verification.section">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Trust & Verification Center
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your verification badges and compliance status
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">My Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KYC_RECORDS.map((record: KycRecord) => (
            <Card
              key={record.id}
              className={`relative overflow-hidden ${record.status === "Pending" ? "animate-pulse" : ""}`}
              data-ocid={`trust.badge.item.${record.id}`}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div
                  className={`relative rounded-full p-4 ${record.status === "Verified" ? "bg-success/10 text-success ring-2 ring-[oklch(var(--success))]" : record.status === "Pending" ? "bg-warning/10 text-warning ring-2 ring-[oklch(var(--warning))]" : "bg-destructive/10 text-destructive"}`}
                >
                  {record.id === 1 ? (
                    <Shield className="h-6 w-6" />
                  ) : record.id === 2 ? (
                    <BadgeCheck className="h-6 w-6" />
                  ) : (
                    <Globe className="h-6 w-6" />
                  )}
                  {record.status === "Verified" && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-success bg-background rounded-full" />
                  )}
                  {record.status === "Rejected" && (
                    <XCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-destructive bg-background rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {BADGE_NAMES[record.id] || `Badge ${record.id}`}
                  </p>
                  <Badge className={`mt-1 ${statusColor(record.status)}`}>
                    {statusLabel(record.status)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires: Dec 2026
                  </p>
                </div>
                {record.status === "Rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Resubmission initiated")}
                    data-ocid="trust.resubmit_button"
                  >
                    Resubmit
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {hasPending && (
        <Dialog open={showKyc} onOpenChange={setShowKyc}>
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto"
              data-ocid="trust.complete_kyc_button"
            >
              <Camera className="h-4 w-4 mr-2" />
              Complete KYC
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>KYC Verification — Step {kycStep} of 3</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {kycStep === 1 && (
                <div className="space-y-3">
                  <Label>Selfie Verification</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-3">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Take a clear selfie for identity verification
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => toast.success("Selfie captured")}
                      data-ocid="trust.kyc.selfie_button"
                    >
                      Take Selfie
                    </Button>
                  </div>
                </div>
              )}
              {kycStep === 2 && (
                <div className="space-y-3">
                  <Label>ID Document Upload</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Front Side
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Front uploaded")}
                      >
                        Upload
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Back Side</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Back uploaded")}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {kycStep === 3 && (
                <div className="space-y-3 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-success" />
                  <p className="font-semibold">Review & Submit</p>
                  <p className="text-sm text-muted-foreground">
                    Selfie and ID documents ready for verification. Submit to
                    complete KYC.
                  </p>
                  <Button
                    onClick={() => {
                      toast.success("KYC submitted for review");
                      setShowKyc(false);
                      setKycStep(1);
                    }}
                    data-ocid="trust.kyc.submit_button"
                  >
                    Submit for Review
                  </Button>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={kycStep === 1}
                  onClick={() => setKycStep((s) => s - 1)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  disabled={kycStep === 3}
                  onClick={() => setKycStep((s) => s + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div>
        <h3 className="font-semibold text-foreground mb-3">Audit Trail</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="audit">
            <AccordionTrigger data-ocid="trust.audit.accordion">
              View KYC Audit History
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-2">
                {KYC_RECORDS[0].auditEvents.map(
                  (event: AuditEvent, idx: number) => (
                    <div
                      key={event.timestamp + event.action}
                      className="flex items-start gap-3 relative"
                    >
                      {idx !== KYC_RECORDS[0].auditEvents.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-[-12px] w-px bg-border" />
                      )}
                      <div className="relative z-10 rounded-full p-1.5 bg-primary/10 text-primary mt-0.5">
                        <FileCheck className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {event.action}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[0.7rem]">
                            {event.performedBy}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Add Certification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERTIFICATIONS.map((cert, idx) => (
            <Card
              key={cert.name}
              className="hover:bg-muted/30 transition-colors"
              data-ocid={`trust.cert.item.${idx + 1}`}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.org}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(`${cert.name} added`)}
                  data-ocid={`trust.cert.add_button.${idx + 1}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function DisputeCenter() {
  const [mediatorOpen, setMediatorOpen] = useState(false);
  const [newDisputeOpen, setNewDisputeOpen] = useState(false);

  return (
    <div className="space-y-6" data-ocid="trust.disputes.section">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Open Disputes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your dispute cases
          </p>
        </div>
        <Dialog open={newDisputeOpen} onOpenChange={setNewDisputeOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="trust.file_dispute_button">
              <Plus className="h-4 w-4 mr-2" />
              File New Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>File New Dispute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <Input placeholder="e.g. 2048" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the issue..." />
              </div>
              <div className="space-y-2">
                <Label>Evidence</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag files or click to upload
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  toast.success("Dispute filed successfully");
                  setNewDisputeOpen(false);
                }}
                data-ocid="trust.dispute.submit_button"
              >
                Submit Dispute
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {DISPUTE_CASES.map((dispute: DisputeCase) => (
          <Card key={dispute.id} data-ocid={`trust.dispute.item.${dispute.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base">
                    Dispute #{dispute.id}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Order #{dispute.orderId}
                  </p>
                </div>
                <Badge className={statusColor(dispute.status)}>
                  {statusLabel(dispute.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Evidence Files
                </p>
                <div className="flex flex-wrap gap-2">
                  {dispute.evidence.map((file, _idx) => (
                    <Badge key={file} variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {file}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Timeline
                </p>
                <div className="space-y-3">
                  {dispute.timeline.map((event: DisputeEvent, idx: number) => (
                    <div
                      key={event.timestamp + event.event}
                      className="flex items-start gap-3 relative"
                    >
                      {idx !== dispute.timeline.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-[-12px] w-px bg-border" />
                      )}
                      <div className="relative z-10 rounded-full p-1.5 bg-primary/10 text-primary mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{event.event}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[0.7rem]">
                            {event.performedBy}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {dispute.resolution && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-success">Resolution</p>
                  <p className="text-sm text-foreground mt-1">
                    {dispute.resolution}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Evidence upload opened")}
                  data-ocid={`trust.dispute.upload_button.${dispute.id}`}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Evidence
                </Button>
                <Dialog open={mediatorOpen} onOpenChange={setMediatorOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`trust.dispute.mediator_button.${dispute.id}`}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact Mediator
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Mediator Chat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          Mediator assigned to your case. They will review
                          evidence and respond within 24 hours.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          onClick={() => toast.success("Message sent")}
                          data-ocid="trust.mediator.send_button"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Disagree with a resolution?
            </p>
            <p className="text-xs text-muted-foreground">
              You can file an appeal within 7 days of resolution
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Appeal form opened")}
            data-ocid="trust.appeal_button"
          >
            File Appeal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SafetyTips() {
  const tips = [
    {
      title: "Spotting Fake Certificates",
      border: "border-l-[oklch(var(--destructive))]",
      icon: <AlertOctagon className="h-5 w-5 text-destructive" />,
      bg: "bg-destructive/5",
      points: [
        "Verify QR codes on certificates with issuing authority",
        "Check certificate serial numbers in official databases",
        "Look for holograms and watermarks on physical copies",
      ],
    },
    {
      title: "Liability Checklist for Sellers",
      border: "border-l-[oklch(var(--warning))]",
      icon: <ListChecks className="h-5 w-5 text-warning" />,
      bg: "bg-warning/5",
      points: [
        "Product liability insurance active",
        "Clear return and refund policy posted",
        "Accurate product descriptions and images",
        "Compliance with local food safety laws",
      ],
      checked: true,
    },
    {
      title: "Escrow Protection Guide",
      border: "border-l-[oklch(var(--trust))]",
      icon: <Shield className="h-5 w-5 text-trust" />,
      bg: "bg-trust/5",
      points: [
        "Funds held securely until delivery confirmed",
        "Dispute window: 48 hours post-delivery",
        "Auto-release after 7 days if no dispute raised",
      ],
    },
    {
      title: "Dispute Resolution Process",
      border: "border-l-[oklch(var(--success))]",
      icon: <Gavel className="h-5 w-5 text-success" />,
      bg: "bg-success/5",
      points: [
        "Step 1: File dispute with evidence",
        "Step 2: Mediator reviews within 24h",
        "Step 3: Both parties submit statements",
        "Step 4: Mediator proposes resolution",
        "Step 5: Appeal within 7 days if needed",
      ],
    },
  ];

  return (
    <div className="space-y-6" data-ocid="trust.safety.section">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Safety & Compliance Guides
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Protect yourself and your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <Card
            key={tip.title}
            className={`${tip.border} border-l-4`}
            data-ocid={`trust.tip.item.${idx + 1}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${tip.bg}`}>{tip.icon}</div>
                <CardTitle className="text-base">{tip.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tip.points.map((point, _pidx) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    {tip.checked ? (
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast.success("Safety handbook download started")}
          data-ocid="trust.download_handbook_button"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Full Safety Handbook
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast.info("Community guidelines opened")}
          data-ocid="trust.view_guidelines_button"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Community Guidelines
        </Button>
      </div>
    </div>
  );
}

function ComplianceReports() {
  const [region, setRegion] = useState("usda");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  const requirements: Record<
    string,
    { name: string; status: "compliant" | "action" }[]
  > = {
    usda: [
      { name: "Plant Health Certificate", status: "compliant" },
      { name: "Fumigation Certificate", status: "action" },
      { name: "FSSAI Compliance", status: "compliant" },
      { name: "Phytosanitary Inspection", status: "compliant" },
    ],
    eu: [
      { name: "Euro Phytosanitary Certificate", status: "compliant" },
      { name: "EU Organic Regulation (EC) 834/2007", status: "action" },
      { name: "Maximum Residue Limits (MRL)", status: "compliant" },
      { name: "Traceability Documentation", status: "compliant" },
    ],
    india: [
      { name: "FSSAI License", status: "compliant" },
      { name: "APEDA Registration", status: "compliant" },
      { name: "State Mandi License", status: "action" },
    ],
    uae: [
      { name: "UAE Import Permit", status: "action" },
      { name: "Halal Certification", status: "compliant" },
      { name: "Certificate of Origin", status: "compliant" },
    ],
  };

  const openPreview = (title: string) => {
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6" data-ocid="trust.compliance.section">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Export Compliance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track your compliance status across regions
        </p>
      </div>

      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger
          className="w-full sm:w-72"
          data-ocid="trust.region_select"
        >
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="india">India Domestic</SelectItem>
          <SelectItem value="usda">USDA / USA</SelectItem>
          <SelectItem value="eu">EU Standards</SelectItem>
          <SelectItem value="uae">UAE Import</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle className="text-base capitalize">
            {region === "usda"
              ? "USDA / USA"
              : region === "eu"
                ? "EU Standards"
                : region === "uae"
                  ? "UAE Import"
                  : "India Domestic"}{" "}
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requirements[region]?.map((req, _idx) => (
            <div
              key={req.name}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-foreground">{req.name}</span>
              <Badge
                className={
                  req.status === "compliant"
                    ? "bg-success text-primary-foreground"
                    : "bg-warning text-primary-foreground"
                }
              >
                {req.status === "compliant" ? "Compliant" : "Action Required"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => openPreview("USDA Compliance Report")}
          data-ocid="trust.download_usda_button"
        >
          <Download className="h-4 w-4 mr-2" />
          Download USDA Report
        </Button>
        <Button
          variant="outline"
          onClick={() => openPreview("EU Compliance Summary")}
          data-ocid="trust.download_eu_button"
        >
          <Download className="h-4 w-4 mr-2" />
          Download EU Compliance Summary
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <title>Compliance Score</title>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="oklch(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="oklch(var(--success))"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * 0.78} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">78</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <Badge className="mt-3 bg-success/10 text-success border-success/20">
            Good Standing
          </Badge>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-4 bg-border rounded w-full" />
            <div className="h-4 bg-border rounded w-5/6" />
            <div className="h-4 bg-border rounded w-2/3" />
            <div className="h-4 bg-border rounded w-full" />
            <p className="text-xs text-muted-foreground text-center pt-2">
              Report preview — download for full details
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              toast.success(`${previewTitle} downloaded`);
              setPreviewOpen(false);
            }}
            data-ocid="trust.preview.download_button"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrustContent() {
  const [activeTab, setActiveTab] = useState<TabId>("verification");

  return (
    <div className="min-h-screen bg-background pb-24" data-ocid="trust.page">
      {/* Mobile Tab Bar */}
      <div className="md:hidden bg-card border-b sticky top-0 z-30">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-smooth
                ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              data-ocid={`trust.mobile_tab.${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Web Layout: Sidebar + Content */}
      <div className="hidden md:flex min-h-screen">
        <aside className="w-64 bg-card border-r border-border p-4 space-y-1 sticky top-0 h-screen">
          <div className="px-3 py-4">
            <h1 className="font-display font-bold text-xl text-foreground">
              Trust & Safety
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verification, disputes, compliance
            </p>
          </div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth w-full text-left
                  ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                data-ocid={`trust.sidebar_tab.${tab.id}`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-6 max-w-4xl">
          {activeTab === "verification" && <VerificationHub />}
          {activeTab === "disputes" && <DisputeCenter />}
          {activeTab === "safety" && <SafetyTips />}
          {activeTab === "compliance" && <ComplianceReports />}
        </main>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden p-4">
        {activeTab === "verification" && <VerificationHub />}
        {activeTab === "disputes" && <DisputeCenter />}
        {activeTab === "safety" && <SafetyTips />}
        {activeTab === "compliance" && <ComplianceReports />}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trust",
  component: TrustContent,
});
