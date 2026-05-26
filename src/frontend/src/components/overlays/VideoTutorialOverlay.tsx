import { Button } from "@/components/ui/button";
import { Leaf, Mic, ShoppingBasket, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    icon: <ShoppingBasket className="h-12 w-12 text-primary" />,
    title: "Buy Fresh, Direct",
    desc: "Browse produce from verified farmers in your area. All listings are KYC-checked for quality and trust.",
  },
  {
    icon: <Mic className="h-12 w-12 text-accent" />,
    title: "Voice-First Experience",
    desc: "Tap the mic icon anywhere to search, ask questions, or create listings using your voice.",
  },
  {
    icon: <Users className="h-12 w-12 text-trust" />,
    title: "Farmer Community",
    desc: "Connect with farmers, ask agricultural questions, and share knowledge in group chats.",
  },
  {
    icon: <Leaf className="h-12 w-12 text-success" />,
    title: "Safe Transactions",
    desc: "Every purchase is escrow-protected. Your money is held safely until you confirm delivery.",
  },
];

export function VideoTutorialOverlay() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("agri-tutorial-seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("agri-tutorial-seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
      data-ocid="tutorial-overlay"
    >
      {/* Skip */}
      <Button
        variant="ghost"
        size="sm"
        onClick={dismiss}
        className="absolute top-4 right-4 text-muted-foreground"
        data-ocid="tutorial-skip"
      >
        <X className="h-4 w-4 mr-1" />
        Skip
      </Button>

      {/* Slide */}
      <div className="flex flex-col items-center text-center gap-4 max-w-xs">
        <div className="w-24 h-24 rounded-3xl bg-muted/60 flex items-center justify-center shadow-inner">
          {current.icon}
        </div>
        <h2 className="font-display font-bold text-2xl">{current.title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {current.desc}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {SLIDES.map((s, i) => (
          <button
            type="button"
            key={s.title}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all ${
              i === slide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 w-full max-w-xs">
        {slide > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setSlide((s) => s - 1)}
            data-ocid="tutorial-back"
          >
            Back
          </Button>
        )}
        {isLast ? (
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={dismiss}
            data-ocid="tutorial-got-it"
          >
            Get Started
          </Button>
        ) : (
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={() => setSlide((s) => s + 1)}
            data-ocid="tutorial-next"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
