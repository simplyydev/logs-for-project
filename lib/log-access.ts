import type { LogRow, PublicLog } from './types';

export function toPublicLog(row: LogRow): PublicLog {
  return {
    timestamp: row.timestamp,
    kind: row.kind,
    title: row.title,
    description: row.description_public || 'Hidden. Sign in as admin to view full operational details.',
    approvalStatus: (row.approval_status as PublicLog['approvalStatus']) || 'none',
    files: row.files_public || [],
    command: row.command_public || 'hidden',
    taskId: row.task_id,
    progress: row.progress
  };
}

export function toAdminLog(row: LogRow): PublicLog {
  return {
    timestamp: row.timestamp,
    kind: row.kind,
    title: row.title,
    description: row.description_full || row.description_public || '',
    approvalStatus: (row.approval_status as PublicLog['approvalStatus']) || 'none',
    files: row.files_full || row.files_public || [],
    command: row.command_full || row.command_public || 'n/a',
    taskId: row.task_id,
    progress: row.progress
  };
}
