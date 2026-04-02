import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ❌ NOT LOGGED IN → BLOCK HARD
  if (!user) {
    redirect('/login');
  }

  // 🔐 CHECK ADMIN EMAIL
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim());

  if (!adminEmails.includes(user.email || '')) {
    redirect('/');
  }

  // ✅ ONLY NOW FETCH LOGS
  const { data: logs } = await supabase.from('logs').select('*');

  return (
    <main className="container">
      <h1>Admin Log Console</h1>

      {logs?.map((log: any) => (
        <div key={log.id} className="card">
          <h3>{log.title}</h3>
          <p>{log.description}</p>
        </div>
      ))}
    </main>
  );
}