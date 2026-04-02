'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { fetchLogs } from '@/lib/log-service';
import type { PublicLog } from '@/lib/types';

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const [logs, setLogs] = useState<PublicLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      // ❌ NOT LOGGED IN → REDIRECT
      if (!user) {
        router.push('/login');
        return;
      }

      // 🔐 EMAIL CHECK
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim());

      if (!adminEmails.includes(user.email || '')) {
        router.push('/');
        return;
      }

      // ✅ AUTHORIZED
      const rows = await fetchLogs('admin');
      setLogs(rows);
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) return <div className="container">Checking access...</div>;

  return (
    <main className="container">
      <h1>Admin Log Console</h1>

      {logs.map((log) => (
        <div key={log.timestamp + log.title} className="card">
          <h3>{log.title}</h3>
          <p>{log.description}</p>
        </div>
      ))}
    </main>
  );
}