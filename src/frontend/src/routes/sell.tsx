import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { ContractType, PayoutSchedule } from "@/types";
import { createRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Landmark,
  Plus,
  ShieldCheck,
  Upload,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Route as rootRoute } from "./__root";

const WIZARD_STEPS = ["Media", "Details", "Terms", "Trust Boost"] as const;

const CERT_OPTIONS = [
  "USDA Organic",
  "Organic India",
  "APEDA Certified",
  "ISI Certified",
  "NPOP Certified",
  "Spices Board India",
] as const;

const SAMPLE_CSV_ROWS = [
  {
    name: "Tomato (Roma)",
    category: "Produce",
    price: "₹35",
    qty: "500 kg",
    notes: "",
  },
  {
    name: "Wheat Seeds (HD-2967)",
    category: "Seeds",
    price: "₹5",
    qty: "100 kg",
    notes: "Missing germination rate",
  },
  {
    name: "Power Tiller (2HP)",
    category: "Equipment",
    price: "₹28,000",
    qty: "1 unit",
    notes: "Price seems low — verify",
  },
];

const AUDIT_TRAIL = [
  { action: "KYC approved", by: "System", time: "Mar 12, 2025" },
  { action: "APEDA certificate added", by: "Rajan Kumar", time: "Apr 3, 2025" },
  { action: "Listing verified", by: "Admin", time: "Apr 15, 2025" },
];

const MY_DOCUMENTS = [
  { name: "Phytosanitary_Cert_2025.pdf", date: "Apr 10, 2025", size: "1.2 MB" },
  {
    name: "Equipment_Rental_Agreement_May.pdf",
    date: "May 1, 2025",
    size: "0.8 MB",
  },
];

