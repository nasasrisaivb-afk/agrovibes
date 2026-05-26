# Design Brief: AgriMarket — Dual-Responsive Marketplace

## Aesthetic
Premium modern agricultural tech platform. Dark-first (blue base 0.08L), mobile-optimized (Blinkit/Swiggy/DoorDash), desktop-rich (Amazon/Flipkart). Glassmorphic overlays for video/live contexts. Card-based mobile, grid/sidebar web. Emerald primary (trust, action), golden accent (engagement), mint CTA (secondary actions), red live (streaming). Trust-forward: KYC badges, certified marks, verification throughout. Responsive: 100% fluid mobile (bottom nav, sticky headers), desktop sidebar + top bar with role toggle.

## Palette (OKLCH)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary (Emerald) | 0.56 0.14 150 | 0.65 0.1 160 | Trust, CTAs, role-adaptive foundation |
| Secondary (Purple) | 0.45 0.12 280 | 0.55 0.1 280 | Alternative actions, secondary UI |
| Accent (Golden) | 0.72 0.18 65 | 0.72 0.16 65 | Engagement, highlights, interactive states |
| Mint CTA | 0.65 0.14 200 | 0.72 0.1 200 | Secondary CTAs, wellness indicators |
| Success (Green) | 0.68 0.15 155 | 0.72 0.13 155 | Confirmations, positive states |
| Warning (Orange) | 0.75 0.12 70 | 0.65 0.1 70 | Alerts, seasonal pulse |
| Live (Red) | 0.62 0.16 20 | 0.72 0.16 20 | Live streaming indicator, pulse |
| Trust (Blue) | 0.55 0.08 255 | 0.62 0.07 255 | KYC badges, verification |
| Foreground | 0.18 0.02 220 | 0.95 0.01 220 | Text |
| Background | 0.98 0.01 0 | 0.08 0.01 220 | Page |
| Card | 0.99 0.01 0 | 0.14 0.01 220 | Surfaces |
| Sidebar | 0.98 0.01 0 | 0.14 0.01 220 | Filter panels (web) |
| Border | 0.88 0.02 0 | 0.2 0.01 220 | Dividers |
| Muted | 0.92 0.02 0 | 0.25 0.02 220 | Backgrounds, inactive |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Space Grotesk (400–700) | Section titles, role badges, modal headers |
| Body | DM Sans (400–700) | Lists, descriptions, UI copy, form labels |
| Mono | Geist Mono | Prices, counts, technical data, timestamps |

## Structural Zones
| Zone | Mobile | Web | Notes |
|------|--------|-----|-------|
| Top Navigation | Sticky header, role/location/notifications overlay | Top bar with role selector, top search, wallet, notifications | Transparent during video/reel |
| Left Sidebar | N/A | Collapsible filters (Crop, Price, Freshness, Location, Rating) | `.sidebar-collapsible`, borders inherited from sidebar tokens |
| Main Content | Full-width cards (`.swipe-card`), Stories bar, Reel feed, Product feed (`.product-feed-mobile`) | Rich grid (`.product-grid-web`), data tables (`.data-table-row`), charts, dashboard widgets | Responsive breakpoint at md: (768px) |
| Bottom Navigation | Sticky (`.bottom-nav-sticky`): Home, Discover, Sell, Learn, Profile | Hidden, functions in top/sidebar | Icons + labels on mobile |
| FAB | Emerald (`.fab-emerald`) context-aware (Post Reel, List, Ask) | Hidden or as button in header | Right-bottom corner on mobile |
| Floating Actions | Side action bar during reels (heart, comment, share, save) | N/A | Glassmorphic overlay, white text |
| Filter Sheet | Bottom slide-up (`.filter-sheet`), voice/parametric | Persistent left sidebar | Parametric: crop type, price range, freshness, distance, KYC status |
| Video/Live Overlay | Transparent nav overlay (glassmorphic) | Embedded player with chat sidebar | Reels, live streams, product videos |

## Mobile Layout Utilities
| Utility | Purpose |
|---------|----------|
| `.bottom-nav-sticky` | Fixed bottom navigation bar, md: hidden |
| `.fab-emerald` | Context-aware FAB button, emerald primary color |
| `.swipe-card` | Full-width card with swipe animation, active scale-95 |
| `.filter-sheet` | Bottom slide-up sheet on mobile, sidebar on desktop |
| `.product-feed-mobile` | Flex column card feed, hidden on md: breakpoint |
| `.voice-pulse` | Animated gradient pulse for voice input indicator |

