import { createBrowserSupabase } from './supabase';

export async function getCurrentRole(): Promise<'admin' | 'viewer'> {
  if (typeof window === 'undefined') return 'viewer';
  const supabase = createBrowserSupabase();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return 'viewer';

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  return data?.role === 'admin' ? 'admin' : 'viewer';
}
