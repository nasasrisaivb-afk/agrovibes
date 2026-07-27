import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

/**
 * First-viewport composition for signed-out visitors.
 * Brand-first, one headline, one supporting line, one CTA group, one
 * full-bleed visual plane — no cards, badges, or secondary marketing.
 */
export function LandingHero() {
  return (
    <section
      aria-label="CropVibe"
      className="relative -mx-4 -mt-4 flex min-h-[calc(100dvh-3.5rem)] flex-col justify-end overflow-hidden md:min-h-[calc(100dvh-3.5rem)]"
    >
      {/* Full-bleed visual plane */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80"
          alt=""
          className="h-full w-full object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.8_0.14_85_/_0.18),_transparent_55%)]" />
      </div>

      <div className="relative z-10 flex flex-col gap-5 px-5 pb-10 pt-24 sm:px-8 md:max-w-xl md:pb-16">
        <div className="animate-hero-rise flex items-center gap-2.5">
          <Sprout className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="gold-gradient-text font-display text-3xl font-bold tracking-tight sm:text-4xl">
            CropVibe
          </span>
        </div>

        <h1 className="animate-hero-rise-delay font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          Farm-fresh produce, direct from verified sellers
        </h1>

        <p className="animate-hero-rise-delay-2 max-w-md text-sm leading-relaxed text-foreground/80 sm:text-base">
          Buy harvest and farm inputs across India — or list yours and get paid
          to your bank. UPI-first. KYC-backed trust.
        </p>

        <div className="animate-hero-rise-delay-3 flex flex-wrap gap-3 pt-1">
          <Button asChild size="lg" className="tap-target px-6 text-base">
            <Link to="/auth" search={{}}>
              Get started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="tap-target border-foreground/25 bg-background/40 px-6 text-base backdrop-blur"
          >
            <a href="#marketplace">Browse marketplace</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
