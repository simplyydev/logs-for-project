import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchLogs } from '@/lib/log-service';
import type { PublicLog } from '@/lib/types';

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

export default async function AdminPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}
      }
    }
  );

  const { data } = await supabase.auth.getUser();

  // 🔒 BLOCK if not logged in
  if (!data.user) {
    redirect('/login');
  }

  // 🔒 OPTIONAL: restrict to YOUR email only
  const allowedAdmins = ['your@email.com'];

  if (!allowedAdmins.includes(data.user.email!)) {
    redirect('/');
  }

  // ✅ fetch FULL logs (admin access)
  const logs = await fetchLogs('admin');

  const approvals = logs.filter(
    (x) => x.approvalStatus === 'approved' || x.approvalStatus === 'denied'
  );

  const progress = groupProgress(logs);

  return (
    <main className="container">
      <section className="hero">
        <div>
          <div className="title">Admin Log Console</div>
          <div className="sub">
            Logged in as <strong>{data.user.email}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="split">
          {/* LOGS */}
          <div className="cards">
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

                <div className="desc">{log.description}</div>

                <div className="files">
                  Files: {(log.files || []).join(', ') || 'hidden'}
                </div>

                <div className="meta" style={{ marginTop: 8 }}>
                  Command: {log.command || 'hidden'}
                </div>
              </article>
            ))}
          </div>

          {/* SIDE PANEL */}
          <div className="grid">
            {/* APPROVALS */}
            <section className="card">
              <div className="cardTitle">Approvals</div>

              <div className="timeline" style={{ marginTop: 12 }}>
                {approvals.map((log) => (
                  <div
                    className="timeRow"
                    key={log.timestamp + log.title}
                  >
                    <div className="timeStamp">
                      {log.timestamp.slice(11, 16)}
                    </div>

                    <div>
                      <div>{log.title}</div>

                      <div
                        className={`badge ${log.approvalStatus || ''}`}
                        style={{ marginTop: 6 }}
                      >
                        {log.approvalStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROGRESS */}
            <section className="card">
              <div className="cardTitle">Task / Progress</div>

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

                    <div
                      style={{
                        marginTop: 8,
                        height: 10,
                        borderRadius: 999,
                        background: '#0a1730',
                        overflow: 'hidden',
                        border: '1px solid var(--border)'
                      }}
                    >
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