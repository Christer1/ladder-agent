# Ladder Assistance — Rules

> **AI usage:** We used Claude AI (by Anthropic) as a development assistant on this project. The rules below are the guidelines the team wrote and followed while building it, with Claude's help.

Read before writing code in `ladder-assistance`. When this file is silent, follow `../ladder-web/rules.md`. Fix this file in the same change if it's wrong.

## 1. What we are building

A responsive web app a partner (first: **Zenith**) uses to open customer accounts. The customer identifies with **BVN or NIN**, **BVN and NIN**, or their **Ladder ID** (looked up in the same `ladder-backend` database as Ladder Web), passes a **liveness check**, and reviews the details we retrieved.

- The designs in `../ladder-assisntance-screens` are the **mobile** breakpoint. Tablet/desktop follow §5.
- Backend: `../ladder-backend` (`modules/assistance`). BVN/NIN are checked against its seeded `identity_records`; Ladder IDs against its `users`. MSW mocks (§9) mirror it for UI work.

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
- **`/bvn-or-nin`**: BVN | NIN toggle (BVN default), 11-digit number, date of birth. Continue is disabled until the form is valid. On `INFORMATION_MISMATCH`, mark both fields red and show "Information mismatch. Check your BVN and date of birth." under date of birth with an inline **Get help** card beside it (opens the help chat, see §7), not pinned to the bottom. Any edit clears it.
- **`/bvn-and-nin`**: same layout with BVN and NIN fields and no toggle; a mismatch marks all three fields.
- **`/ladder-id`**: ID illustration, Ladder ID field, Verify. Success → `/liveness`. `LADDER_ID_NOT_FOUND` shows under the field with Get help beside it.
- **`/liveness`**: same behaviour as Ladder Web (`LivenessCamera` + `useCamera`), with the red CTA. Success → `/verifying`.
- **`/verifying`**: spinner while `GET /assistance/details` loads, then `replace('/details')`. Error → Try again + Get Help.
- **`/details`**: "We found your details" banner, Personal Information on grey cards (full name, date of birth, gender, phone, email), Additional Information on white cards (state of origin, state of residence, town, residential address). Fields the record lacks are hidden; a missing address becomes an input. CTA **Continue** → confirm → `/complete`. Same screen for every method; for a Ladder ID, the email is the Ladder account's.

**Design fixes:** the Ladder ID placeholder is "Enter your Ladder ID" (no fixed format), the two "State" cards are state of origin and state of residence, the last card's duplicate "Phone number" is dropped, and the details CTA is "Continue", not "Verify Face".

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
| POST | `/assistance/identify/bvn-and-nin` | `{ bvn, nin, dateOfBirth }` | same (both must be the same person) |
| POST | `/assistance/identify/ladder-id` | `{ ladderId }` | same |
| POST | `/assistance/liveness` | multipart `selfie` | `{ status }` |
| GET | `/assistance/status` | — | `{ method, identity, liveness }` |
| GET | `/assistance/details` | — | `{ fullName, dateOfBirth, gender, phoneNumber, email, stateOfOrigin, stateOfResidence, town, residentialAddress }` (all but name and date of birth may be null) |
| POST | `/assistance/confirm` | `{ residentialAddress? }` | `{}` |
| POST | `/assistance/session/end` | — | clears cookie |
| POST | `/assistance/help-chat` | `{ reference? }` | `{ chatId, firebaseToken }` |
| POST | `/assistance/help-chat/:chatId/messages` | `{ text }` + `Authorization: Bearer <Firebase ID token>` | `202` |

- Same envelope as the backend: `{ success, message, data }` / `{ success: false, message, code, errors?, details? }`. A failed identify's `details.helpReference` (`LDR-XXXXXX`) is passed to its Get help card.
- **Help chat** (`features/help-chat`, `NEXT_PUBLIC_HELP_CHANNEL=web`). Get help opens the widget (`store/help-chat.store.ts`; mounted once in `Providers`); it never opens on its own. The backend opens the chat with the preset customer message and Ladder's language question, and the AI answers every message. The browser signs in to Firebase with `firebaseToken` (in-memory persistence only) and reads `helpChats/{chatId}` live; it never writes to Firestore. The Firebase SDK is loaded with `import()` only when the chat opens. `NEXT_PUBLIC_HELP_CHANNEL=whatsapp` switches Get help back to the WhatsApp link. Help chat 401s (`HELP_CHAT_SESSION_INVALID`) are shown in the chat and don't end the session. A support agent on `ladder-agent-dashboard` can take the chat over: their messages (`sender: 'agent'`) show their name, the header says who the customer is chatting with, and there is no typing indicator until they hand the chat back to the AI.
- Error codes: `INFORMATION_MISMATCH` (any wrong/unknown number or date of birth, or a BVN and NIN of different people: the backend never says which), `LADDER_ID_NOT_FOUND`, `LIVENESS_REQUIRED` (403), `ASSISTANCE_SESSION_EXPIRED` (401 → `/`), `PARTNER_NOT_ALLOWED` (403), `RATE_LIMITED`, `VALIDATION_FAILED`. `FACE_MISMATCH` exists only in mocks until a liveness provider is added.
- Session: a short-lived httpOnly cookie set on identify. Every request sends `X-Partner-Id`. `RouteGuard` uses `/assistance/status` to keep users on their next step.

## 8. Forms and state

- Zod schema + React Hook Form. Submit buttons are disabled until the form is valid.
- BVN/NIN: 11 digits. Date of birth: "DD / MM / YYYY" text with a calendar button, 18+, sent as `YYYY-MM-DD`. Ladder ID: deliberately loose so a format change doesn't break the screen: 6–32 letters, digits or dashes, sent as typed (trimmed); the backend matches case-insensitively.
- Server data lives in TanStack Query. Flow state (the "confirmed" flag) lives in Zustand, not persisted. The chosen method comes from `/assistance/status`. Form input stays in the form.

## 9. Mocks

With `NEXT_PUBLIC_USE_MOCKS=false`, the real backend answers: use the numbers and dates of birth printed by `npm run db:seed` in `ladder-backend` (its last table lists BVN + NIN pairs of the same person), and any Ladder ID of a user verified with a BVN or NIN. The backend's `WEB_ORIGIN` must include this app's origin.

`NEXT_PUBLIC_USE_MOCKS=true`. Test values:

| Input | Result |
|---|---|
| BVN/NIN `00000000000` or `11111111111` | `INFORMATION_MISMATCH` |
| NIN `22222222222` (BVN and NIN) | `INFORMATION_MISMATCH` |
| `44444444444` / `LID-4444-4444` | liveness fails (`FACE_MISMATCH`) |
| `LID-2222-2222` | `LADDER_ID_NOT_FOUND` |
| `LID-5555-5555` | no address returned |
| anything else valid | success |

Mock failures return the help reference `LDR-7K3QX9`. The help chat runs in memory (`mocks/help-chat.ts`; MSW can't fake Firestore) with a fixed reply.

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
