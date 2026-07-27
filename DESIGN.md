# Design Brief: CropVibe — Dark/Gold Agri Marketplace

## Aesthetic
Dark, moody, premium agri-tech. Deep green-charcoal base with warm gold as the
single action color — gold means "act" (CTAs, prices, active nav), green
means "good" (verified, paid, live), red/orange reserved for destructive and
in-review states. Mobile-first (built and verified at 375px), card-based,
generous touch targets. Trust-forward: KYC badges on every listing and seller
surface. WCAG 2.1 AA contrast throughout; visible gold focus rings on every
interactive element.

## Palette (OKLCH components, consumed as `oklch(var(--token))`)
| Token | Value | Usage |
|-------|-------|-------|
| Background | 0.13 0.012 150 | Page (deep green-charcoal) |
| Card | 0.17 0.014 150 | Surfaces |
| Border | 0.25 0.015 150 | Dividers |
| Foreground | 0.95 0.008 100 | Primary text |
| Muted foreground | 0.7 0.015 110 | Secondary text |
| Primary (Gold) | 0.8 0.14 85 | CTAs, prices, active states, focus ring |
| Accent (Amber surface) | 0.3 0.04 85 | Hover fills, subtle emphasis |
| Success | 0.72 0.13 155 | Verified, paid, live listings |
| Warning | 0.78 0.13 70 | In-review, pending states |
| Destructive | 0.62 0.19 25 | Rejections, cancellations, disputes |
| Trust (Blue) | 0.7 0.09 240 | KYC badges, informational notices |

Dark-only: `color-scheme: dark`, no light mode.

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Space Grotesk (400–700) | Headings, stats, brand |
| Body | DM Sans (400–700) | UI copy, forms, lists |
| Mono | Geist Mono | Prices, counts, OTP, IFSC, confidence scores |

## Structure
- **Consumer app**: sticky top bar (brand, notifications, profile) + fixed
  bottom tab bar on mobile (Home, Orders, Sell, Alerts, Profile — 44px+
  targets); the same items move into the top bar on md+. Content max-width
  5xl, single column on mobile, 2–4 col listing grid scaling up.
- **Admin console** (`/admin`): separate shell with employee login, tab nav
  (KYC review, Listing moderation, Reports), denser desktop-friendly rows.

## Signature details
- `gold-gradient-text` brand treatment; `card-hover` lift with gold border.
- Status pills: one shared component family per enum (order, payment,
  listing, KYC, bank, payout, priority) — tone is derived, never ad hoc.
- Every list has an explicit empty state with an action; every fetch has a
  skeleton; every error shows specific copy with a recovery action.
- Bottom sheets for checkout; dialogs for KYC gates, bank addition,
  moderation notes.

## Constraints
- Touch targets ≥ 44px (`.tap-target`), no horizontal scroll, safe-area
  padding for the bottom nav.
- Icon-only buttons always carry `aria-label`; chip groups are fieldsets;
  focus-visible outline is 2px gold everywhere.
