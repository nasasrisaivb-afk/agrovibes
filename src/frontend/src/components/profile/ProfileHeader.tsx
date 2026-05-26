import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Edit3,
  MapPin,
  Share2,
  ShieldAlert,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  LANGUAGES,
  ROLE_CONFIG,
  useRoleContext,
} from "../../context/RoleContext";
import { KycStatus } from "../../types";

interface ProfileHeaderProps {
  kycStatus: KycStatus;
}

const KYC_STEPS = ["Unverified", "Pending", "Verified"] as const;

export function ProfileHeader({ kycStatus }: ProfileHeaderProps) {
  const { role, language, setLanguage } = useRoleContext();
  const roleConf = ROLE_CONFIG[role];
  const isVerified = kycStatus === KycStatus.Verified;
  const isPending = kycStatus === KycStatus.Pending;

  const kycStep = isVerified ? 2 : isPending ? 1 : 0;

  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleShare = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/profile/rajesh-kumar`)
      .then(() => toast.success("Profile link copied!"))
      .catch(() => toast.info("Share feature coming soon"));
  };

  return (
    <div className="bg-card border-b border-border px-4 pt-6 pb-5 flex flex-col items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-md">
          <img
            src="/assets/images/farmer-1.jpg"
            alt="Rajesh Kumar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
        </div>
        {isVerified && (
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full border-2 border-card flex items-center justify-center shadow">
            <BadgeCheck className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Name & Location */}
      <div className="text-center">
        <h1 className="font-display font-bold text-xl">Rajesh Kumar</h1>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3" />
          Punjab, India · Member since 2022
        </p>
      </div>

      {/* Role badge + KYC + Trust */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Badge
          className={`text-xs gap-1 border ${roleConf.bgClass} ${roleConf.textClass} ${roleConf.borderClass}`}
        >
          {role === "farmer" && "🌾"}
          {role === "buyer" && "🛒"}
          {role === "educator" && "📚"}
          {role === "machinery" && "🚜"}
          {role === "service" && "🛠️"}
          {roleConf.label}
        </Badge>

        {isVerified && (
          <Badge className="bg-success/10 text-success border border-success/30 text-xs gap-1">
            <BadgeCheck className="h-3 w-3" />
            KYC Verified
          </Badge>
        )}
        {isPending && (
          <Badge className="bg-warning/10 text-warning border border-warning/30 text-xs gap-1">
            <ShieldAlert className="h-3 w-3" />
            KYC Pending
          </Badge>
        )}
        {!isVerified && !isPending && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/5"
            data-ocid="verify-kyc-btn"
            onClick={() => toast.info("KYC verification coming soon")}
          >
            <ShieldAlert className="h-3 w-3 mr-1" />
            Verify KYC
          </Button>
        )}

        <Badge variant="outline" className="text-xs gap-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          4.8 · Top Seller
        </Badge>
      </div>

      {/* KYC Progress Steps */}
      <div className="w-full flex items-center justify-center gap-1 mt-0.5">
        {KYC_STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-smooth ${
                  i <= kycStep
                    ? "bg-success text-white border-success"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {i < kycStep ? "✓" : i + 1}
              </div>
              <span className="text-[9px] text-muted-foreground leading-none">
                {label}
              </span>
            </div>
            {i < KYC_STEPS.length - 1 && (
              <div
                className={`h-px w-8 mb-3 transition-smooth ${
                  i < kycStep ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Language flags row */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          type="button"
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowLangPicker((v) => !v)}
          data-ocid="lang-shortcut-btn"
        >
          <span>🌐</span>
          <span>Language: {language.native}</span>
          <span className="text-[8px]">{showLangPicker ? "▲" : "▼"}</span>
        </button>
        {showLangPicker && (
          <div
            className="flex flex-wrap gap-1.5 justify-center mt-1 p-2 bg-muted/40 rounded-2xl border border-border"
            data-ocid="lang-picker"
          >
            {LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangPicker(false);
                  toast.success(`Language set to ${lang.label}`);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-smooth border ${
                  language.code === lang.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                data-ocid="lang-option-btn"
              >
                {lang.native}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex gap-6 w-full justify-center py-2 bg-muted/40 rounded-2xl">
        <div className="text-center">
          <p className="font-bold text-lg font-display leading-tight">15</p>
          <p className="text-[10px] text-muted-foreground">Listings</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="font-bold text-lg font-display leading-tight">142</p>
          <p className="text-[10px] text-muted-foreground">Orders</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="font-bold text-lg font-display leading-tight">₹2,450</p>
          <p className="text-[10px] text-muted-foreground">Wallet</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 w-full max-w-xs">
        <Button
          type="button"
          className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-1.5"
          data-ocid="edit-profile-btn"
          onClick={() => toast.info("Edit Profile coming soon")}
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3 transition-smooth"
          aria-label="Share profile"
          data-ocid="share-profile-btn"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