function SellPage() {
  const [quickOpen, setQuickOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Produce");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [payout, setPayout] = useState<PayoutSchedule>("Weekly");
  const [escrow, setEscrow] = useState(true);
  const [contract, setContract] = useState<ContractType>("None");
  const [certs, setCerts] = useState<string[]>(["Organic India"]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [csvDrag, setCsvDrag] = useState(false);
  const [csvFile, setCsvFile] = useState<string | null>(null);
  const [aiCheckOpen, setAiCheckOpen] = useState(false);

  const [docPreview, setDocPreview] = useState<string | null>(null);

  const resetWizard = useCallback(() => {
    setStep(0);
    setProductName("");
    setCategory("Produce");
    setPrice("");
    setQuantity("");
    setUnit("kg");
    setPayout("Weekly");
    setEscrow(true);
    setContract("None");
    setCerts(["Organic India"]);
    setUploadedImage(null);
    setIsPublishing(false);
  }, []);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setQuickOpen(false);
      toast.success("Listing published! Visible to buyers in your region");
      resetWizard();
    }, 1200);
  };

  const toggleCert = (c: string) => {
    setCerts((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const canNext =
    (step === 0 && uploadedImage !== null) ||
    (step === 1 && productName && price && quantity) ||
    step === 2 ||
    step === 3;

  const progressPct = ((step + 1) / WIZARD_STEPS.length) * 100;

  const onDropCsv = (e: React.DragEvent) => {
    e.preventDefault();
    setCsvDrag(false);
    setCsvFile("bulk_listings_2025.csv");
    toast.success("CSV file ready for upload");
  };

  return (
    <div className="min-h-screen bg-background pb-24" data-ocid="sell.page">
      {/* Page Header */}
      <div className="bg-card border-b px-4 py-5 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              List Your Produce
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Get discovered by thousands of buyers across India
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setQuickOpen(true)}
              data-ocid="sell.quick_list_button"
            >
              <Zap className="size-4 mr-1.5" />
              Quick List (90 sec)
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Bulk upload coming soon")}
              data-ocid="sell.bulk_upload_button"
            >
              <Upload className="size-4 mr-1.5" />
              Bulk Upload CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Quick List Wizard Modal */}
        <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
          <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="font-display text-xl">
                Quick List Wizard
              </DialogTitle>
              <DialogDescription>
                Step {step + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[step]}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-2">
              <Progress value={progressPct} className="h-2" />
            </div>
            <div className="px-6 py-4 min-h-[280px]">
              {step === 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Product Photo</Label>
                  <button
                    type="button"
                    className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/40 transition-colors bg-transparent w-full"
                    onClick={() => {
                      setUploadedImage(
                        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
                      );
                      toast.success("Photo uploaded");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setUploadedImage(
                          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
                        );
                        toast.success("Photo uploaded");
                      }
                    }}
                  >
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Camera className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Take Photo or Upload
                        </p>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    Tap above to simulate upload
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Organic Wheat Seeds"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>Seeds</option>
                        <option>Produce</option>
                        <option>Equipment</option>
                      </select>
                    </div>
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      >
                        <option>kg</option>
                        <option>quintal</option>
                        <option>unit</option>
                        <option>acre</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block">Payout Schedule</Label>
                    <div className="flex gap-3">
                      {(["Daily", "Weekly", "Net30"] as PayoutSchedule[]).map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() => setPayout(s)}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                              payout === s
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border text-foreground hover:bg-muted"
                            }`}
                            type="button"
                          >
                            {s}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Escrow Protection</Label>
                      <p className="text-xs text-muted-foreground">
                        Hold payment until delivery confirmed
                      </p>
                    </div>
                    <Switch checked={escrow} onCheckedChange={setEscrow} />
                  </div>
                  <div>
                    <Label>Contract Type</Label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
                      value={contract}
                      onChange={(e) =>
                        setContract(e.target.value as ContractType)
                      }
                    >
                      <option>None</option>
                      <option>Phytosanitary</option>
                      <option>Rental</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {CERT_OPTIONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleCert(c)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            certs.includes(c)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-foreground hover:bg-muted"
                          }`}
                          type="button"
                        >
                          {certs.includes(c) && (
                            <Check className="inline size-3 mr-1" />
                          )}
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                    <BadgeCheck className="size-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-success">
                        Boost visibility
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Verified listings get 3x more views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="size-4" />
                    Verification status:{" "}
                    <span className="text-success font-medium">Approved</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="px-6 pb-6 gap-2">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ChevronLeft className="size-4 mr-1" /> Back
              </Button>
              {step < WIZARD_STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                >
                  Next <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="bg-primary"
                >
                  {isPublishing ? "Publishing..." : "Publish Listing"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Section */}
        <Card data-ocid="sell.bulk_upload_section">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-primary" />
              Bulk Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                csvDrag ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setCsvDrag(true);
              }}
              onDragLeave={() => setCsvDrag(false)}
              onDrop={onDropCsv}
            >
              <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {csvFile
                  ? csvFile
                  : "Drag & drop your CSV file here, or click to browse"}
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => toast.success("Template downloaded")}
              >
                <Download className="size-3.5 mr-1" /> Download template CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-3">Product</th>
                    <th className="text-left py-2 px-3">Category</th>
                    <th className="text-left py-2 px-3">Price</th>
                    <th className="text-left py-2 px-3">Qty</th>
                    <th className="text-left py-2 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_CSV_ROWS.map((row, _i) => (
                    <tr
                      key={row.name}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <td className="py-2 px-3">{row.name}</td>
                      <td className="py-2 px-3">{row.category}</td>
                      <td className="py-2 px-3">{row.price}</td>
                      <td className="py-2 px-3">{row.qty}</td>
                      <td className="py-2 px-3">
                        {row.notes ? (
                          <span className="text-warning text-xs flex items-center gap-1">
                            <AlertTriangle className="size-3" /> {row.notes}
                          </span>
                        ) : (
                          <span className="text-success text-xs">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAiCheckOpen(true)}
                data-ocid="sell.ai_error_check_button"
              >
                <Zap className="size-4 mr-1.5" /> AI Error Check
              </Button>
              <Button disabled={!csvFile} data-ocid="sell.upload_csv_button">
                <Upload className="size-4 mr-1.5" />
                Upload and Create {csvFile ? "3" : "0"} Listings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Error Check Dialog */}
        <Dialog open={aiCheckOpen} onOpenChange={setAiCheckOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="size-5 text-warning" /> AI Error Check Results
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning">
                  Row 2: Missing germination rate
                </p>
                <p className="text-xs text-muted-foreground">
                  Seeds category requires germination rate field.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning">
                  Row 3: Price seems too low
                </p>
                <p className="text-xs text-muted-foreground">
                  Verify ₹5/kg for Wheat — market rate is ₹18-25/kg.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setAiCheckOpen(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Verification Hub */}
        <Card data-ocid="sell.verification_hub_section">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <ShieldCheck className="size-5 text-success" />
              Seller Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="size-5 text-success" />
                  <span className="font-medium text-sm">KYC</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-success text-primary-foreground"
                >
                  Verified
                </Badge>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="size-5 text-success" />
                  <span className="font-medium text-sm">APEDA Cert</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires Dec 15, 2025
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="size-5 text-success" />
                  <span className="font-medium text-sm">Organic India</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Renewal due Jul 2025
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Certification upload coming soon")}
            >
              <Plus className="size-4 mr-1" /> Add Certification
            </Button>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Audit Trail</h4>
              <div className="space-y-2">
                {AUDIT_TRAIL.map((a, _i) => (
                  <div
                    key={a.action}
                    className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-muted/40"
                  >
                    <span>{a.action}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.by} · {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Settings */}
        <Card data-ocid="sell.payout_settings_section">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Landmark className="size-5 text-primary" />
              Payout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2 block">Current Schedule</Label>
              <div className="flex gap-3">
                {(["Daily", "Weekly", "Net30"] as PayoutSchedule[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setPayout(s);
                      toast.success(`Payout set to ${s}`);
                    }}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      payout === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <Landmark className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">SBI ****4521</p>
                  <p className="text-xs text-muted-foreground">
                    Savings Account
                  </p>
                </div>
              </div>
              <Button variant="link" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                <Clock className="size-3 mr-1" /> Next payout: Jun 7, 2025
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Tax invoice downloaded")}
              >
                <Download className="size-3.5 mr-1" /> Tax Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Builder */}
        <Card data-ocid="sell.contract_builder_section">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="size-5 text-secondary" />
              Document Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <h4 className="font-medium text-sm">
                  Phytosanitary Certificate
                </h4>
                <p className="text-xs text-muted-foreground">
                  Auto-generated for produce exports. Includes pest-free
                  declaration and origin traceability.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDocPreview("phytosanitary")}
                >
                  <FileText className="size-3.5 mr-1" /> Generate Document
                </Button>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <h4 className="font-medium text-sm">
                  Equipment Rental Agreement
                </h4>
                <p className="text-xs text-muted-foreground">
                  Standard rental contract with damage clauses, return terms,
                  and insurance requirements.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDocPreview("rental")}
                >
                  <FileText className="size-3.5 mr-1" /> Generate Document
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">My Documents</h4>
              <div className="space-y-2">
                {MY_DOCUMENTS.map((doc, _i) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.date} · {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toast.success("Preview opened")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toast.success("Download started")}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview Dialog */}
        <Dialog open={!!docPreview} onOpenChange={() => setDocPreview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">
                {docPreview} Document Preview
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-2 text-sm">
              <p>
                <strong>Document ID:</strong> DOC-
                {Math.floor(Math.random() * 10000)}
              </p>
              <p>
                <strong>Generated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-success">Ready for download</span>
              </p>
              <Separator />
              <p className="text-muted-foreground text-xs">
                {docPreview === "phytosanitary"
                  ? "This certificate confirms the produce is free from quarantine pests and meets export phytosanitary standards."
                  : "This agreement covers rental terms, damage liability, and return conditions for agricultural equipment."}
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  toast.success("Document downloaded");
                  setDocPreview(null);
                }}
              >
                <Download className="size-4 mr-1" /> Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sell",
  component: SellPage,
});
