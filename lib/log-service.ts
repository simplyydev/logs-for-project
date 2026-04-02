import { createClient } from '@/utils/supabase/client';

export async function fetchLogs(role: 'admin' | 'viewer') {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 🔐 NOT LOGGED IN → ALWAYS VIEWER
  if (!user) {
    role = 'viewer';
  }

  // 🔐 OPTIONAL: EMAIL-BASED ADMIN CHECK
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim());

  const isAdmin = user && adminEmails.includes(user.email || '');

  if (!isAdmin) {
    role = 'viewer';
  }

  // ✅ SELECT BASED ON ROLE
  if (role === 'admin') {
    const { data } = await supabase.from('logs').select('*').order('timestamp', { ascending: false });
    return data || [];
  }

  // 👁 VIEWER → REDACTED DATA ONLY
  const { data } = await supabase
    .from('logs')
    .select(`
      id,
      timestamp,
      kind,
      title,
      approval_status,
      visibility
    `)
    .order('timestamp', { ascending: false });

  return (data || []).map(log => ({
    ...log,
    description: '***************',
    files: ['hidden'],
    command: 'hidden'
  }));
}