# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`
- **dev**: `pnpm dev`

**Backend** (run from root):

- **install**: `mops install`
- **typecheck/lint**: `mops check --fix`
- **build**: `mops build`
- **test**: `mops test`

**Mobile / Expo** (run from `src/mobile/`):

- **install**: `pnpm install --prefer-offline`
- **start**: `pnpm start`
- **typecheck**: `pnpm typecheck`
- **web preview**: `pnpm web`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- `mops` CLI is not preinstalled; install with `npm config set prefix ~/.npm-global && npm i -g ic-mops` and add `~/.npm-global/bin` to PATH (global npm prefix `/usr/lib` is not writable).
- `pnpm bindgen` needs the `caffeine-bindgen` binary from the npm package `@caffeineai/bindgen` (root devDependency).
- The generated `src/frontend/src/backend.ts` imports `@caffeineai/object-storage` — keep it in frontend dependencies.
- The Caffeine moc config promotes lint codes to errors: use dot notation (`map.get(k)`, `list.add(x)`, `x.toText()`), omit implicit `compare` args, and use `CoreTypes.Result` (`mo:core/Types`) instead of `Result.Result`. Note: `.compare(...)` dot calls do NOT work on primitive Nat/Int — keep `Nat.compare(a, b)` in comparators. `label` is a reserved word and cannot be a record field name.
- `mops check`/`mops build` run a stable-compatibility check against `.old/src/backend/dist/backend.most`; dropping stable variables requires an explicit migration function (`(with migration = ...) actor`).
