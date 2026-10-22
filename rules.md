# Ladder Assistance — Rules

Read before writing code in `ladder-assistance`. When this file is silent, follow `../ladder-web/rules.md`. Fix this file in the same change if it's wrong.

## 1. What we are building

A responsive web app a partner (first: **Zenith**) uses to open customer accounts. The customer identifies with **BVN or NIN**, **BVN and NIN**, or their **Ladder ID** (looked up in the same `ladder-backend` database as Ladder Web), passes a **liveness check**, and reviews the details we retrieved.

- The designs in `../ladder-assisntance-screens` are the **mobile** breakpoint. Tablet/desktop follow §5.
- Backend: `../ladder-backend`. The endpoints below don't exist yet, so build against MSW mocks (§9).

## 2. Screens and flow

| # | Screen | Route |
|---|---|---|
| 1 | Open a new account (choose a method) | `/` |
| 2 | BVN or NIN | `/bvn-or-nin` |
| 3 | BVN and NIN (not designed) | `/bvn-and-nin` |
| 4 | Verify your Ladder ID | `/ladder-id` |
| 5 | Liveness check | `/liveness` |
| 6 | Verifying your details | `/verifying` |
| 7 | Your details | `/details` |
| 8 | Complete (placeholder) | `/complete` |

```
/ ─► /bvn-or-nin | /bvn-and-nin | /ladder-id ─► /liveness ─► /verifying ─► /details ─► /complete
```

- **`/`**: partner logo, "Open a new account with {partner}", two option cards (BVN or NIN, BVN and NIN), "OR", then "Create account using Ladder ID". Skyline and tagline at the bottom.
- **`/bvn-or-nin`**: BVN | NIN toggle (BVN default), 11-digit number, date of birth. Continue is disabled until the form is valid. On a mismatch, show "Information mismatch." under date of birth and a pinned **Get Help** (WhatsApp) button.
- **`/bvn-and-nin`**: same layout with BVN and NIN fields and no toggle.
- **`/ladder-id`**: ID illustration, Ladder ID field, Verify. Success → `/liveness`.
- **`/liveness`**: same behaviour as Ladder Web (`LivenessCamera` + `useCamera`), with the red CTA. Success → `/verifying`.
- **`/verifying`**: spinner while `GET /assistance/details` loads, then `replace('/details')`. Error → Try again + Get Help.
- **`/details`**: "We found your details" banner, Personal Information (full name, date of birth, phone, email), Additional Information (residential address). CTA **Continue** → confirm → `/complete`.

**Design fixes:** the Ladder ID placeholder is `e.g. LID-7F3A-9K2D` (the backend format), the fourth details card is "Email address", and the details CTA is "Continue", not "Verify Face".

**Open questions:** the BVN and NIN design · what reference face liveness compares against for BVN/NIN · which "additional information" fields, and whether they are retrieved or typed · what happens after confirm · how the partner is authenticated.

## 3. Stack

Same as Ladder Web: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, React Hook Form + Zod, Axios, TanStack Query, Zustand, MSW, ESLint + Prettier, pnpm. Dev server on port **3001**.

## 4. Structure and imports

```
src/
├── app/          routes only: page.tsx, (identify)/, (verification)/ (guarded)
├── features/     onboarding, identity, liveness, details, session
│                 each has api/ hooks/ components/ schemas/ types/ utils/ index.ts
├── components/   ui/ (generic) · layout/ (ScreenShell, BrandPanel, RouteGuard, GetHelpButton…)
├── lib/          api/ (client, endpoints, errors, query-client) · utils/
├── store/        assistance.store.ts
├── config/       env.ts, routes.ts, partner.ts
├── mocks/        MSW handlers + db.ts
├── types/  styles/
```

- `app/` → `features/*` (via `index.ts`) and `components/`. A feature never imports another feature's internals.
- `components/ui` has no API calls, store or partner config.
- Use the `@/` alias. **Never import from `../ladder-web`**; copy what you need.
- Naming follows Ladder Web: `PascalCase.tsx`, `useXxx.ts`, `<feature>.api.ts`, kebab-case routes, named exports.

## 5. Layout

- **Mobile (< 768px):** pixel-match the designs. Don't draw the phone status bar.
- **Tablet (768–1023px):** centred column, max 480px; CTAs sit inline.
- **Desktop (≥ 1024px):** split view, with a sticky partner `BrandPanel` on the left (logo, skyline, tagline, "Powered by Ladder") and content on the right (max 480px, vertically centred).
- All framing lives in `ScreenShell`. Screens only reflow their own content.
- Check every screen at 375, 390, 820 and 1440px.

