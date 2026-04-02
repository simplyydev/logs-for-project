import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const WORKSPACE_ROOT = path.resolve('C:/Users/Devendra/.openclaw/workspace');
const LOG_PATH = path.join(WORKSPACE_ROOT, 'logs', 'changes.jsonl');
const STATE_PATH = path.join(WORKSPACE_ROOT, 'logs', 'sync-state.json');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { syncedLineCount: 0 };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function redactText(text = '') {
  if (!text) return 'Hidden. Sign in as admin to view full operational details.';
  return 'Hidden. Sign in as admin to view full operational details.';
}

function redactFiles(files = []) {
  return files.map(() => 'hidden');
}

function redactCommand(command = '') {
  return command ? 'hidden' : 'hidden';
}

function mapEvent(raw) {
  return {
    timestamp: raw.timestamp,
    kind: raw.kind || 'unknown',
    title: raw.title || raw.kind || 'Change',
    description_full: raw.description || null,
    description_public: redactText(raw.description),
    approval_status: raw.approvalStatus || 'none',
    files_full: raw.files || [],
    files_public: redactFiles(raw.files || []),
    command_full: raw.command || null,
    command_public: redactCommand(raw.command),
    task_id: raw.taskId || null,
    progress: typeof raw.progress === 'number' ? raw.progress : 100,
    visibility: 'public_redacted'
  };
}

async function main() {
  const state = readState();
  const rawText = fs.readFileSync(LOG_PATH, 'utf8');
  const lines = rawText.split(/\r?\n/).filter(Boolean);
  const pending = lines.slice(state.syncedLineCount);

  if (pending.length === 0) {
    console.log('No new log rows to sync.');
    return;
  }

  const mapped = pending.map((line) => JSON.parse(line)).map(mapEvent);
  const { error } = await supabase.from('logs').insert(mapped);
  if (error) {
    console.error('Supabase insert failed:', error);
    process.exit(1);
  }

  writeState({ syncedLineCount: lines.length, lastSyncedAt: new Date().toISOString() });
  console.log(`Synced ${mapped.length} log rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
