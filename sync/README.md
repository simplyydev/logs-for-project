# Log Sync Pipeline

This sync script pushes `workspace/logs/changes.jsonl` into Supabase.

## Required env
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Run
```bash
node sync/sync-logs.mjs
```

## Behavior
- Reads `workspace/logs/changes.jsonl`
- Tracks progress in `workspace/logs/sync-state.json`
- Inserts only new rows into Supabase
- Stores full and redacted/public fields separately
