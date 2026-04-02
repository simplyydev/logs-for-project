# Phase 2C Sync Plan

## What exists now
- Local JSONL log stream: `workspace/logs/changes.jsonl`
- Supabase schema for logs
- Sync script scaffold in `sync/sync-logs.mjs`

## How it works
1. Read all log lines
2. Skip rows already synced using `workspace/logs/sync-state.json`
3. Transform each row into:
   - full/admin fields
   - public/redacted fields
4. Insert into Supabase
5. Save sync state

## Recommended next upgrades
- Add upsert logic with stable IDs
- Add retry handling
- Add cron/task scheduling
- Add smarter redaction rules
- Add polling or realtime on the website
