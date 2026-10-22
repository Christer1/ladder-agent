# Ladder Assistance

Ladder Assistance is a responsive web app that a partner bank uses to open accounts for its customers. The first partner is Zenith. Instead of filling in a long form, the customer proves who they are once. Ladder then retrieves their details and pre-fills the account-opening form.

The customer can identify in one of three ways:

- **BVN or NIN**, plus their date of birth
- **BVN and NIN** together, plus their date of birth
- their **Ladder ID**, if they already verified with [Ladder Web](../ladder-web)

After that, they pass a **liveness check** and review the details that were retrieved.

## Status

The screens are built, but **the app runs on mock data (MSW)**. The `/assistance/*` endpoints it calls do not exist in [`ladder-backend`](../ladder-backend) yet. The planned contract is under [API contract](#api-contract). Until the backend serves those endpoints, keep `NEXT_PUBLIC_USE_MOCKS=true`.

## User flow

```
/  →  /bvn-or-nin | /bvn-and-nin | /ladder-id  →  /liveness  →  /verifying  →  /details  →  /complete
```

| Route          | What happens                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Partner branding and the three ways to identify                                                                                                                                                        |
| `/bvn-or-nin`  | BVN or NIN toggle, 11-digit number and date of birth. A mismatch marks every field and shows "Information mismatch." with a Get Help (WhatsApp) link                                                   |
| `/bvn-and-nin` | BVN, NIN and date of birth                                                                                                                                                                             |
| `/ladder-id`   | Ladder ID such as `LID-XXXX-XXXX`. Validation is loose (6–32 letters, numbers and dashes, any case) so a format change doesn't break the screen                                                        |
| `/liveness`    | Camera check. It starts only after the customer presses Verify Face                                                                                                                                    |
| `/verifying`   | Loading screen while the details are fetched                                                                                                                                                           |
| `/details`     | Retrieved details (name, date of birth, gender, phone, email, state of origin and residence, town, address). Missing values show as empty; if no residential address is on file, the customer types it |
| `/complete`    | Confirmation. Done ends the session                                                                                                                                                                    |

`RouteGuard` uses `GET /assistance/status` to keep the customer on their next step.

## Tech stack

- **Next.js 16** (App Router, `cacheComponents`), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** (partner colours are tokens in `src/styles/globals.css`)
- **TanStack Query** for server state, **Zustand** for flow flags
- **React Hook Form** + **Zod** for forms
- **Axios** with a single client in `src/lib/api/client.ts`
- **MSW** for the mock backend
- **npm**, ESLint, Prettier

## Getting started

You need Node.js 20.9 or later and npm (the version is pinned in `package.json` → `packageManager`). The repo uses npm only: commit `package-lock.json` and don't add a `pnpm-lock.yaml` or `yarn.lock`.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Use `npm ci` for a clean install that matches the lockfile exactly; use `npm install <pkg>` only when adding or upgrading a dependency.

npm may warn that `msw` and `unrs-resolver` have install scripts that aren't approved. Neither is needed: the MSW worker is already committed at `public/mockServiceWorker.js` (regenerate it with `npx msw init public` after upgrading MSW).

Open http://localhost:3001. Ladder Web uses port 3000, so both can run at the same time.

### Environment variables

All of these are public (`NEXT_PUBLIC_`). Never put a secret here.

| Variable                           | Default                         | Description                                                                         |
| ---------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`         | `http://localhost:4000/api/v1`  | Base URL of `ladder-backend`. Required for production builds                        |
| `NEXT_PUBLIC_USE_MOCKS`            | `false`                         | `true` serves the API from the MSW mocks in `src/mocks` (development only)          |
| `NEXT_PUBLIC_PARTNER_ID`           | `zenith`                        | Sent as the `X-Partner-Id` header                                                   |
| `NEXT_PUBLIC_PARTNER_NAME`         | `Zenith`                        | Shown in the UI                                                                     |
| `NEXT_PUBLIC_PARTNER_TAGLINE`      | `Banking for a brighter future` | Shown over the skyline at the bottom of the mobile welcome screen                   |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP_URL` | placeholder `wa.me` link        | Target of the Get Help button. Set the partner's real support number per deployment |

The partner logo and skyline are in `public/brand/`. On desktop the brand panel draws the skyline faded across its lower half, behind the subtext; the SVG uses `preserveAspectRatio="none"` and non-scaling strokes so it can stretch to fit.

### Mock test values

With mocks on, these inputs trigger each result (see `src/mocks/handlers/`). Any date of birth that makes the customer 18 or older is accepted.

| Input                                     | Result                                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| BVN or NIN `00000000000` or `11111111111` | Information mismatch                                                                                |
| NIN `22222222222` (on BVN and NIN)        | Information mismatch (BVN and NIN belong to different people)                                       |
| `44444444444` or `LID-4444-4444`          | Liveness then fails (face mismatch)                                                                 |
| `LID-2222-2222` or `LID-3333-3333`        | Ladder ID not found, with Get Help (the backend gives one error for "not found" and "not verified") |
| `LID-5555-5555`                           | No address on file, so the customer types it                                                        |
| Anything else that is valid               | Success                                                                                             |

## Scripts

| Command                       | Description                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`                 | Dev server on port 3001                                                                |
| `npm run build` / `npm start` | Production build / serve it. `NEXT_PUBLIC_API_BASE_URL` must be set or the build fails |
| `npm run lint`                | ESLint                                                                                 |
| `npm run typecheck`           | `tsc --noEmit`                                                                         |
| `npm run format`              | Prettier (write)                                                                       |
| `npm run format:check`        | Prettier (check only, for CI)                                                          |

## Audit checklist

This repo is audited. Before opening a PR, run:

```bash
npm ci
npm run lint
npm run typecheck
npm run format:check
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1 npm run build
npm audit --omit=dev
```

All of these must pass, and `npm audit --omit=dev` must report 0 vulnerabilities.

### Known audit findings

`npm audit` (including dev dependencies) reports **5 high-severity findings**. They are one issue: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), a denial of service in `braces` triggered by deeply nested patterns:

