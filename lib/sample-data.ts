export type LogEvent = {
  timestamp: string;
  kind: string;
  title: string;
  description: string;
  approvalStatus?: 'approved' | 'denied' | 'none';
  files?: string[];
  command?: string;
  progress?: number;
  taskId?: string;
};

export const sampleLogs: LogEvent[] = [
  {
    timestamp: '2026-04-02T07:03:00+05:30',
    kind: 'config',
    title: 'Telegram DM allowlist enabled',
    description: 'Locked Telegram DMs to approved user IDs only.',
    approvalStatus: 'approved',
    files: ['openclaw.json'],
    command: 'config patch via file edit',
    taskId: 'tg-lock',
    progress: 100
  },
  {
    timestamp: '2026-04-02T07:47:00+05:30',
    kind: 'dashboard',
    title: 'Protected canvas route reverted',
    description: 'Restored the original canvas page and moved toward a non-canvas dashboard delivery path.',
    approvalStatus: 'approved',
    files: ['canvas/index.html', 'dashboard/changes-viewer.html'],
    command: 'canvas revert + fallback dashboard write',
    taskId: 'dash-route',
    progress: 100
  },
  {
    timestamp: '2026-04-02T08:21:00+05:30',
    kind: 'document',
    title: 'Word-compatible CV created',
    description: 'Created a Word-compatible CV file for Rockstar Games application.',
    approvalStatus: 'approved',
    files: ['Devendra_Nath_Tiwari_CV.doc'],
    command: 'workspace file write',
    taskId: 'cv-doc',
    progress: 100
  }
];

export function redactLogs(logs: LogEvent[]): LogEvent[] {
  return logs.map((log) => ({
    ...log,
    description: 'Hidden. Sign in as admin to view full operational details.',
    files: (log.files || []).map(() => 'hidden'),
    command: 'hidden'
  }));
}
