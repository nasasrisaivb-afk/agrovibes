# CropVibe — Agri-tech Marketplace MVP

Buyer + Seller produce/inputs marketplace. Web-first, mobile-first responsive
(installable-quality experience at 375px and up), dark/moody theme with gold
accents.

**Scope**: strictly the Buyer + Seller core loop. Rental Provider,
Logistics/Driver, Labor, Warehouse and Educator verticals are intentionally
out of scope for this build.

## Stack

| Layer    | Tech |
|----------|------|
| Backend  | Motoko canister on the Internet Computer (Caffeine template) |
| Frontend | React 19 + Vite + TypeScript + Tailwind (shadcn/ui), TanStack Router/Query |
| Bindings | `pnpm bindgen` generates typed TS bindings from the canister Candid |
| Auth     | Phone + OTP → canister session token (consumer); email + password (admin employees) |
| Payments | Razorpay-shaped simulated provider with idempotent webhook confirmation |
| KYC      | Setu/HyperVerge-shaped simulated provider with confidence scores |

Live provider keys (MSG91, Razorpay, Setu/HyperVerge, R2/S3) are documented in
`.env.example`; the backend's `environment` config gates all simulated paths
so production fails loudly rather than accepting dev shortcuts.

## Repo layout

```
src/backend/
  types/core.mo     # data model — every status enum has a documented transition map
  lib/rules.mo      # pure domain rules: order state machine, KYC gate/banding, rate limits
  lib/payments.mo   # idempotent checkout confirmation (upsert on idempotencyKey)
  lib/seed.mo       # dev seed data + default config (single source for business rules)
  main.mo           # stateful API: auth, listings, KYC, bank/payouts, orders, admin
  migration.mo      # upgrade migration dropping the legacy AgroVibes state
test/               # mops tests: state machine, idempotency, KYC gating
src/frontend/       # consumer app + admin console (/admin)
```

## Commands

```bash
# Backend (from repo root)
mops install        # install Motoko deps
mops build          # build canister (+ stable-compatibility check)
mops check --fix    # lint
mops test           # unit tests (order machine, idempotency, KYC gate)
pnpm bindgen        # regenerate frontend bindings from backend.did

# Frontend (from src/frontend)
pnpm install --prefer-offline
pnpm dev            # local dev server
pnpm typecheck && pnpm check
pnpm build
```

## Local development guide

Everything below applies to the **Development** environment only (the
canister's default config). Production requires live provider credentials.

### Test OTP

No SMS is sent in Development. Any valid Indian mobile number accepts the
fixed code **`000000`**. The OTP itself is never returned by the API.
Rate limit: 3 sends / 10 minutes per number (config-driven).

### Seeded accounts

| Account | Login | Notes |
|---------|-------|-------|
| Buyer | phone `9000000001` | Anita Deshmukh, onboarded, no KYC |
| Seller (verified) | phone `9000000002` | Ravi Kumar — KYC VERIFIED, verified bank account, 3 published listings |
| Seller (unverified) | phone `9000000003` | Suresh Patil — KYC NONE, exercises the KYC gating middleware |
| Admin | `admin@cropvibe.in` / `CropVibe@123` | Employee console at `/admin` (separate auth path) |

### Simulation hooks

- **KYC provider** — the uploaded file's *name* drives the outcome:
  `review` → gray-zone score (manual admin queue), `blurry` / `expired` /
  `mismatch` / `selfie-mismatch` / `fraud` → the matching auto-rejection
  (fraud is a hard block), anything else auto-approves.
- **Penny drop** — a bank account number ending in `0000` fails Fund
  Account Validation; anything else verifies.
- **Payments** — checkout confirms instantly; the checkout sheet has a
  dev-only "simulate a failed payment" action.
- **Seeded IFSC master** — try `HDFC0000240`, `SBIN0000691`, `ICIC0000104`,
  `PUNB0055000`, `UTIB0000037`, `KKBK0000958`.

### Config-driven business rules

KYC checkout threshold (₹10,000), payout hold (48h), OTP rate limit, KYC
attempt cap (5 per 72h), auto-approve confidence threshold, priority bands
and commission (5%) all live in the canister `AppConfig` (seeded in
`lib/seed.mo`, editable via `adminUpdateConfig`) — never hardcoded in
components or route handlers.
