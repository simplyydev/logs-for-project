import { NextResponse } from 'next/server';
import { redactLogs, sampleLogs } from '@/lib/sample-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');
  const role = searchParams.get('role');
  const isAdmin = mode === 'full' && role === 'admin';
  return NextResponse.json({
    ok: true,
    role: isAdmin ? 'admin' : 'public',
    logs: isAdmin ? sampleLogs : redactLogs(sampleLogs)
  });
}
