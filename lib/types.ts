export type ApprovalStatus = 'approved' | 'denied' | 'none';

export type LogRow = {
  id: string;
  timestamp: string;
  kind: string;
  title: string;
  description_full: string | null;
  description_public: string | null;
  approval_status: ApprovalStatus | null;
  files_full: string[] | null;
  files_public: string[] | null;
  command_full: string | null;
  command_public: string | null;
  task_id: string | null;
  progress: number | null;
  visibility: string | null;
  created_at: string;
};

export type PublicLog = {
  timestamp: string;
  kind: string;
  title: string;
  description: string;
  approvalStatus: ApprovalStatus | 'none';
  files: string[];
  command: string;
  taskId?: string | null;
  progress?: number | null;
};
