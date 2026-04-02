import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function maskText(text: string) {
  if (!text) return '';
  return text[0] + '*'.repeat(Math.max(3, text.length - 1));
}

function redactLogs(logs: any[]) {
  return logs.map((log) => ({
    id: log.id,
    timestamp: log.timestamp,
    kind: log.kind,

    // Only show masked title
    title: maskText(log.title),

    // Everything else hidden
    description_full: '*****',
    files_full: [],
    command_full: '*****',
    approval_status: log.approval_status,
    progress: log.progress,
    visibility: log.visibility,
  }));
}

export async function GET() {
  const supabase = createClient();

  // 🔐 Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 📦 Fetch logs
  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const isLoggedIn = !!user;

  return NextResponse.json({
    ok: true,
    role: isLoggedIn ? 'authenticated' : 'public',

    // 🔥 KEY LOGIC
    logs: isLoggedIn ? logs : redactLogs(logs),
  });
}