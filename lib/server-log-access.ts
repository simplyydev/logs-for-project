import { createClient } from '@supabase/supabase-js';
import type { LogRow } from './types';
import { toAdminLog, toPublicLog } from './log-access';

function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function fetchServerLogs(role: 'admin' | 'viewer') {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(200);

  if (error || !data) return [];
  return (data as LogRow[]).map((row) => role === 'admin' ? toAdminLog(row) : toPublicLog(row));
}

export async function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const adminList = (process.env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  return adminList.includes(email.toLowerCase());
}
