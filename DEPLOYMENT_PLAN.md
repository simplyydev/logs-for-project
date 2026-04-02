# Deployment Plan

## What exists now
- Beautiful Next.js UI scaffold
- Public redacted log feed
- Demo admin login shell
- Admin dashboard view with approvals and task/progress history
- API route stub for logs

## What must happen before real production use
1. Replace demo localStorage auth with real auth (NextAuth, Clerk, Auth.js, Supabase Auth, or custom JWT)
2. Replace sample log data with a real backend data source
3. Push the workspace `logs/changes.jsonl` stream into a hosted database or event ingestion layer
4. Add admin role checks on the server, not client-only
5. Add periodic refresh or websocket/SSE live updates
6. Deploy to Vercel
7. Run the local sync pipeline to push `workspace/logs/changes.jsonl` into Supabase

## Recommended production stack
- Frontend: Next.js on Vercel
- Auth: Clerk or NextAuth/Auth.js
- Data: Supabase / Neon / Postgres
- Live updates: polling first, then SSE/websocket if needed

## Public behavior
- Unauthenticated users see redacted logs only
- Non-admin authenticated users also see redacted logs
- Admin users see full logs
