'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchLogs } from '@/lib/log-service';
import type { PublicLog } from '@/lib/types';
import { AutoRefresh } from '@/app/components/auto-refresh';
import { LivePill } from '@/app/components/live-pill';

export default function HomePage() {
  const supabase = createClient();

  const [logs, setLogs] = useState<PublicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim());

      const admin = user && adminEmails.includes(user.email || '');

      setIsAdmin(!!admin);

      const rows = await fetchLogs(admin ? 'admin' : 'viewer');
      setLogs(rows);
      setLoading(false);
    }

    init();
  }, []);

  const approved = useMemo(() => logs.filter(x => x.approvalStatus === 'approved').length, [logs]);
  const denied = useMemo(() => logs.filter(x => x.approvalStatus === 'denied').length, [logs]);
  const kinds = useMemo(() => new Set(logs.map(x => x.kind)).size, [logs]);

  return (
    <main className="container">
      <AutoRefresh seconds={8} />

      <section className="hero">
        <div>
          <div className="title">Elon Bust Logs</div>
          <div className="sub">
            Public view shows redacted operational activity. Admins get full visibility after login.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <LivePill />

          {!isAdmin && (
            <Link href="/login" className="button primary">
              Admin Login
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="button primary">
              Admin Panel
            </Link>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="grid stats">
          <div className="stat"><div className="k">Total Events</div><div className="v">{logs.length}</div></div>
          <div className="stat"><div className="k">Approved</div><div className="v">{approved}</div></div>
          <div className="stat"><div className="k">Denied</div><div className="v">{denied}</div></div>
          <div className="stat"><div className="k">Kinds</div><div className="v">{kinds}</div></div>
        </div>

        {loading && <div className="notice">Loading logs...</div>}

        <div className="cards">
          {logs.map((log) => (
            <article className="card" key={log.timestamp + log.title}>
              <div className="top">
                <div>
                  <div className="cardTitle">{log.title}</div>
                  <div className="meta">{log.timestamp} · {log.kind}</div>
                </div>

                <div className={`badge ${log.approvalStatus || ''}`}>
                  {log.approvalStatus || 'none'}
                </div>
              </div>

              <div className="desc">{log.description}</div>
              <div className="files">Files: {(log.files || []).join(', ')}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}