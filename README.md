# Tag Along

Post where you're heading and when. The friends you choose get notified, reply
going / maybe / can't, and the post expires on its own.

It is a small utility, not a social network: no feed algorithm, no public
profiles, and no permanent record of where you've been. Each post is visible
only to the audience you pick (all friends, specific friends, or one group).

## Status

In progress. Phase 1 of 8.

- Done: data model and API contract (`docs/`), frontend shell running on mock data.
- Next: Spring Boot backend skeleton, then real authentication.

The frontend currently has no backend behind it. Login accepts any email and
password, and all posts, friends and groups are sample data.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend (planned): Java, Spring Boot, Spring Security with JWT, PostgreSQL, WebSocket/STOMP

## Run the frontend

Requires Node.js 20.9 or newer.

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

## Repository layout

- `frontend/` — Next.js app
- `backend/` — Spring Boot service (not started yet)
- `docs/data-model.md` — entities and authorization rules
- `docs/openapi.yaml` — API contract
