# Ladder Assistance

Ladder Assistance is a responsive web app that a partner bank uses to open accounts for its customers. The first partner is Zenith. Instead of filling in a long form, the customer proves who they are once. Ladder then retrieves their details and pre-fills the account-opening form.

The customer can identify in one of three ways:

- **BVN or NIN**, plus their date of birth
- **BVN and NIN** together, plus their date of birth
- their **Ladder ID**, if they already verified with [Ladder Web](../ladder-web)

After that, they pass a **liveness check** and review the details that were retrieved.

> Read [`rules.md`](rules.md) before writing code. It covers scope, screens, the API contract, security and the definition of done.

## Status

The screens are built, but **the app runs on mock data (MSW)**. The `/assistance/*` endpoints it calls do not exist in [`ladder-backend`](../ladder-backend) yet. The planned contract is in `rules.md` §7. Until the backend serves those endpoints, keep `NEXT_PUBLIC_USE_MOCKS=true`.

## User flow

```
/  →  /bvn-or-nin | /bvn-and-nin | /ladder-id  →  /liveness  →  /verifying  →  /details  →  /complete
```

| Route | What happens |
|---|---|
| `/` | Partner branding and the three ways to identify |
| `/bvn-or-nin` | BVN or NIN toggle, 11-digit number and date of birth. A mismatch shows "Information mismatch." and a Get Help (WhatsApp) button |
| `/bvn-and-nin` | BVN, NIN and date of birth |
| `/ladder-id` | Ladder ID in the format `LID-XXXX-XXXX` |
| `/liveness` | Camera check. It starts only after the customer presses Verify Face |
| `/verifying` | Loading screen while the details are fetched |
| `/details` | Retrieved details. If no residential address is on file, the customer types it |
| `/complete` | Confirmation. Done ends the session |

`RouteGuard` uses `GET /assistance/status` to keep the customer on their next step.

## Tech stack

- **Next.js 16** (App Router, `cacheComponents`), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** (partner colours are tokens in `src/styles/globals.css`)
- **TanStack Query** for server state, **Zustand** for flow flags
- **React Hook Form** + **Zod** for forms
- **Axios** with a single client in `src/lib/api/client.ts`
- **MSW** for the mock backend
- **pnpm**, ESLint, Prettier

## Getting started

You need Node.js 20 or later and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3001. Ladder Web uses port 3000, so both can run at the same time.

### Environment variables

All of these are public (`NEXT_PUBLIC_`). Never put a secret here.

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000/api/v1` | Base URL of `ladder-backend`. Required for production builds |
| `NEXT_PUBLIC_USE_MOCKS` | `false` | `true` serves the API from the MSW mocks in `src/mocks` (development only) |
| `NEXT_PUBLIC_PARTNER_ID` | `zenith` | Sent as the `X-Partner-Id` header |
| `NEXT_PUBLIC_PARTNER_NAME` | `Zenith` | Shown in the UI |
| `NEXT_PUBLIC_PARTNER_TAGLINE` | `Banking for a brighter future` | Shown on the brand panel |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP_URL` | placeholder `wa.me` link | Target of the Get Help button. Set the partner's real support number per deployment |

The partner logo and skyline are in `public/brand/`.

### Mock test values

With mocks on, these inputs trigger each result (`rules.md` §9). Any date of birth that makes the customer 18 or older is accepted.

| Input | Result |
|---|---|
| BVN or NIN `00000000000` | Not found |
| BVN or NIN `11111111111` | Information mismatch |
| NIN `22222222222` (on BVN and NIN) | BVN and NIN belong to different people |
| `44444444444` or `LID-4444-4444` | Liveness then fails (face mismatch) |
| `LID-2222-2222` | Ladder ID not found |
| `LID-5555-5555` | No address on file, so the customer types it |
| Anything else that is valid | Success |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Dev server on port 3001 |
| `pnpm build` / `pnpm start` | Production build / serve it |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier |

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

## Security and privacy

- No personal data is returned before liveness passes. The identify endpoints return a status only.
- A Ladder ID that doesn't exist and one that isn't verified return the same error, so IDs can't be probed.
- BVN, NIN, date of birth, Ladder ID, selfies and retrieved details are never logged or kept on the device: no localStorage, URLs or query keys. The query cache is cleared when the session ends and on a 401.
- The camera stops on capture, cancel, error and leaving the page.

See `rules.md` §10.
