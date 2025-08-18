import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state && location.state.from) || '/admin';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.session) {
        navigate(from, { replace: true });
      } else {
        setError('Unexpected error: No session returned.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Sign in with your admin credentials.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-[#4db848] text-white font-semibold hover:bg-[#399a38] transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-4 text-center">
          <p>
            Need an account? Create a user in your Supabase project and assign appropriate policies.
          </p>
          <p className="mt-2">
            <Link to="/" className="text-[#1A4D8F] hover:underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
