# GitHub → Vercel → Supabase Checklist

## 1. GitHub
- Push `public-log-site/` to a repo
- Keep `.env.local` out of git

## 2. Supabase
- Create project
- Run `supabase/schema.sql`
- Run `supabase/policies.sql`
- Create admin auth user
- Add user to `public.user_roles`

## 3. Vercel
- Import repo
- Set env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_EMAILS`
- Deploy

## 4. Local sync
- Add env for sync script
- Run `node sync/sync-logs.mjs`
- Later move to watch mode / scheduled sync

## 5. Verification
- public route shows redacted logs
- admin login works
- admin sees full logs
- new local logs appear after sync
