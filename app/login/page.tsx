'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid login');
      return;
    }

    // ✅ redirect AFTER cookies are set
    window.location.href = '/admin';
  }

  return (
    <main className="container">
      <section className="hero">
        <div>
          <div className="title">Admin Login</div>
          <div className="sub">
            Sign in to access full logs
          </div>
        </div>
      </section>

      <section className="panel" style={{ maxWidth: 520 }}>
        <form className="grid" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="meta" style={{ color: 'var(--bad)' }}>
              {error}
            </div>
          )}

          <button className="button primary" type="submit">
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}