import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeCheck, Lock, Shield, Star } from "lucide-react";
import { useTrustContext } from "../../context/TrustContext";

const TRUST_POINTS = [
  {
    icon: <BadgeCheck className="h-5 w-5 text-trust" />,
    title: "KYC Verified Farmers",
    desc: "All verified sellers have submitted identity documents and passed our background check.",
  },
  {
    icon: <Lock className="h-5 w-5 text-primary" />,
    title: "Escrow Protection",
    desc: "Your payment is held in escrow until you confirm delivery. Funds only release when you're satisfied.",
  },
  {
    icon: <Shield className="h-5 w-5 text-accent" />,
    title: "Dispute Resolution",
    desc: "Raise a dispute within 48 hours of delivery. Our team reviews and mediates within 3 business days.",
  },
  {
    icon: <Star className="h-5 w-5 text-warning" />,
    title: "Verified Reviews",
    desc: "Only buyers who completed a transaction can leave reviews, ensuring authentic ratings.",
  },
];

export function TrustExplainerModal() {
  const { isOpen, closeTrust } = useTrustContext();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeTrust()}>
      <DialogContent className="max-w-sm mx-auto" data-ocid="trust-modal">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            How We Keep You Safe
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="flex gap-3 items-start">
              <div className="mt-0.5 flex-shrink-0">{point.icon}</div>
              <div>
                <p className="font-semibold text-sm">{point.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground text-center">
          Transactions on AgriMarket are secured by the Internet Computer
          blockchain
        </div>

        <Button
          className="w-full mt-2 bg-primary text-primary-foreground"
          onClick={closeTrust}
          data-ocid="trust-close"
        >
          Got It
        </Button>
      </DialogContent>
    </Dialog>
  );
}