## 6. Branding and tokens

- The partner's name, logo, tagline and WhatsApp link come from `config/partner.ts` and `public/brand/`. Never hard-code "Zenith" in a component.
- Colours and radii are tokens in `globals.css` (`primary-600`, `primary-100`, `text-muted`, `border`, `danger`, `success`, …), sampled from the designs. No hex values in components.

## 7. API

Call chain: `page → component → hook → <feature>.api.ts → lib/api/client.ts`. Components never use axios. Hooks never build URLs. Navigation happens in components.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/assistance/identify/bvn` | `{ bvn, dateOfBirth }` | `{ status }` + session cookie |
| POST | `/assistance/identify/nin` | `{ nin, dateOfBirth }` | same |
| POST | `/assistance/identify/bvn-and-nin` | `{ bvn, nin, dateOfBirth }` | same |
| POST | `/assistance/identify/ladder-id` | `{ ladderId }` | same |
| POST | `/assistance/liveness` | multipart `selfie` | `{ status }` |
| GET | `/assistance/status` | — | `{ method, identity, liveness }` |
| GET | `/assistance/details` | — | `{ fullName, dateOfBirth, phoneNumber, email, residentialAddress }` |
| POST | `/assistance/confirm` | `{ residentialAddress? }` | `{}` |
| POST | `/assistance/session/end` | — | clears cookie |

- Same envelope as the backend: `{ success, message, data }` / `{ success: false, message, code, errors? }`.
- Error codes: `INFORMATION_MISMATCH`, `BVN_NOT_FOUND`, `NIN_NOT_FOUND`, `BVN_NIN_MISMATCH`, `LADDER_ID_NOT_FOUND`, `FACE_MISMATCH`, `LIVENESS_FAILED`, `LIVENESS_REQUIRED` (403), `ASSISTANCE_SESSION_EXPIRED` (401 → `/`), `RATE_LIMITED`.
- Session: a short-lived httpOnly cookie set on identify. Every request sends `X-Partner-Id`. `RouteGuard` uses `/assistance/status` to keep users on their next step.

## 8. Forms and state

- Zod schema + React Hook Form. Submit buttons are disabled until the form is valid.
- BVN/NIN: 11 digits. Date of birth: native date input, 18+, sent as `YYYY-MM-DD`. Ladder ID: `LID-XXXX-XXXX`, upper-cased.
- Server data lives in TanStack Query. Flow state (chosen method, confirmed flag) lives in Zustand, not persisted. Form input stays in the form.

## 9. Mocks

`NEXT_PUBLIC_USE_MOCKS=true`. Test values:

| Input | Result |
|---|---|
| BVN/NIN `00000000000` | not found |
| BVN/NIN `11111111111` | `INFORMATION_MISMATCH` |
| NIN `22222222222` (BVN and NIN) | `BVN_NIN_MISMATCH` |
| `44444444444` / `LID-4444-4444` | liveness fails (`FACE_MISMATCH`) |
| `LID-2222-2222` | `LADDER_ID_NOT_FOUND` |
| `LID-5555-5555` | no address returned |
| anything else valid | success |

## 10. Security (non-negotiable)

- **No personal data before liveness passes.** Identify endpoints return a status only.
- Ladder ID "not found" and "not verified" return the same error.
- Never log or store BVN, NIN, date of birth, Ladder ID, selfies or details on the client (no localStorage, URLs or query keys). Clear the query cache on finish and on 401.
- Start the camera only after the user presses Verify Face, and stop it on capture, cancel, error and unmount. Upload the selfie straight from `/liveness`.
- Only public `NEXT_PUBLIC_` env vars; no secrets.

## 11. Accessibility

Labels on every input. The BVN/NIN toggle is a radiogroup. Errors are linked to their field and announced. Liveness and loading states use `aria-live`. Contrast meets WCAG AA. Focus rings are visible.

## 12. Done checklist

- [ ] Matches mobile design at 375/390; tablet and desktop per §5
- [ ] Loading, success and error states
- [ ] Works on mocks; follows §7
- [ ] No hard-coded partner branding; no sensitive data logged or stored
- [ ] Keyboard and screen-reader usable
- [ ] `pnpm lint` and `pnpm typecheck` pass
