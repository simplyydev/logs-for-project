import { createBrowserSupabase } from './supabase';
import { toAdminLog, toPublicLog } from './log-access';
import type { LogRow, PublicLog } from './types';

export async function fetchLogs(role: 'admin' | 'viewer'): Promise<PublicLog[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error || !data) {
    console.error('Failed to load logs', error);
    return [];
  }

  return (data as LogRow[]).map((row) => role === 'admin' ? toAdminLog(row) : toPublicLog(row));
}
