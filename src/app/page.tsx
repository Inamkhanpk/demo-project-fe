
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../src/app/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('demo@example.com');
  const [password, setPassword] = useState<string>('password');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow space-y-3 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>

        {error && (
          <div className="p-2 rounded bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button
          className="w-full px-3 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
