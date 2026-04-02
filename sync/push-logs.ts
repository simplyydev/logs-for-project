import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { sampleLogs } from '../lib/sample-data';

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "loaded" : "missing");

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const logsToInsert = sampleLogs.map(log => ({
    timestamp: log.timestamp,
    kind: log.kind,
    title: log.title,
    description_full: log.description,
    approval_status: log.approvalStatus,
    files_full: log.files,
    command_full: log.command,
    task_id: log.taskId,
    progress: log.progress,
    visibility: 'public_redacted'
  }));

  console.log("📦 Inserting logs:", logsToInsert.length);

  const { data, error } = await supabase
  .from('logs')
  .insert(logsToInsert)
  .select();

  if (error) {
    console.error('❌ Error inserting logs:', error);
  } else {
    console.log('✅ Logs inserted:', data);
  }
}

run();