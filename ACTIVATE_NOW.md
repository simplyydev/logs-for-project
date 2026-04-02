# Activate Now

## 1. Frontend env (`public-log-site/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://ownwpemmhszagnzdivzt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
ADMIN_EMAILS=your-admin@email.com
```

## 2. Sync env (`public-log-site/sync/.env`)
```env
SUPABASE_URL=https://ownwpemmhszagnzdivzt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-rotated-service-role-key
```

## 3. Install deps
```bash
npm install
```

## 4. Start site locally
```bash
npm run dev
```

## 5. Push demo logs to Supabase
```bash
node sync/sync-logs.mjs
```

## 6. Optional watch mode
```bash
node sync/watch-sync.mjs
```

## 7. Deploy to Vercel
- Push to GitHub
- Import repo in Vercel
- Add env vars in Vercel project settings
- Deploy
