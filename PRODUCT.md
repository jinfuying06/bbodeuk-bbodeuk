# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are people in 1-2 person households (young adults/couples in small apartments or officetels) who want a low-pressure way to track cleaning per room, without guilt or scoring. In the current phase, users are usability-test participants exercising the prototype's core flows rather than organic end users.

## Product Purpose

뽀득뽀득 ("Bbodeuk-bbodeuk") is a cleaning-record service. This repository is not the finished product but an interactive Usability Test prototype: its purpose is to make the core UX operable end-to-end so real user behavior can be observed, not to ship a complete feature set. Success is measured by whether the core flows work naturally on mobile and validate the product's UX direction, not by code or feature volume.

## Positioning

The product records cleaning by "painting" a space's pastel color when an item is cleaned, rather than using a checklist or a completion percentage. State language ("Empty / Active Cleaning / Maintained / Needs Care") is deliberately non-punitive: the product never shows a cleanliness score, never labels anything "미완료/실패/지연/overdue/위험/더러움," and never pressures or scolds the user when a space needs attention again. This softer, ambient framing is the product's core differentiation from checklist- or streak-based cleaning trackers.

## Operating Context

- Mobile-first web app, base viewport 390×844, deployed to GitHub Pages via GitHub Actions (HashRouter, so deep links/refresh don't 404).
- No backend, database, or real API. Data is mock data, React component/session state, and optionally localStorage.
- AGENTS.md's original scope named exactly 3 MVP screens; the implementation has since grown to ~19 pages (Home, Welcome, Login, SignUp, Setup, Spaces, SpaceInfo, QuickRecord, ItemAdd/ItemHistory/ItemInfo, WeekendBigClean (대청소), Care/CareAction, History, Points, Settings, plus demo-only routes HomeStateDemo and SamplePaint). Treat the current routed page set, not the original "3 screens" text, as the live scope baseline going forward.
- Demo-only routes (`/sample-paint`, `/home/:state`) are directly reachable by URL but are not wired into the real start/record flow; don't treat their behavior as representative of the live app state.
- `PRODUCT_POLICY.md` is the authoritative, detailed behavioral spec for existing screens (points/space-expansion economy, home state logic, deep-clean session rules, record/color-fade behavior, history/guide behavior, badge/header rules) and should be read before changing any of those flows. It distinguishes "제품 원칙" (durable direction) from "현재 프로토타입" (current mocked behavior) — don't conflate the two.

## Capabilities and Constraints

- Explicitly out of scope for this phase: real login/signup accounts, backend, database, real payments/subscriptions, push notifications, real notifications, account management, server auth, admin pages, analytics integration — even where corresponding UI exists (e.g. Login/SignUp screens, Google/Kakao icons, Points purchase UI), it is currently non-functional/mocked or shows a "준비 중" (coming soon) toast.
- Points is a paid currency for expanding beyond the 4 free default spaces (거실/주방/욕실/방), not a reward for cleaning activity; core recording is always free and never gated behind points.
- Stack (React + TypeScript + Vite + Tailwind CSS, react-router-dom, npm, GitHub Pages) is already established by the codebase; don't introduce Next.js, a backend framework, a database, or external state-management libraries without clear necessity.

## Evidence on Hand

- `PRODUCT_POLICY.md` (프로토타입 정책, updated 2026-09-14) is the primary product-behavior record and is treated as complete — there is no separate PRD file in this repo or elsewhere to cross-reference.
- `AGENTS.md` records the original engineering/scope constraints for the prototype (now partially superseded by actual growth in routed pages, see Operating Context).
- `/mockups` referenced by AGENTS.md as the primary visual reference is not present in the current working tree; no mockup source files were found to verify against.
- Demo/test-only data (dates, balances, e.g. the fixed "오늘" of 2026-09-04 in History, the 500P demo balance) is illustrative only and must not be read as real user or account data.

## Product Principles

1. **Ambient, non-punitive state feedback.** Never show a cleanliness score or failure/urgency language; softly suggest the next light action instead.
2. **Color-fill over checklist.** Recording is expressed as filling a space's pastel color that fades slowly over time, not as checking off a completed task.
3. **Free core, paid expansion only.** The basic 4-space recording experience is always free; points/payment concepts apply solely to adding spaces beyond the defaults.
4. **Prototype fidelity over feature completeness.** When adding or changing screens, prioritize making the core usability-test flow truly operable over building out adjacent functionality (auth, payments, notifications) that isn't needed for that flow.
