'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError('Login failed. Configure Supabase env vars and auth before production use.');
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <div>
          <div className="title">Admin Login</div>
          <div className="sub">Supabase auth wiring scaffold. Configure environment variables before use.</div>
        </div>
      </section>
      <section className="panel" style={{ maxWidth: 520 }}>
        <form className="grid" onSubmit={onSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <div className="meta" style={{ color: 'var(--bad)' }}>{error}</div> : null}
          <button className="button primary" type="submit">{loading ? 'Signing in…' : 'Continue'}</button>
        </form>
      </section>
    </main>
  );
}
