# Supabase Setup

## 1. Create project
- Create a new Supabase project
- Copy project URL and anon key

## 2. Run SQL
Run these files in the Supabase SQL editor:
- `supabase/schema.sql`
- `supabase/policies.sql`

## 3. Create admin user
- Sign up using Supabase Auth
- Insert the user's `auth.users.id` into `public.user_roles` with role `admin`

Example:
```sql
insert into public.user_roles (user_id, role)
values ('YOUR-USER-UUID', 'admin');
```

## 4. Add env vars
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Sync real logs
Use the sync pipeline in `sync/`.

Required env:
```env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Run:
```bash
node sync/sync-logs.mjs
```

## 6. Important security note
Current scaffold is a strong start, but production-hardening still needs:
- server-side role validation for full log access
- optional realtime or polling refresh
- stronger field-aware redaction rules
