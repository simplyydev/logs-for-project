'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { fetchLogs } from '@/lib/log-service';
import type { PublicLog } from '@/lib/types';
import { AutoRefresh } from '@/app/components/auto-refresh';
import { LivePill } from '@/app/components/live-pill';

function groupProgress(logs: PublicLog[]) {
  const map = new Map<string, PublicLog[]>();

  for (const log of logs) {
    const key = log.taskId || `${log.kind}:${log.title}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(log);
  }

  return Array.from(map.entries()).map(([taskId, items]) => ({
    taskId,
    latest: items[0],
    progress: Math.max(...items.map((x) => x.progress || 0))
  }));
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<PublicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [approval, setApproval] = useState('all');

  // 🔐 HARD BLOCK ACCESS
  useEffect(() => {
    async function protect() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        // ❌ NOT LOGGED IN → BLOCK
        router.replace('/login');
        return;
      }

      // ✅ LOGGED IN → allow
      setUser(data.user);

      const rows = await fetchLogs('admin');
      setLogs(rows);
      setLoading(false);
    }

    protect();
  }, []);

  const filtered = useMemo(() => logs.filter((log) => {
    if (approval !== 'all' && (log.approvalStatus || 'none') !== approval) return false;
    if (!query.trim()) return true;
    return JSON.stringify(log).toLowerCase().includes(query.toLowerCase());
  }), [logs, query, approval]);

  const approvals = filtered.filter((x) =>
    x.approvalStatus === 'approved' || x.approvalStatus === 'denied'
  );

  const progress = groupProgress(logs);

  // ⛔ PREVENT FLASH BEFORE AUTH CHECK
  if (!user) {
    return <div className="container">Checking access...</div>;
  }

  return (
    <main className="container">
      <AutoRefresh seconds={8} />

      <section className="hero">
        <div>
          <div className="title">Admin Log Console</div>
          <div className="sub">
            🔐 Secure view · full logs visible
          </div>
        </div>
        <LivePill />
      </section>

      <section className="panel">
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="select"
            value={approval}
            onChange={(e) => setApproval(e.target.value)}
          >
            <option value="all">All approvals</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
            <option value="none">No approval</option>
          </select>

          <button
            className="button ghost"
            onClick={() => location.reload()}
          >
            Refresh
          </button>

          {/* 📥 DOWNLOAD BUTTON */}
          <button
            className="button primary"
            onClick={() => {
              const blob = new Blob([JSON.stringify(logs, null, 2)], {
                type: 'application/json'
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'logs.json';
              a.click();
            }}
          >
            Download Logs
          </button>
        </div>

        {loading && <div className="notice">Loading logs…</div>}

        <div className="split">
          <div className="cards">
            {filtered.map((log) => (
              <article className="card" key={log.timestamp + log.title}>
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

                <div className="desc">{log.description}</div>

                <div className="files">
                  Files: {(log.files || []).join(', ')}
                </div>

                <div className="meta" style={{ marginTop: 8 }}>
                  Command: {log.command}
                </div>
              </article>
            ))}
          </div>

          <div className="grid">
            <section className="card">
              <div className="cardTitle">Approvals</div>

              <div className="timeline" style={{ marginTop: 12 }}>
                {approvals.map((log) => (
                  <div className="timeRow" key={log.timestamp}>
                    <div className="timeStamp">
                      {log.timestamp.slice(11, 16)}
                    </div>
                    <div>
                      <div>{log.title}</div>
                      <div className={`badge ${log.approvalStatus}`}>
                        {log.approvalStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="cardTitle">Task Progress</div>

              <div className="timeline" style={{ marginTop: 12 }}>
                {progress.map((task) => (
                  <div key={task.taskId}>
                    <div className="top">
                      <div>
                        <div>{task.latest.title}</div>
                        <div className="meta">{task.taskId}</div>
                      </div>

                      <div className="badge approved">
                        {task.progress}%
                      </div>
                    </div>

                    <div className="progressBar">
                      <div
                        style={{
                          width: `${task.progress}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #31d0aa, #5ba7ff)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}