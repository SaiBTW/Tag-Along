# Tag Along — Data Model (Phase 0, locked)

Status: locked 2026-09-14. Changes after this point should be deliberate,
not incidental — update this doc and the OpenAPI spec together.

## Entities

### User
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `email` | string, unique | auth identifier |
| `passwordHash` | string | bcrypt via Spring Security |
| `username` | string, unique, indexed | used for friend search |
| `displayName` | string | |
| `avatarUrl` | string, nullable | |
| `createdAt` | timestamp | |

No OAuth in v1 — email/password + JWT only.

### Friendship
Bidirectional accept. One row per pair, uniqueness enforced on the
unordered `(requesterId, addresseeId)` pair.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `requesterId` | FK → User | |
| `addresseeId` | FK → User | |
| `status` | enum: `PENDING`, `ACCEPTED`, `DECLINED` | |
| `createdAt` | timestamp | |
| `respondedAt` | timestamp, nullable | |

Unfriending deletes the row. No `Block` entity in v1 (deferred — flagged
as a real gap for a location-sharing app, revisit before public launch).

### Group
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | string | |
| `creatorId` | FK → User | |
| `createdAt` | timestamp | |

### GroupMembership
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `groupId` | FK → Group | |
| `userId` | FK → User | |
| `role` | enum: `ADMIN`, `MEMBER` | creator is ADMIN by default |
| `joinedAt` | timestamp | |

Direct-add only — an ADMIN adds an existing friend to the group, no
accept step (friendship already implies mutual consent to visibility).
Any member can leave at any time; leaving must immediately revoke access
to the group's posts (see Phase 7 audit requirement).

### Post
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `posterId` | FK → User | |
| `placeName` | string | from places API |
| `placeId` | string | provider's place ID |
| `lat` / `lng` | decimal | geocoded destination |
| `note` | string, nullable | optional caption |
| `etaMode` | enum: `STATIC`, `LIVE` | chosen at creation, poster only |
| `declaredEta` | timestamp, nullable | self-declared arrival, used when `STATIC` |
| `posterLastLat` / `posterLastLng` | decimal, nullable | only populated while `etaMode = LIVE` |
| `posterLastLocationAt` | timestamp, nullable | |
| `visibilityScope` | enum: `ALL_FRIENDS`, `SPECIFIC_FRIENDS`, `GROUP` | |
| `groupId` | FK → Group, nullable | set only when scope = `GROUP` |
| `expiresAt` | timestamp | auto-expiry |
| `status` | enum: `ACTIVE`, `EXPIRED`, `CANCELLED` | |
| `createdAt` | timestamp | |

Choosing `etaMode = LIVE` at creation is the poster's consent for their
whole visibility-scoped audience to see live position/ETA — no separate
per-viewer gate on the poster's side.

Live ETA (poster and any opted-in responder) recomputes on a **30s
server-side throttle**, decoupled from raw GPS ping frequency, to bound
routing-API cost and battery use.

`CANCELLED` and `EXPIRED` posts must become unreadable via the API, not
just hidden in the UI — same authorization path as a normal read.

### PostVisibility
Explicit allow-list, used only when `visibilityScope = SPECIFIC_FRIENDS`.

| Field | Type |
|---|---|
| `postId` | FK → Post |
| `userId` | FK → User |

### Response
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `postId` | FK → Post | |
| `userId` | FK → User | |
| `status` | enum: `GOING`, `MAYBE`, `CANT`, `ARRIVED` | |
| `sharingEta` | boolean, default `false` | explicit opt-in, set by the responder |
| `lastLat` / `lastLng` | decimal, nullable | only populated while `sharingEta = true` |
| `lastLocationAt` | timestamp, nullable | |
| `createdAt` / `updatedAt` | timestamp | |

Toggling `sharingEta` to `false` must null out `lastLat`/`lastLng`
immediately, not just flip the flag.

## Authorization rules (highest scrutiny — treat as security-critical, not routine CRUD)

1. **Post read scoping.** A user may read a `Post` only if:
   - they are `posterId`, or
   - `status = ACTIVE` and `expiresAt` has not passed, **and**
   - `visibilityScope = ALL_FRIENDS` and an `ACCEPTED` Friendship exists with the poster, or
   - `visibilityScope = SPECIFIC_FRIENDS` and a `PostVisibility` row exists for them, or
   - `visibilityScope = GROUP` and they hold a current `GroupMembership` in `groupId`.

   This must be enforced as a query-level filter (e.g. a WHERE clause
   scoped to the requester), not a post-fetch-then-check in application
   code — the latter is easy to accidentally bypass in a new endpoint.

2. **Responder ETA/location visibility.** Only `post.posterId` may ever
   read another user's `Response.lastLat/lastLng` or a computed ETA for
   that response, and only when that response's `sharingEta = true`.
   Other responders never see each other's ETA or location — only their
   own status is visible in the shared list.

3. **Poster live position visibility.** `Post.posterLastLat/Lng` follows
   the same read rule as the Post itself (rule 1) — anyone who can read
   the post can see the poster's live position when `etaMode = LIVE`.

4. **ETA is server-computed, never raw coordinates in transit to a
   third party.** The routing-API call (friend's coords + post
   destination) happens server-side; only the resulting ETA value is
   returned to the poster. Raw `lastLat/lastLng` are never sent to
   anyone but the owning user themselves.

5. **Group-leave and unfriend revoke access immediately** — a
   `GroupMembership` delete or `Friendship` delete must cut off Post
   read access on the very next request, no caching/staleness window.

## Deferred (do not build in current phases)
Location chaining, algorithmic feed, venue/business accounts, native
mobile app, `Block`/report entity, group-invite accept flow, OAuth login.
