'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchLogs } from '@/lib/log-service';
import type { PublicLog } from '@/lib/types';
import AutoRefresh from '@/app/components/auto-refresh';
import LivePill from '@/app/components/live-pill';

export default function HomePage() {
  const [logs, setLogs] = useState<PublicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      const rows = await fetchLogs('viewer');
      setLogs(rows);
      setLoading(false);
    }

    init();
  }, []);

  const approved = useMemo(
    () => logs.filter((x) => x.approvalStatus === 'approved').length,
    [logs]
  );

  const denied = useMemo(
    () => logs.filter((x) => x.approvalStatus === 'denied').length,
    [logs]
  );

  const kinds = useMemo(
    () => new Set(logs.map((x) => x.kind)).size,
    [logs]
  );

  return (
    <main className="container">
      <AutoRefresh seconds={8} />

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="title">Elon Bust Logs</div>
          <div className="sub">
            Public view shows redacted operational activity. Admins get full visibility after login.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <LivePill />

          {!user?.id && (
            <Link href="/login" className="button primary">
              Admin Login
            </Link>
          )}

          {user?.id && (
            <Link href="/admin" className="button primary">
              Admin Panel
            </Link>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="panel">
        <div className="grid stats">
          <div className="stat">
            <div className="k">Total Events</div>
            <div className="v">{logs.length}</div>
          </div>

          <div className="stat">
            <div className="k">Approved</div>
            <div className="v">{approved}</div>
          </div>

          <div className="stat">
            <div className="k">Denied</div>
            <div className="v">{denied}</div>
          </div>

          <div className="stat">
            <div className="k">Kinds</div>
            <div className="v">{kinds}</div>
          </div>
        </div>

        {loading && (
          <div className="notice">Loading public logs...</div>
        )}

        {/* LOG LIST */}
        <div className="list">
          {logs.map((log) => (
            <article
              className="card"
              key={log.timestamp + log.title}
            >
              <div className="top">
                <div>
                  <div className="cardTitle">{log.title}</div>
                  <div className="meta">
                    {log.timestamp} · {log.kind}
                  </div>
                </div>

                <div className={`badge ${log.approvalStatus || ''}`}>
                  {log.approvalStatus || 'none'}
                </div>
              </div>

              {/* REDACTED CONTENT */}
              <div className="desc">
                {log.description || '********'}
              </div>

              <div className="files">
                Files: {(log.files || []).join(', ') || 'hidden'}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}