import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const logFile = path.resolve('C:/Users/Devendra/.openclaw/workspace/logs/changes.jsonl');
let timer = null;

function runSync() {
  const child = spawn(process.execPath, [path.resolve('C:/Users/Devendra/.openclaw/workspace/public-log-site/sync/sync-logs.mjs')], {
    stdio: 'inherit',
    env: process.env
  });
  child.on('exit', () => {});
}

fs.watch(logFile, { persistent: true }, () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => runSync(), 1200);
});

console.log('Watching changes.jsonl for updates...');
runSync();
