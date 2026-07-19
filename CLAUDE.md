# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npx expo start          # start dev server (scan QR for device)
npx expo start --web    # run in browser
npx expo start --ios    # run in iOS simulator
npx expo start --android
```

There is no lint or test script configured.

## Environment

Two env vars are required (create `.env.local`):
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

**Routing** — Expo Router (file-based). Three route groups:
- `app/(auth)/` — sign-in, sign-up (unauthenticated)
- `app/onboarding/` — 6-step onboarding flow (authenticated, no profile yet)
- `app/(tabs)/` — main app (authenticated + profile complete)

**Auth guard** lives entirely in `app/_layout.tsx` (`RootLayoutNav`). It watches `session` (from `AuthContext`) and `profile` (from `useProfile`) and redirects between the three groups. No per-screen auth checks are needed.

**Onboarding** collects data across 6 steps using `OnboardingContext` (in-memory accumulator). The context is provided by `app/onboarding/_layout.tsx` so it lives only for the duration of the flow.

**Backend** — Supabase. The client is in `lib/supabase.ts`. On native, sessions are stored in `expo-secure-store`; on web, `AsyncStorage` is used as a fallback. The `supabase.ts` file also exports the `Profile` and `UserGoal` TypeScript types.

**Data fetching** — TanStack Query (`@tanstack/react-query`), persisted to AsyncStorage via `lib/queryClient.ts`. Cache: 5 min stale, 24 h GC. `useProfile` in `hooks/useProfile.ts` is the canonical way to read the current user's profile row; use `useInvalidateProfile` after writes.

**Database schema** is in `supabase/schema.sql`. Tables: `profiles` (1-to-1 with `auth.users`) and `user_goals` (many per user). Both have RLS — users can only read/write their own rows.

## Design system

**Palette** — import `C` from `@/constants/palette`. Never use raw hex values.

**Typography** — import `FONTS` from `@/constants/typography`. Always use the custom `Text` component from `@/components/ui/Text` instead of React Native's `Text`. It maps `fontWeight` values to the correct Afacad font file; setting `fontWeight` directly on RN's `Text` without it causes font synthesis issues on iOS/Android.

**Shadows** — use `Platform.select` with `boxShadow` for web and `shadow*` props for native. Never use `shadow*` props alone or the web console will warn.

## UI components

Reusable components live in `components/ui/`:

| Component | Notes |
|---|---|
| `Text` | Must use instead of RN `Text` everywhere |
| `Button` | Variants: `primary`, `brand`, `outline` |
| `TextInputField` | Label + input in one component. Props: `label`, `type` (`text`\|`email`\|`password`), `required`. Email type validates format on blur. Password type includes a show/hide toggle. |
| `Header`, `InfoTooltip`, `Tag` | General UI primitives |

Onboarding-specific components (`OnboardingHeader`, `StepDots`, `ContinueButton`, `SelectableCard`) live in `components/onboarding/`. `OnboardingHeader` accepts `showBack={false}` to hide the back button (used on step 1).

## Path alias

`@/` resolves to the repo root, configured in `tsconfig.json`.