## Web Layout Utilities
| Utility | Purpose |
|---------|----------|
| `.sidebar-collapsible` | Left sidebar filters, md: visible, transition-all |
| `.data-table-row` | Table row with hover state, border-bottom |
| `.grid-list-toggle` | Toggle buttons (grid/list view), bg-muted |
| `.product-grid-web` | Responsive grid 2–4 cols depending on breakpoint |

## Interaction Choreography
| Action | Mobile | Web | Timing |
|--------|--------|-----|--------|
| Swipe up/down | Next/previous reel or product card | Scroll (native) | — |
| Tap card | Open product sheet or detail page | Navigate to PDP | — |
| Like/heart | Scale pulse, accent glow | Cursor highlight + hover state | 0.3s ease-out |
| Voice search/input | Mic icon with `voice-pulse` animation | Inline search box | 0.6s pulse loop |
| Filter sheet open | Slide up from bottom (transform: translateY) | Persist in sidebar (no animation) | 0.3s ease-in-out |
| Reel pause | Fade in role-specific info strip (glassmorphic) | N/A | 0.3s fade-in |
| Live room enter | Full-screen overlay with video + chat | Right sidebar with video player | Smooth transition |
| Order status update | Toast notification, green success accent | Inline table row update + notification badge | 0.4s fade-in |

## Motion & Transitions
- **Smooth default**: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (`.transition-smooth`)
- **Reel load**: `animate-reel-fade-in` (0.4s ease-out)
- **Progress bar**: `animate-reel-progress` (linear, matches video duration)
- **Filter sheet**: Transform slide-up 0.3s ease-in-out
- **Sidebar collapse**: Width transition 0.3s ease-in-out
- **Voice pulse**: `animate-pulse` gradient loop (0.6s)
- **Card tap**: Scale 0.95 on active, restore on release (0.15s)

## Badges & Trust Indicators
| Badge | Style | Context |
|-------|-------|----------|
| KYC ✓ | `.trust-indicator-badge` (trust color, light bg) | Seller/farmer profile, product listings |
| Certified | `.badge-certified` (success color, pill shape) | Expert educator, course completion |
| Live 🔴 | `.badge-live` (destructive/red pulse) | Active live stream, broadcast indicator |
| Course | `.badge-course` (course-badge token) | Active learning, course modules |

## Dark Mode Tuning
Always dark by default. Deep blue base (0.08L) for backgrounds, elevated card (0.14L), sidebar match. White text (0.95L) primary, 0.65L secondary. Borders subtle (0.2L). Glassmorphic overlays use rgba(0,0,0,0.3)–rgba(0,0,0,0.6) for depth. No light mode. High contrast: emerald on dark blue 0.59 lightness diff (AA+), golden accent 0.64 diff (AAA).

## Responsive Breakpoints
- **Mobile**: 0–767px (bottom nav, full-width cards, swipe)
- **Tablet**: 768px+ (sidebar visible, grid 2–3 cols)
- **Desktop**: 1024px+ (grid 4 cols, rich dashboards, data tables)
- **Large desktop**: 1280px+ (grid 4–5 cols, full sidebar width)

## Constraints
- **Touch targets**: Min 44px (3rem) on mobile
- **Card width**: 100% on mobile (with 16px padding per side), responsive grid on web
- **Video**: Full viewport (h-dvh) on mobile, embedded player (50–70% width) on web with chat sidebar
- **Sidebar**: Hidden on mobile, persistent on web, collapsible via menu toggle on desktop
- **Text contrast**: AA+ required everywhere (verified in token diff values)
- **No horizontal scroll**: Content respects viewport width
- **Accessibility**: Keyboard nav for web (Tab through filters, Enter to select), touch-friendly mobile

## Signature Details
- **Glassmorphic video overlays**: Premium feel, blur-md + rgba black borders
- **Emerald primary**: Agricultural trust, distinct from generic blue
- **Golden accent**: Engagement metrics (like counts), warmth in dark theme
- **Role-adaptive coloring**: Each role (farmer, buyer, educator, machinery, service) gets own accent for dashboard cards
- **Stories bar**: Infinite horizontal scroll above reel feed, live indicators
- **Live pulse**: Red (0.72L 0.16C 20H) breathing animation for active streams
- **Parametric filters**: Advanced web UI with checkboxes, sliders, date range
- **One-swipe actions**: Quick Buy, Subscriptions quick-access on mobile
- **Trust forward**: KYC/certified badges visible on every listing, seller card, expert profile
