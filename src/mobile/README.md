# CropVibe Mobile (Expo)

Native iOS/Android shell for the CropVibe Buyer + Seller marketplace.
Scaffolded with `create-expo-app` (Expo Router + `src/app`).

## Run

```bash
cd src/mobile
pnpm install --prefer-offline
pnpm start          # Expo Go / dev server
pnpm web            # web preview
pnpm typecheck
```

## Tabs (shell)

| Route | Screen |
|-------|--------|
| `/` | Browse |
| `/sell` | Sell |
| `/orders` | Orders |
| `/profile` | Profile |

Screens are placeholders until web→native migration fills them in.

## EAS builds

`eas.json` defines `development`, `preview`, and `production` profiles.

```bash
cd src/mobile
# CI / cloud agents: export EXPO_TOKEN=… (https://expo.dev/settings/access-tokens)
npx eas-cli login          # interactive machines
npx eas-cli init           # once — links the Expo project + writes projectId
npx eas-cli build --platform all --profile production --non-interactive
```

Cloud builds require an Expo account (`EXPO_TOKEN` or `eas login`). iOS also needs Apple Developer credentials configured via `eas credentials`.
