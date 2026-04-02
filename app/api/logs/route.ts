import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode');
  const role = searchParams.get('role');

  const isAdmin = mode === 'full' && role === 'admin';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({
      ok: false,
      error: error.message
    });
  }

  return NextResponse.json({
    ok: true,
    role: isAdmin ? 'admin' : 'public',
    logs: data
  });
}