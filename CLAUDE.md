# Tag Along — Project Context

## What this is
A location-sharing social app. A user posts where they're heading (e.g. a mall,
restaurant, venue) with an estimated arrival time. Friends or a specific group
get notified and can "tag along" — respond with going / maybe / can't, and see
live status (on my way / arrived). Posts are visibility-scoped (all friends,
specific friends, or a group) and time-bound (auto-expire, not a permanent
location log).

Deferred to v2, do not build yet: location chaining (multi-stop itineraries),
algorithmic feed, venue/business accounts, native mobile app.

## Reality check on the idea (for context, not to re-litigate)
This is not a novel mechanic — Snap Map, Close Friends stories, and group
chats with a pinned location already cover this informally. The value is in
narrowing the audience (e.g. a specific campus/community rather than "everyone")
and keeping the product a utility (post, notify, expire, done) rather than
building a persistent feed/profile social network. Landing page and scope
decisions should reflect that, not "next big social app" framing.

## Goals
1. Real, live product with actual users (start narrow — one community/campus).
2. Portfolio piece: needs a live deployed demo, defensible architecture
   decisions, and a written case study (problem, architecture, trade-offs).

## Build split
- Frontend: Claude builds this (Next.js/React, TypeScript, Tailwind).
- Backend: Java / Spring Boot, built by Sailesh with Claude guiding step by
  step (explain-and-review, not "here's the code, paste it") — this is the
  learning-value part of the project. Confirm with Sailesh each backend phase
  whether he wants code written for him to review, or to write it himself
  with Claude reviewing/explaining — this was left open, ask if unclear.

## Stack
- Backend: Spring Boot, Spring Data JPA, Spring Security + JWT, PostgreSQL,
  WebSocket/STOMP for real-time, Maven/Gradle.
- Frontend: Next.js, TypeScript, Tailwind, a places API (Mapbox or Google
  Places) for location picking/geocoding.
- Infra: backend on Render/Railway, frontend on Vercel, DB on Neon/Supabase
  or Railway managed Postgres. Web push notifications (service worker), not
  native push.

## Data model (Phase 0 — locked 2026-09-14)
Full entity definitions, fields, and authorization rules are in
`docs/data-model.md`; the API contract is `docs/openapi.yaml`. Summary:
- User (email/password + JWT, no OAuth in v1; `username` for friend search)
- Friendship — bidirectional accept (request/accept, not follow-based)
- Group, GroupMembership (direct-add by an admin, no accept step)
- Post: location (geocoded via places API), `etaMode` (STATIC or LIVE,
  poster's choice), expiry, visibility scope (all friends / specific
  friends / group), plus `PostVisibility` allow-list for the
  specific-friends case
- Response: user, post, status (going / maybe / can't / arrived), plus
  an explicit `sharingEta` opt-in so a responder can privately share
  their live ETA to the destination — visible only to the poster, never
  to other responders, and only as a computed ETA string, never raw
  coordinates

Key design rule: authorization on Post reads must be airtight — a bug here
leaks someone's real-time location to the wrong audience. Treat this as the
highest-scrutiny logic in the app, not routine CRUD. The same standard
applies to Response ETA/location visibility (see data-model.md).

## Roadmap / phases
0. API contract + data model locked (shared doc/OpenAPI spec) — not yet done
1. Backend skeleton (Spring Initializr, layers, DB connection, health check)
   + frontend shell (routing, auth pages, mock data)
2. Auth (Spring Security + JWT) + frontend login/signup
3. Friends + groups (JPA relationships) + frontend friend/group UI
4. Core loop: post a location (visibility + expiry logic, place picker,
   composer, feed) — the most important phase, spend real time here
5. Real-time responses (Spring WebSocket/STOMP) + frontend live status UI
6. Notifications (web push, scheduled expiry cleanup via @Scheduled)
7. Privacy/expiry enforcement audit + tests (expired posts actually
   inaccessible via API, not just hidden in UI; group-leave revokes access)
8. Deploy (Docker + Railway/Render for backend, Vercel for frontend,
   custom domain, demo account) + written case study

Status: Phase 0 complete (data model + API contract locked, see
docs/data-model.md and docs/openapi.yaml). Monorepo initialized
(frontend/, backend/, docs/). Nothing built yet — starting Phase 1 next.

## Working agreement
No filler, no preamble/wrap-up. Give recommendations first, then reasoning.
Push back on weak assumptions rather than defaulting to agreement. Keep scope
tight — flag scope creep against the roadmap above rather than silently
absorbing new feature requests into the current phase.
