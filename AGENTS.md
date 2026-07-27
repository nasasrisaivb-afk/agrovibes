# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

[No learnings yet]

## Cursor Cloud specific instructions

This is a Caffeine.ai template: a Motoko (Internet Computer) backend canister in `src/backend/` plus a React + Vite frontend in `src/frontend/`. The update script already runs `pnpm install --prefer-offline` and `mops install`, so dependencies and the moc/lintoko toolchain are refreshed on startup.

- **Package manager**: `pnpm` is provided via corepack and is pinned to `10.33.3`. Under 10.33.3, `pnpm install` correctly runs the native build scripts allow-listed in `pnpm-workspace.yaml` (`esbuild`, `sharp`, `@biomejs/biome`). Do NOT let it upgrade to pnpm 11.x — pnpm 11 both marks those build scripts as "ignored" and then refuses to run any `pnpm <script>` (its "verify deps before run" check), which breaks `dev`/`build`/`check`. If `pnpm -v` ever shows 11.x, run `corepack prepare pnpm@10.33.3 --activate`, then reinstall with `rm -rf node_modules src/frontend/node_modules && pnpm install` (a pnpm-11-created `node_modules` triggers a non-TTY purge abort under pnpm 10).
- **Backend commands run from the repo ROOT** (`mops.toml` lives at the root), even though the "Verified Commands" section phrases them as `src/backend/`. Use `mops install` / `mops build` / `mops check` from `/workspace`. `mops build` emits `src/backend/dist/backend.{did,wasm,most}`.
- **`pnpm bindgen` cannot run here**: it needs `caffeine-bindgen`, a Caffeine-internal CLI that is not installed in this environment. The generated bindings in `src/frontend/src/` (`backend.ts`, `declarations/`) are already committed and match the current backend. Only re-run bindgen if you change the backend interface — which is not possible in this VM, so hand-edit bindings if strictly needed.
- **Run the app**: `pnpm dev` from `src/frontend` serves on http://localhost:5173. Vite's ready banner is suppressed (`logLevel: "error"` in `vite.config.js`), so the server is up even though nothing prints after `> vite --host`.
- **No local IC replica / no canister**: there is no `dfx`/`dfx.json`. At runtime `env.json` has `backend_canister_id: "undefined"` and `CANISTER_ID_BACKEND` is unset, so `useActor` throws inside `loadConfig` and all actor-backed React Query hooks fall back to empty arrays (the app does NOT crash). Canister deployment is handled by the Caffeine platform, not locally. For local dev/testing, exercise the flows that work without a canister: mock-backed features (`/messages` send message, `/learn` enroll) via `src/frontend/src/mocks/backend.ts`, and hardcoded sample data (`/` prices+sellers, `/discover` listings, `/resources` calendar). Marketplace listings/orders/reels/Q&A/services need a deployed canister.
- **Known pre-existing issue**: `pnpm typecheck` (frontend `tsc --noEmit`) fails because `src/mocks/backend.ts` does not implement every method of the generated `backendInterface`. This is committed code unrelated to setup; `pnpm dev` and `pnpm build` use Vite/esbuild (no `tsc`) so the app builds and runs fine, and `pnpm check` (biome lint) passes cleanly.
