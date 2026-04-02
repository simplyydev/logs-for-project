import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    note: 'Role resolution should be implemented server-side with Supabase session verification.',
    role: 'viewer'
  });
}
