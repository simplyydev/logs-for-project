'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCurrentRole } from '@/lib/auth';
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
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [logs, setLogs] = useState<PublicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [approval, setApproval] = useState('all');

  useEffect(() => {
    async function boot() {
      const resolvedRole = await getCurrentRole();
      setRole(resolvedRole);
      const rows = await fetchLogs(resolvedRole);
      setLogs(rows);
      setLoading(false);
    }
    boot();
  }, []);

  const filtered = useMemo(() => logs.filter((log) => {
    if (approval !== 'all' && (log.approvalStatus || 'none') !== approval) return false;
    if (!query.trim()) return true;
    return JSON.stringify(log).toLowerCase().includes(query.toLowerCase());
  }), [logs, query, approval]);

  const approvals = filtered.filter((x) => x.approvalStatus === 'approved' || x.approvalStatus === 'denied');
  const progress = groupProgress(logs);

  return (
    <main className="container">
      <AutoRefresh seconds={8} />
      <section className="hero">
        <div>
          <div className="title">Admin Log Console</div>
          <div className="sub">Role: <strong>{role}</strong> · non-admin users only see redacted entries.</div>
        </div>
        <LivePill />
      </section>

      <section className="panel">
        <div className="toolbar">
          <input className="input" placeholder="Search logs..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select" value={approval} onChange={(e) => setApproval(e.target.value)}>
            <option value="all">All approvals</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
            <option value="none">No approval</option>
          </select>
          <button className="button ghost" onClick={() => location.reload()}>Refresh</button>
        </div>

        {loading ? <div className="notice">Loading logs…</div> : null}

        <div className="split">
          <div className="cards">
            {filtered.map((log) => (
              <article className="card" key={log.timestamp + log.title}>
                <div className="top">
                  <div>
                    <div className="cardTitle">{log.title}</div>
                    <div className="meta">{log.timestamp} · {log.kind}</div>
                  </div>
                  <div className={`badge ${log.approvalStatus || ''}`}>{log.approvalStatus || 'none'}</div>
                </div>
                <div className="desc">{log.description}</div>
                <div className="files">Files: {(log.files || []).join(', ') || 'hidden'}</div>
                <div className="meta" style={{ marginTop: 8 }}>Command: {log.command || 'hidden'}</div>
              </article>
            ))}
          </div>

          <div className="grid">
            <section className="card">
              <div className="cardTitle">Approvals</div>
              <div className="timeline" style={{ marginTop: 12 }}>
                {approvals.map((log) => (
                  <div className="timeRow" key={log.timestamp + log.title + 'approval'}>
                    <div className="timeStamp">{log.timestamp.slice(11, 16)}</div>
                    <div>
                      <div>{log.title}</div>
                      <div className={`badge ${log.approvalStatus || ''}`} style={{ marginTop: 6 }}>{log.approvalStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="cardTitle">Task / Progress History</div>
              <div className="timeline" style={{ marginTop: 12 }}>
                {progress.map((task) => (
                  <div key={task.taskId}>
                    <div className="top">
                      <div>
                        <div>{task.latest.title}</div>
                        <div className="meta">{task.taskId}</div>
                      </div>
                      <div className="badge approved">{task.progress}%</div>
                    </div>
                    <div style={{ marginTop: 8, height: 10, borderRadius: 999, background: '#0a1730', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ width: `${task.progress}%`, height: '100%', background: 'linear-gradient(90deg, #31d0aa, #5ba7ff)' }} />
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
