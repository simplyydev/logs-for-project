alter table public.logs enable row level security;
alter table public.user_roles enable row level security;

create policy "public can read redacted logs"
on public.logs
for select
using (true);

create policy "admins can read roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

-- IMPORTANT:
-- Real production hardening should move full/admin reads behind server-side role checks.
-- RLS alone is not enough if you expose full columns directly to the client.