```
eslint-config-next@16.4.2 → @next/eslint-plugin-next → fast-glob → micromatch → braces@3.0.3
```

- **Dev-only.** It's pulled in by the ESLint config and never ships in the app bundle; `npm audit --omit=dev` is clean.
- **No safe fix yet.** Every published version of `braces` is affected. `npm audit fix --force` "fixes" it by downgrading `eslint-config-next` to 14.x, which is incompatible with Next.js 16. Don't run it.
- **Exposure.** ESLint only expands glob patterns from this repo's own config, not from user input.
- **Action.** Upgrade `eslint-config-next` when a release ships a patched dependency chain, then re-run `npm audit`.

## Project structure

```
src/
├── app/              Routes only: (identify)/ and (verification)/ (guarded)
├── features/         onboarding, identity, liveness, details, session
│   └── <feature>/        api/ · hooks/ · components/ · schemas/ · types/ · utils/ · index.ts
├── components/       ui/ (generic) and layout/ (ScreenShell, BrandPanel, RouteGuard…)
├── config/           env (Zod-validated), routes, partner branding
├── lib/              API client, endpoints, utilities
├── mocks/            MSW handlers and in-memory mock state
├── store/            Zustand store (flow flags only)
└── styles/           Global CSS and tokens
```

Data always flows through the same chain:

```
page.tsx → feature component → useXxx hook → xxx.api.ts → lib/api/client.ts → backend
```

## API contract

The `/assistance/*` endpoints are a proposal until `ladder-backend` serves them. Paths live in `src/lib/api/endpoints.ts`.

Call chain: `page → component → hook → <feature>.api.ts → lib/api/client.ts`. Components never use axios. Hooks never build URLs. Navigation happens in components.

| Method | Path                               | Body                        | Returns                                                                                                                                                         |
| ------ | ---------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/assistance/identify/bvn`         | `{ bvn, dateOfBirth }`      | `{ status }` + session cookie                                                                                                                                   |
| POST   | `/assistance/identify/nin`         | `{ nin, dateOfBirth }`      | same                                                                                                                                                            |
| POST   | `/assistance/identify/bvn-and-nin` | `{ bvn, nin, dateOfBirth }` | same (both must be the same person)                                                                                                                             |
| POST   | `/assistance/identify/ladder-id`   | `{ ladderId }`              | same                                                                                                                                                            |
| POST   | `/assistance/liveness`             | multipart `selfie`          | `{ status }`                                                                                                                                                    |
| GET    | `/assistance/status`               | —                           | `{ method, identity, liveness }`                                                                                                                                |
| GET    | `/assistance/details`              | —                           | `{ fullName, dateOfBirth, gender, phoneNumber, email, stateOfOrigin, stateOfResidence, town, residentialAddress }` (all but name and date of birth may be null) |
| POST   | `/assistance/confirm`              | `{ residentialAddress? }`   | `{}`                                                                                                                                                            |
| POST   | `/assistance/session/end`          | —                           | clears cookie                                                                                                                                                   |

- Same envelope as the backend: `{ success, message, data }` / `{ success: false, message, code, errors? }`.
- Error codes: `INFORMATION_MISMATCH` (any wrong/unknown number or date of birth, or a BVN and NIN of different people: the backend never says which), `LADDER_ID_NOT_FOUND`, `LIVENESS_REQUIRED` (403), `ASSISTANCE_SESSION_EXPIRED` (401 → `/`), `PARTNER_NOT_ALLOWED` (403), `RATE_LIMITED`, `VALIDATION_FAILED`. `FACE_MISMATCH` exists only in mocks until a liveness provider is added.
- Session: a short-lived httpOnly cookie set on identify. Every request sends `X-Partner-Id`. `RouteGuard` uses `/assistance/status` to keep users on their next step.

## Security and privacy

- No personal data is returned before liveness passes. The identify endpoints return a status only.
- A Ladder ID that doesn't exist and one that isn't verified return the same error, so IDs can't be probed.
- BVN, NIN, date of birth, Ladder ID, selfies and retrieved details are never logged or kept on the device: no localStorage, URLs or query keys. The query cache is cleared when the session ends and on a 401.
- The camera stops on capture, cancel, error and leaving the page.
